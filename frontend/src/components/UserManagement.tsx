import React, { useState } from 'react';
import { Users, Shield, UserPlus, UserMinus, AlertTriangle, CheckCircle, User, Calendar, Crown, Copy, Mail, Heart, X } from 'lucide-react';
import { useGetAllUsers, useAssignUserRole } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserRole } from '../backend';
import { showToast } from '../utils/toast';

interface UserInfo {
  principal: string;
  profile?: {
    name: string;
    email: string;
    newsletter: boolean;
  };
  role: UserRole;
  isCurrentUser: boolean;
}

export default function UserManagement() {
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    user: UserInfo;
    newRole: UserRole;
  } | null>(null);
  
  const { data: users, refetch, isLoading } = useGetAllUsers();
  const { identity } = useInternetIdentity();
  const assignRole = useAssignUserRole();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleRoleChange = (user: UserInfo, newRole: UserRole) => {
    if (user.role === newRole) return;
    
    // Show confirmation dialog for role changes
    setShowConfirmDialog({ user, newRole });
  };

  const confirmRoleChange = async () => {
    if (!showConfirmDialog) return;

    const { user, newRole } = showConfirmDialog;

    try {
      await assignRole.mutateAsync({
        userPrincipal: user.principal,
        role: newRole
      });
      
      // Refetch to ensure we have the latest data
      await refetch();
      
    } catch (error) {
      console.error('Error changing user role:', error);
    } finally {
      setShowConfirmDialog(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`, 'success');
    }).catch(() => {
      showToast(`Failed to copy ${label}`, 'error');
    });
  };

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.admin:
        return <Shield className="w-4 h-4 text-accent" />;
      case UserRole.user:
        return <User className="w-4 h-4 text-secondary-light" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role: UserRole, isCurrentUser: boolean) => {
    if (role === UserRole.admin) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-accent bg-opacity-10 text-accent text-xs font-medium rounded-full">
          <Crown className="w-3 h-3" />
          <span>Admin</span>
          {isCurrentUser && <span>(You)</span>}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
        <User className="w-3 h-3" />
        <span>User</span>
        {isCurrentUser && <span>(You)</span>}
      </span>
    );
  };

  const getNewsletterBadge = (newsletter: boolean) => {
    if (newsletter) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          <Heart className="w-3 h-3" />
          <span>Subscribed</span>
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
        <X className="w-3 h-3" />
        <span>Not Subscribed</span>
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-secondary-light">Loading users...</p>
      </div>
    );
  }

  if (!users) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-secondary-light mx-auto mb-4" />
        <p className="text-secondary-light">No users found</p>
      </div>
    );
  }

  // Show all users in a single list, with admins clearly marked
  const allUsers = users.sort((a, b) => {
    // Sort by role first (admins first), then by name/principal
    if (a.role === UserRole.admin && b.role !== UserRole.admin) return -1;
    if (b.role === UserRole.admin && a.role !== UserRole.admin) return 1;
    
    const aName = a.profile?.name || a.principal;
    const bName = b.profile?.name || b.principal;
    return aName.localeCompare(bName);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-secondary">User Management</h3>
        <p className="text-sm text-secondary-light mt-1">
          Manage user roles and permissions. Total registered users: {users.length}
        </p>
      </div>

      {/* All Users Section */}
      <div className="bg-white border border-neutral-light rounded-lg">
        <div className="p-4 border-b border-neutral-light bg-gray-50">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-secondary" />
            <h4 className="font-semibold text-secondary">All Registered Users ({allUsers.length})</h4>
          </div>
        </div>
        
        <div className="p-4">
          {allUsers.length > 0 ? (
            <div className="space-y-4">
              {allUsers.map((user) => (
                <div key={user.principal} className={`rounded-lg p-4 border ${
                  user.role === UserRole.admin 
                    ? 'bg-accent/5 border-accent/20' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        user.role === UserRole.admin ? 'bg-accent' : 'bg-gray-100'
                      }`}>
                        {user.role === UserRole.admin ? (
                          <Crown className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-secondary-light" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                          <h5 className="font-semibold text-secondary text-lg">
                            {user.profile?.name || 'Anonymous User'}
                          </h5>
                          <div className="mt-1 sm:mt-0">
                            {getRoleBadge(user.role, user.isCurrentUser)}
                          </div>
                        </div>
                        
                        {/* User Details Table - Mobile Optimized */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                              <span className="text-sm font-medium text-secondary-light mb-1 sm:mb-0">Principal ID:</span>
                              <div className="flex items-center space-x-2">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-secondary break-all">
                                  <span className="sm:hidden">{user.principal}</span>
                                  <span className="hidden sm:inline">{formatPrincipal(user.principal)}</span>
                                </code>
                                <button
                                  onClick={() => copyToClipboard(user.principal, 'Principal ID')}
                                  className="p-1 text-secondary-light hover:text-secondary transition-colors flex-shrink-0"
                                  title="Copy Principal ID"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                              <span className="text-sm font-medium text-secondary-light mb-1 sm:mb-0">Username:</span>
                              <span className="text-sm text-secondary">
                                {user.profile?.name || 'Not set'}
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                              <span className="text-sm font-medium text-secondary-light mb-1 sm:mb-0">Email:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-secondary">
                                  {user.profile?.email || 'Not set'}
                                </span>
                                {user.profile?.email && (
                                  <button
                                    onClick={() => copyToClipboard(user.profile!.email, 'Email')}
                                    className="p-1 text-secondary-light hover:text-secondary transition-colors flex-shrink-0"
                                    title="Copy Email"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                              <span className="text-sm font-medium text-secondary-light mb-1 sm:mb-0">Newsletter:</span>
                              <div className="flex items-center space-x-1">
                                {user.profile ? getNewsletterBadge(user.profile.newsletter) : (
                                  <span className="text-sm text-gray-400">Not set</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1">
                              <span className="text-sm font-medium text-secondary-light mb-1 sm:mb-0">Role:</span>
                              <div className="flex items-center space-x-1">
                                {getRoleIcon(user.role)}
                                <span className="text-sm text-secondary capitalize">{user.role}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4">
                      {!user.isCurrentUser && (
                        <>
                          {user.role === UserRole.user && (
                            <button
                              onClick={() => handleRoleChange(user, UserRole.admin)}
                              disabled={assignRole.isPending}
                              className="flex items-center justify-center space-x-1 text-accent hover:text-accent-dark text-sm px-3 py-2 rounded hover:bg-accent hover:bg-opacity-10 transition-colors disabled:opacity-50 border border-accent/20"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Make Admin</span>
                            </button>
                          )}
                          {user.role === UserRole.admin && (
                            <button
                              onClick={() => handleRoleChange(user, UserRole.user)}
                              disabled={assignRole.isPending}
                              className="flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 text-sm px-3 py-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50 border border-red-200"
                            >
                              <UserMinus className="w-4 h-4" />
                              <span>Remove Admin</span>
                            </button>
                          )}
                        </>
                      )}
                      {user.isCurrentUser && (
                        <span className="text-xs text-secondary-light bg-blue-100 text-blue-700 px-3 py-2 rounded text-center">
                          Current User
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-secondary-light mx-auto mb-4" />
              <p className="text-secondary-light">No registered users found</p>
              <p className="text-sm text-secondary-light mt-2">
                Users will appear here when they complete registration on the site
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Management Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-blue-900 mb-2">User Management Guide</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Principal ID:</strong> Unique Internet Identity identifier for each user</li>
              <li>• <strong>Username:</strong> Display name chosen during registration (required for all users)</li>
              <li>• <strong>Email:</strong> Email address provided during registration (required for all users)</li>
              <li>• <strong>Newsletter:</strong> User's subscription preference for receiving newsletters</li>
              <li>• <strong>Admin Role:</strong> Full access to admin dashboard and user management</li>
              <li>• <strong>User Role:</strong> Standard access to public features only</li>
              <li>• Click the copy icon to copy a user's Principal ID or email to clipboard</li>
              <li>• Role changes take effect immediately and persist across all sessions</li>
              <li>• All registered users (both admins and regular users) are visible in this list</li>
              <li>• New users must complete registration with username, email, and newsletter preference before accessing the site</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary">Confirm Role Change</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary mb-4">
                Are you sure you want to {showConfirmDialog.newRole === UserRole.admin ? 'promote' : 'remove admin privileges from'} this user?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-secondary">User:</span>
                    <span className="text-secondary">
                      {showConfirmDialog.user.profile?.name || 'Anonymous User'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-medium text-secondary">Principal ID:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded font-mono text-secondary border break-all mt-1 sm:mt-0">
                      {formatPrincipal(showConfirmDialog.user.principal)}
                    </code>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-medium text-secondary">Role Change:</span>
                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                      {getRoleBadge(showConfirmDialog.user.role, showConfirmDialog.user.isCurrentUser)}
                      <span className="text-secondary-light">→</span>
                      {getRoleBadge(showConfirmDialog.newRole, showConfirmDialog.user.isCurrentUser)}
                    </div>
                  </div>
                </div>
              </div>
              
              {showConfirmDialog.newRole === UserRole.admin && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This user will gain full administrative privileges including the ability to manage other users, content, and site settings.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="px-4 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                disabled={assignRole.isPending}
                className="flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {assignRole.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>
                  {assignRole.isPending ? 'Updating...' : 'Confirm Change'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
