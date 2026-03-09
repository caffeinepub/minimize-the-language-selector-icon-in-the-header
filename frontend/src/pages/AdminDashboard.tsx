import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  FileText, 
  Mail, 
  Image, 
  Upload,
  Activity,
  Wrench,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  User,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Instagram,
  Brain,
  Package,
  Shield,
  UserCheck,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useIsAdmin, useGetAllBlogPosts, useGetAllContactSubmissions, useGetAllCapturedEmails, useGetAdminSettings, useUpdateAdminSettings, useDeleteBlogPost } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useFileUpload, useFileUrl, useFileList } from '../blob-storage/FileStorage';
import BlogPostModal from '../components/BlogPostModal';
import BlogViewModal from '../components/BlogViewModal';
import LogoUploader from '../components/LogoUploader';
import HeroImageUploader from '../components/HeroImageUploader';
import InstagramFeedManager from '../components/InstagramFeedManager';
import QuizManager from '../components/QuizManager';
import PackingListManager from '../components/PackingListManager';
import UserManagement from '../components/UserManagement';
import ShopProductManager from '../components/ShopProductManager';
import { AdminSettings, BlogPost } from '../backend';

interface TravelTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  comingSoon: boolean;
}

// Helper function to format scheduled date in Amsterdam timezone
const formatScheduledDate = (scheduledAt: bigint | undefined): string => {
  if (!scheduledAt) return '';
  
  const date = new Date(Number(scheduledAt) / 1000000);
  
  const formatter = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return formatter.format(date) + ' (Amsterdam)';
};

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: blogPosts, refetch: refetchBlogPosts } = useGetAllBlogPosts();
  const { data: contactSubmissions, refetch: refetchContacts } = useGetAllContactSubmissions();
  const { data: capturedEmails, refetch: refetchEmails } = useGetAllCapturedEmails();
  const { data: adminSettings, refetch: refetchSettings } = useGetAdminSettings();
  const { data: fileList, refetch: refetchFiles } = useFileList();
  const updateAdminSettings = useUpdateAdminSettings();
  const deleteBlogPost = useDeleteBlogPost();

  const [activeTab, setActiveTab] = useState<'overview' | 'blog' | 'contacts' | 'users' | 'tools' | 'media' | 'instagram' | 'shop' | 'quizzes' | 'packing' | 'settings'>('overview');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
  const [viewingPost, setViewingPost] = useState<BlogPost | undefined>(undefined);
  const [settingsForm, setSettingsForm] = useState<AdminSettings>({
    instagramApiKey: '',
    tiktokApiKey: '',
    comingSoonEnabled: false,
  });

  const [travelTools, setTravelTools] = useState<TravelTool[]>([
    {
      id: 'trip-randomizer',
      name: 'Trip Randomizer',
      description: 'Let us surprise you with your next perfect destination based on your preferences',
      enabled: true,
      comingSoon: true
    },
    {
      id: 'print-on-demand',
      name: 'Print on Demand Travel Products',
      description: 'Custom travel accessories and souvenirs designed just for your journey',
      enabled: true,
      comingSoon: true
    },
    {
      id: 'train-vs-flight',
      name: 'Train vs Flight Prices',
      description: 'Compare costs and travel times between train and flight options',
      enabled: true,
      comingSoon: true
    },
    {
      id: 'packing-list',
      name: 'Packing List',
      description: 'Smart packing lists tailored to your destination, weather, and activities',
      enabled: true,
      comingSoon: false
    },
    {
      id: 'geography-quiz',
      name: 'Geography Knowledge Quiz',
      description: 'Test your world knowledge and discover new places to explore',
      enabled: true,
      comingSoon: false
    },
    {
      id: 'travel-style-quiz',
      name: 'Travel Style Quiz',
      description: 'Find your perfect travel style and get personalized recommendations',
      enabled: true,
      comingSoon: false
    }
  ]);

  useEffect(() => {
    if (adminSettings) {
      setSettingsForm(adminSettings);
    }
  }, [adminSettings]);

  if (!isAdmin || !identity) {
    window.location.hash = '';
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Toegang Geweigerd</h1>
          <p className="text-secondary-light">Je hebt geen toestemming om het admin dashboard te openen.</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('nl-NL', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminSettings.mutateAsync(settingsForm);
      await refetchSettings();
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (confirm('Weet je zeker dat je deze blogpost wilt verwijderen?')) {
      try {
        await deleteBlogPost.mutateAsync(id);
        await refetchBlogPosts();
      } catch (error) {
        console.error('Failed to delete blog post:', error);
      }
    }
  };

  const handleViewPost = (post: BlogPost) => {
    setViewingPost(post);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowBlogModal(true);
  };

  const handleCloseBlogModal = () => {
    setShowBlogModal(false);
    setEditingPost(undefined);
    refetchBlogPosts();
  };

  const handleToolToggle = (toolId: string, field: 'enabled' | 'comingSoon') => {
    setTravelTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, [field]: !tool[field] }
        : tool
    ));
  };

  const handleRefreshData = async () => {
    try {
      await Promise.all([
        refetchBlogPosts(),
        refetchContacts(),
        refetchEmails(),
        refetchSettings(),
        refetchFiles()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overzicht', icon: Activity },
    { id: 'blog', label: 'Blogposts', icon: FileText },
    { id: 'contacts', label: 'Contactformulieren', icon: Mail },
    { id: 'users', label: 'Gebruikersbeheer', icon: UserCheck },
    { id: 'tools', label: 'Reistools', icon: Wrench },
    { id: 'media', label: 'Mediabeheer', icon: Image },
    { id: 'instagram', label: 'Instagram Feed', icon: Instagram },
    { id: 'shop', label: 'Shop Producten', icon: ShoppingBag },
    { id: 'quizzes', label: 'Quiz Beheer', icon: Brain },
    { id: 'packing', label: 'Paklijsten', icon: Package },
    { id: 'settings', label: 'Instellingen', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">Admin Dashboard</h1>
              <p className="text-secondary-light">Beheer je Travel Butts website</p>
            </div>
            <button
              onClick={handleRefreshData}
              className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-secondary px-4 py-2 rounded-lg border border-neutral-light transition-colors w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ververs Data</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 sm:mb-8">
          <div className="border-b border-neutral-light">
            <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-secondary-light hover:text-secondary hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-secondary-light">Blogposts</p>
                      <p className="text-lg sm:text-2xl font-bold text-secondary">{blogPosts?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-secondary-light">Contactformulieren</p>
                      <p className="text-lg sm:text-2xl font-bold text-secondary">{contactSubmissions?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-secondary-light">Email Abonnees</p>
                      <p className="text-lg sm:text-2xl font-bold text-secondary">{capturedEmails?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm font-medium text-secondary-light">Opgeslagen Bestanden</p>
                      <p className="text-lg sm:text-2xl font-bold text-secondary">{fileList?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Snelle Acties</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowBlogModal(true)}
                    className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900 text-xs sm:text-sm text-center">Maak Blogpost</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('media')}
                    className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Image className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900 text-xs sm:text-sm text-center">Beheer Media</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('users')}
                    className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <UserCheck className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900 text-xs sm:text-sm text-center">Beheer Gebruikers</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('instagram')}
                    className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900 text-xs sm:text-sm text-center">Beheer Instagram</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('shop')}
                    className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-900 text-xs sm:text-sm text-center">Beheer Shop</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('quizzes')}
                    className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <Brain className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900 text-xs sm:text-sm text-center">Beheer Quizzen</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h2 className="text-lg font-semibold text-secondary">Blogpost Beheer</h2>
                  <button
                    onClick={() => {
                      setEditingPost(undefined);
                      setShowBlogModal(true);
                    }}
                    className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    Nieuwe Post Toevoegen
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {blogPosts && blogPosts.length > 0 ? (
                  <div className="space-y-4">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="border border-neutral-light rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                              <h3 className="font-semibold text-secondary">{post.title}</h3>
                              <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 w-fit ${
                                  post.published 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {post.published ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  <span>{post.published ? 'Gepubliceerd' : 'Concept'}</span>
                                </span>
                                {post.scheduledAt && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 bg-blue-100 text-blue-800 w-fit">
                                    <Clock className="w-3 h-3" />
                                    <span>Gepland</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-secondary-light mb-3 line-clamp-2">{post.excerpt}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-light">
                              <span className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{post.author}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Aangemaakt: {formatDate(post.timestamp)}</span>
                              </span>
                              {post.publishedAt && (
                                <span className="flex items-center space-x-1 text-green-600">
                                  <Calendar className="w-3 h-3" />
                                  <span>Gepubliceerd: {formatDate(post.publishedAt)}</span>
                                </span>
                              )}
                              {post.scheduledAt && (
                                <span className="flex items-center space-x-1 text-blue-600">
                                  <Clock className="w-3 h-3" />
                                  <span>Gepland: {formatScheduledDate(post.scheduledAt)}</span>
                                </span>
                              )}
                              {post.tags.length > 0 && (
                                <span className="flex items-center space-x-1">
                                  <span>Tags: {post.tags.join(', ')}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 lg:ml-4">
                            <button 
                              onClick={() => handleViewPost(post)}
                              className="p-2 text-secondary-light hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Bekijk Post"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditPost(post)}
                              className="p-2 text-secondary-light hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Bewerk Post"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Verwijder Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                    <p className="text-secondary-light text-lg">Nog geen blogposts.</p>
                    <button
                      onClick={() => setShowBlogModal(true)}
                      className="mt-4 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Maak Je Eerste Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-secondary">Contactformulier Inzendingen</h2>
                  <span className="text-sm text-secondary-light">
                    {contactSubmissions?.length || 0} totale inzendingen
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {contactSubmissions && contactSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {contactSubmissions.map((submission) => (
                      <div key={submission.id} className="border border-neutral-light rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div>
                              <h3 className="font-semibold text-secondary">{submission.name}</h3>
                              <p className="text-sm text-secondary-light">{submission.email}</p>
                            </div>
                            <span className="text-xs text-secondary-light bg-gray-100 px-2 py-1 rounded w-fit">
                              {formatDate(submission.timestamp)}
                            </span>
                          </div>
                          {submission.consent && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded w-fit">
                              Toestemming Gegeven
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-secondary">
                            <span className="text-secondary-light">Onderwerp:</span> {submission.subject}
                          </p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-secondary text-sm leading-relaxed">{submission.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                    <p className="text-secondary-light text-lg">Nog geen contactinzendingen.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-6 h-6 text-accent" />
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">Gebruikersbeheer</h2>
                    <p className="text-sm text-secondary-light">Beheer gebruikersrollen en rechten</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <UserManagement />
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <h2 className="text-lg font-semibold text-secondary">Reistools Beheer</h2>
                <p className="text-sm text-secondary-light mt-1">Configureer en beheer je reistools</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {travelTools.map((tool) => (
                    <div key={tool.id} className="border border-neutral-light rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                            <h3 className="font-semibold text-secondary">{tool.name}</h3>
                            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                              {tool.enabled ? (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Ingeschakeld</span>
                                </span>
                              ) : (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center space-x-1">
                                  <XCircle className="w-3 h-3" />
                                  <span>Uitgeschakeld</span>
                                </span>
                              )}
                              {tool.comingSoon && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Binnenkort
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-secondary-light mb-3">{tool.description}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:ml-4">
                          <div className="flex items-center justify-between sm:justify-start space-x-2">
                            <span className="text-sm text-secondary-light">Ingeschakeld:</span>
                            <button
                              onClick={() => handleToolToggle(tool.id, 'enabled')}
                              className={`p-1 rounded transition-colors ${
                                tool.enabled ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'
                              }`}
                            >
                              {tool.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                            </button>
                          </div>
                          <div className="flex items-center justify-between sm:justify-start space-x-2">
                            <span className="text-sm text-secondary-light">Binnenkort:</span>
                            <button
                              onClick={() => handleToolToggle(tool.id, 'comingSoon')}
                              className={`p-1 rounded transition-colors ${
                                tool.comingSoon ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-gray-500'
                              }`}
                            >
                              {tool.comingSoon ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-neutral-light">
                  <h2 className="text-lg font-semibold text-secondary">Header Logo Beheer</h2>
                  <p className="text-sm text-secondary-light mt-1">Upload en beheer je site logo</p>
                </div>
                <div className="p-4 sm:p-6">
                  <LogoUploader />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-neutral-light">
                  <h2 className="text-lg font-semibold text-secondary">Hero Afbeelding Beheer</h2>
                  <p className="text-sm text-secondary-light mt-1">Upload en beheer je homepage hero afbeelding</p>
                </div>
                <div className="p-4 sm:p-6">
                  <HeroImageUploader />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-neutral-light">
                  <h2 className="text-lg font-semibold text-secondary">Bestandsopslag</h2>
                  <p className="text-sm text-secondary-light mt-1">Alle geüploade bestanden en media</p>
                </div>
                <div className="p-4 sm:p-6">
                  {fileList && fileList.length > 0 ? (
                    <div className="space-y-3">
                      {fileList.map((file) => (
                        <div key={file.path} className="flex items-center justify-between p-3 border border-neutral-light rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Image className="w-5 h-5 text-secondary-light" />
                            <div>
                              <p className="font-medium text-secondary text-sm">{file.path}</p>
                              <p className="text-xs text-secondary-light">Hash: {file.hash.substring(0, 16)}...</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Image className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                      <p className="text-secondary-light">Nog geen bestanden geüpload.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex items-center space-x-3">
                  <Instagram className="w-6 h-6 text-pink-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">Instagram Feed Beheer</h2>
                    <p className="text-sm text-secondary-light">Upload en beheer Instagram feed items met volledige CRUD functionaliteit</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <InstagramFeedManager />
              </div>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6 text-accent" />
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">Shop Product Beheer</h2>
                    <p className="text-sm text-secondary-light">Voeg toe, bewerk en beheer shop producten met meerdere afbeelding upload functionaliteit</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <ShopProductManager />
              </div>
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-accent" />
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">Quiz Beheer</h2>
                    <p className="text-sm text-secondary-light">Beheer vragen en inhoud voor zowel Aardrijkskunde als Reisstijl quizzen</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <QuizManager />
              </div>
            </div>
          )}

          {activeTab === 'packing' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-accent" />
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">Paklijst Beheer</h2>
                    <p className="text-sm text-secondary-light">Beheer categorieën en items voor de paklijst tool</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <PackingListManager />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-neutral-light">
                <h2 className="text-lg font-semibold text-secondary">Admin Instellingen</h2>
                <p className="text-sm text-secondary-light mt-1">Configureer je site instellingen en integraties</p>
              </div>
              <div className="p-4 sm:p-6">
                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="instagramApiKey" className="block text-sm font-medium text-secondary mb-2">
                        Instagram API Sleutel
                      </label>
                      <input
                        type="text"
                        id="instagramApiKey"
                        value={settingsForm.instagramApiKey}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, instagramApiKey: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Voer Instagram API sleutel in"
                      />
                      <p className="text-xs text-secondary-light mt-1">Gebruikt voor Instagram feed integratie (optioneel - handmatig beheer beschikbaar)</p>
                    </div>

                    <div>
                      <label htmlFor="tiktokApiKey" className="block text-sm font-medium text-secondary mb-2">
                        TikTok API Sleutel
                      </label>
                      <input
                        type="text"
                        id="tiktokApiKey"
                        value={settingsForm.tiktokApiKey}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, tiktokApiKey: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Voer TikTok API sleutel in"
                      />
                      <p className="text-xs text-secondary-light mt-1">Gebruikt voor TikTok inhoud integratie</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-4 sm:space-y-0">
                    <div>
                      <label htmlFor="comingSoonEnabled" className="block text-sm font-medium text-secondary">
                        Schakel Binnenkort Pagina's In
                      </label>
                      <p className="text-xs text-secondary-light mt-1">
                        Toon "Binnenkort" pagina's voor reistools in plaats van daadwerkelijke functionaliteit
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({ ...prev, comingSoonEnabled: !prev.comingSoonEnabled }))}
                      className={`p-1 rounded transition-colors ${
                        settingsForm.comingSoonEnabled ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {settingsForm.comingSoonEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-neutral-light">
                    <button
                      type="submit"
                      disabled={updateAdminSettings.isPending}
                      className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                    >
                      <Save className="w-4 h-4" />
                      <span>{updateAdminSettings.isPending ? 'Opslaan...' : 'Instellingen Opslaan'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {showBlogModal && (
        <BlogPostModal 
          onClose={handleCloseBlogModal}
          editPost={editingPost}
        />
      )}

      {viewingPost && (
        <BlogViewModal 
          post={viewingPost}
          onClose={() => setViewingPost(undefined)}
        />
      )}
    </div>
  );
}
