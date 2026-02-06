import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'nl' | 'de' | 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('travelbutts-language') as Language;
    if (savedLanguage && ['en', 'nl', 'de', 'fr', 'es'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('travelbutts-language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['nl'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.travelTools': 'Travel Tools',
    'nav.blog': 'Blog',
    'nav.shop': 'Shop',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.loggingIn': 'Logging in...',
    
    // Travel Tools
    'tools.tripRandomizer': 'Trip Randomizer',
    'tools.printOnDemand': 'Print on Demand Products',
    'tools.trainVsFlight': 'Train vs Flight Prices',
    'tools.packingList': 'Packing List',
    'tools.geographyQuiz': 'Geography Quiz',
    'tools.travelStyleQuiz': 'Travel Style Quiz',
    
    // Blog Section
    'blog.title': 'Latest Stories & Media',
    'blog.subtitle': 'Discover travel inspiration through our blog posts and Instagram adventures',
    'blog.tab': 'Blog Posts',
    'blog.instagramTab': 'Instagram Feed',
    'blog.readMore': 'Read more',
    'blog.noPosts': 'No blog posts yet. Check back soon for travel stories!',
    'blog.addPost': 'Add Blog Post',
    'blog.viewCount': 'views',
    
    // Pagination
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.page': 'Page',
    'pagination.of': 'of',
    
    // Instagram
    'instagram.followAdventures': 'Follow Our Adventures',
    'instagram.description': 'Check out our latest travel photos and videos from around the world! Follow us on Instagram for daily travel inspiration and behind-the-scenes content.',
    'instagram.viewOnInstagram': 'View on Instagram',
    'instagram.video': 'Video',
    'instagram.image': 'Image',
    'instagram.link': 'Link',
    'instagram.viewPost': 'View Post',
    
    // Shop Section
    'shop.title': 'TravelButts Shop',
    'shop.buy': 'BUY',
    'shop.noProducts': 'No products available yet.',
    'shop.comingSoon': 'Shop Coming Soon',
    'shop.comingSoonDescription': 'We\'re curating amazing travel products and accessories for you. Check back soon for our handpicked selection of travel essentials!',
    'shop.addProduct': 'Add Product',
    'shop.productDetails': 'Product Details',
    'shop.buyNow': 'BUY NOW',
    'shop.redirectMessage': 'You\'ll be redirected to our partner\'s secure checkout',
    'shop.whyWeLove': 'Why We Love This Product',
    'shop.whyWeLoveDescription': 'Handpicked by the Travel Butts team for quality, functionality, and style. Perfect for enhancing your travel experience and making your adventures more memorable.',
    'shop.photos': 'photos',
    'shop.backToHome': 'Back to Home',
    'shop.searchProducts': 'Search products...',
    'shop.newestFirst': 'Newest First',
    'shop.priceLowToHigh': 'Price: Low to High',
    'shop.priceHighToLow': 'Price: High to Low',
    'shop.noProductsFound': 'No Products Found',
    'shop.noProductsFoundDescription': 'No products match your search. Try adjusting your search terms.',
    'shop.clearSearch': 'Clear Search',
    
    // Contact Section
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Got questions, ideas, or collab dreams? Let\'s chat!',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.consent': 'I agree to the privacy policy',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    
    // Footer
    'footer.brand': 'Travel Butts',
    'footer.description': 'Your ultimate travel companion for adventures around the world. Discover new destinations, plan your trip, and get inspired.',
    'footer.quickLinks': 'Quick Links',
    'footer.followUs': 'Follow Us',
    'footer.builtWith': 'Built with',
    'footer.using': 'using',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    
    // Profile Setup
    'profile.welcome': 'Welcome to Travel Butts!',
    'profile.subtitle': 'Complete your profile to start exploring amazing travel tools and content.',
    'profile.description': 'We need a few details to personalize your experience and help you connect with other travelers.',
    'profile.username': 'Username',
    'profile.usernameRequired': 'Username is required',
    'profile.usernameMinLength': 'Username must be at least 2 characters',
    'profile.usernameMaxLength': 'Username must be less than 50 characters',
    'profile.usernameInvalid': 'Username can only contain letters, numbers, spaces, hyphens, and underscores',
    'profile.usernameHelp': 'This will be your display name on the platform',
    'profile.email': 'Email Address',
    'profile.emailRequired': 'Email address is required',
    'profile.emailInvalid': 'Please enter a valid email address',
    'profile.emailHelp': 'We\'ll use this to send you travel tips and updates (you can unsubscribe anytime)',
    'profile.newsletter': 'Subscribe to our newsletter',
    'profile.newsletterDescription': 'Get travel tips, destination guides, and exclusive content delivered to your inbox. You can unsubscribe at any time.',
    'profile.language': 'Preferred Language',
    'profile.languageHelp': 'Choose your preferred language for the website',
    'profile.privacyTitle': 'Your Privacy Matters',
    'profile.privacyDescription': 'Your information is secure and will only be used to enhance your Travel Butts experience. We never share your data with third parties without your consent.',
    'profile.submit': 'Complete Registration',
    'profile.submitting': 'Creating Profile...',
    'profile.required': 'Required fields - All information is required to complete registration',
    
    // Loading
    'loading.text': 'Loading Travel Butts...',
    
    // Language Selector
    'language.select': 'Language',
  },
  nl: {
    // Header
    'nav.home': 'Home',
    'nav.travelTools': 'Reistools',
    'nav.blog': 'Blog',
    'nav.shop': 'Shop',
    'nav.admin': 'Admin',
    'nav.login': 'Inloggen',
    'nav.logout': 'Uitloggen',
    'nav.loggingIn': 'Inloggen...',
    
    // Travel Tools
    'tools.tripRandomizer': 'Trip Randomizer',
    'tools.printOnDemand': 'Print on Demand Producten',
    'tools.trainVsFlight': 'Trein vs Vliegtuig Prijzen',
    'tools.packingList': 'Paklijst',
    'tools.geographyQuiz': 'Aardrijkskunde Quiz',
    'tools.travelStyleQuiz': 'Reisstijl Quiz',
    
    // Blog Section
    'blog.title': 'Laatste Verhalen & Media',
    'blog.subtitle': 'Ontdek reisinspiratie via onze blogposts en Instagram-avonturen',
    'blog.tab': 'Blogposts',
    'blog.instagramTab': 'Instagram Feed',
    'blog.readMore': 'Lees meer',
    'blog.noPosts': 'Nog geen blogposts. Kom binnenkort terug voor reisverhalen!',
    'blog.addPost': 'Blogpost toevoegen',
    'blog.viewCount': 'weergaven',
    
    // Pagination
    'pagination.previous': 'Vorige',
    'pagination.next': 'Volgende',
    'pagination.page': 'Pagina',
    'pagination.of': 'van',
    
    // Instagram
    'instagram.followAdventures': 'Volg Onze Avonturen',
    'instagram.description': 'Bekijk onze laatste reisfoto\'s en video\'s van over de hele wereld! Volg ons op Instagram voor dagelijkse reisinspiratie en behind-the-scenes content.',
    'instagram.viewOnInstagram': 'Bekijk op Instagram',
    'instagram.video': 'Video',
    'instagram.image': 'Afbeelding',
    'instagram.link': 'Link',
    'instagram.viewPost': 'Bekijk Post',
    
    // Shop Section
    'shop.title': 'TravelButts Shop',
    'shop.buy': 'KOOP',
    'shop.noProducts': 'Nog geen producten beschikbaar.',
    'shop.comingSoon': 'Shop Komt Binnenkort',
    'shop.comingSoonDescription': 'We zijn geweldige reisproducten en accessoires voor je aan het samenstellen. Kom binnenkort terug voor onze handgekozen selectie reisbenodigdheden!',
    'shop.addProduct': 'Product Toevoegen',
    'shop.productDetails': 'Productdetails',
    'shop.buyNow': 'NU KOPEN',
    'shop.redirectMessage': 'Je wordt doorgestuurd naar de beveiligde checkout van onze partner',
    'shop.whyWeLove': 'Waarom We Dit Product Geweldig Vinden',
    'shop.whyWeLoveDescription': 'Handgekozen door het Travel Butts team voor kwaliteit, functionaliteit en stijl. Perfect om je reiservaring te verbeteren en je avonturen onvergetelijk te maken.',
    'shop.photos': 'foto\'s',
    'shop.backToHome': 'Terug naar Home',
    'shop.searchProducts': 'Zoek producten...',
    'shop.newestFirst': 'Nieuwste Eerst',
    'shop.priceLowToHigh': 'Prijs: Laag naar Hoog',
    'shop.priceHighToLow': 'Prijs: Hoog naar Laag',
    'shop.noProductsFound': 'Geen Producten Gevonden',
    'shop.noProductsFoundDescription': 'Geen producten komen overeen met je zoekopdracht. Probeer je zoektermen aan te passen.',
    'shop.clearSearch': 'Zoekopdracht Wissen',
    
    // Contact Section
    'contact.title': 'Neem Contact Op',
    'contact.subtitle': 'Heb je vragen, ideeën of samenwerkingsdromen? Laten we praten!',
    'contact.name': 'Volledige Naam',
    'contact.email': 'E-mail',
    'contact.subject': 'Onderwerp',
    'contact.message': 'Bericht',
    'contact.consent': 'Ik ga akkoord met het privacybeleid',
    'contact.send': 'Verstuur Bericht',
    'contact.sending': 'Verzenden...',
    
    // Footer
    'footer.brand': 'Travel Butts',
    'footer.description': 'Jouw ultieme reiscompagnon voor avonturen over de hele wereld. Ontdek nieuwe bestemmingen, plan je reis en laat je inspireren.',
    'footer.quickLinks': 'Snelle Links',
    'footer.followUs': 'Volg Ons',
    'footer.builtWith': 'Gebouwd met',
    'footer.using': 'met',
    'footer.privacy': 'Privacybeleid',
    'footer.terms': 'Algemene Voorwaarden',
    
    // Profile Setup
    'profile.welcome': 'Welkom bij Travel Butts!',
    'profile.subtitle': 'Voltooi je profiel om geweldige reistools en content te ontdekken.',
    'profile.description': 'We hebben een paar details nodig om je ervaring te personaliseren en je te helpen verbinding te maken met andere reizigers.',
    'profile.username': 'Gebruikersnaam',
    'profile.usernameRequired': 'Gebruikersnaam is verplicht',
    'profile.usernameMinLength': 'Gebruikersnaam moet minimaal 2 tekens bevatten',
    'profile.usernameMaxLength': 'Gebruikersnaam moet minder dan 50 tekens bevatten',
    'profile.usernameInvalid': 'Gebruikersnaam mag alleen letters, cijfers, spaties, streepjes en underscores bevatten',
    'profile.usernameHelp': 'Dit wordt je weergavenaam op het platform',
    'profile.email': 'E-mailadres',
    'profile.emailRequired': 'E-mailadres is verplicht',
    'profile.emailInvalid': 'Voer een geldig e-mailadres in',
    'profile.emailHelp': 'We gebruiken dit om je reistips en updates te sturen (je kunt je altijd afmelden)',
    'profile.newsletter': 'Abonneer op onze nieuwsbrief',
    'profile.newsletterDescription': 'Ontvang reistips, bestemmingsgidsen en exclusieve content in je inbox. Je kunt je op elk moment afmelden.',
    'profile.language': 'Voorkeurstaal',
    'profile.languageHelp': 'Kies je voorkeurstaal voor de website',
    'profile.privacyTitle': 'Jouw Privacy is Belangrijk',
    'profile.privacyDescription': 'Je informatie is veilig en wordt alleen gebruikt om je Travel Butts-ervaring te verbeteren. We delen je gegevens nooit met derden zonder je toestemming.',
    'profile.submit': 'Registratie Voltooien',
    'profile.submitting': 'Profiel Aanmaken...',
    'profile.required': 'Verplichte velden - Alle informatie is vereist om de registratie te voltooien',
    
    // Loading
    'loading.text': 'Travel Butts laden...',
    
    // Language Selector
    'language.select': 'Taal',
  },
  de: {
    // Header
    'nav.home': 'Startseite',
    'nav.travelTools': 'Reise-Tools',
    'nav.blog': 'Blog',
    'nav.shop': 'Shop',
    'nav.admin': 'Admin',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'nav.loggingIn': 'Anmelden...',
    
    // Travel Tools
    'tools.tripRandomizer': 'Reise-Randomizer',
    'tools.printOnDemand': 'Print-on-Demand-Produkte',
    'tools.trainVsFlight': 'Zug vs. Flug Preise',
    'tools.packingList': 'Packliste',
    'tools.geographyQuiz': 'Geografie-Quiz',
    'tools.travelStyleQuiz': 'Reisestil-Quiz',
    
    // Blog Section
    'blog.title': 'Neueste Geschichten & Medien',
    'blog.subtitle': 'Entdecken Sie Reiseinspiration durch unsere Blogbeiträge und Instagram-Abenteuer',
    'blog.tab': 'Blogbeiträge',
    'blog.instagramTab': 'Instagram-Feed',
    'blog.readMore': 'Mehr lesen',
    'blog.noPosts': 'Noch keine Blogbeiträge. Schauen Sie bald wieder vorbei für Reisegeschichten!',
    'blog.addPost': 'Blogbeitrag hinzufügen',
    'blog.viewCount': 'Aufrufe',
    
    // Pagination
    'pagination.previous': 'Zurück',
    'pagination.next': 'Weiter',
    'pagination.page': 'Seite',
    'pagination.of': 'von',
    
    // Instagram
    'instagram.followAdventures': 'Folgen Sie unseren Abenteuern',
    'instagram.description': 'Sehen Sie sich unsere neuesten Reisefotos und -videos aus der ganzen Welt an! Folgen Sie uns auf Instagram für tägliche Reiseinspiration und Behind-the-Scenes-Inhalte.',
    'instagram.viewOnInstagram': 'Auf Instagram ansehen',
    'instagram.video': 'Video',
    'instagram.image': 'Bild',
    'instagram.link': 'Link',
    'instagram.viewPost': 'Beitrag ansehen',
    
    // Shop Section
    'shop.title': 'TravelButts Shop',
    'shop.buy': 'KAUFEN',
    'shop.noProducts': 'Noch keine Produkte verfügbar.',
    'shop.comingSoon': 'Shop Kommt Bald',
    'shop.comingSoonDescription': 'Wir stellen erstaunliche Reiseprodukte und Accessoires für Sie zusammen. Schauen Sie bald wieder vorbei für unsere handverlesene Auswahl an Reiseutensilien!',
    'shop.addProduct': 'Produkt Hinzufügen',
    'shop.productDetails': 'Produktdetails',
    'shop.buyNow': 'JETZT KAUFEN',
    'shop.redirectMessage': 'Sie werden zur sicheren Kasse unseres Partners weitergeleitet',
    'shop.whyWeLove': 'Warum Wir Dieses Produkt Lieben',
    'shop.whyWeLoveDescription': 'Handverlesen vom Travel Butts Team für Qualität, Funktionalität und Stil. Perfekt, um Ihre Reiseerfahrung zu verbessern und Ihre Abenteuer unvergesslicher zu machen.',
    'shop.photos': 'Fotos',
    'shop.backToHome': 'Zurück zur Startseite',
    'shop.searchProducts': 'Produkte suchen...',
    'shop.newestFirst': 'Neueste Zuerst',
    'shop.priceLowToHigh': 'Preis: Niedrig bis Hoch',
    'shop.priceHighToLow': 'Preis: Hoch bis Niedrig',
    'shop.noProductsFound': 'Keine Produkte Gefunden',
    'shop.noProductsFoundDescription': 'Keine Produkte entsprechen Ihrer Suche. Versuchen Sie, Ihre Suchbegriffe anzupassen.',
    'shop.clearSearch': 'Suche Löschen',
    
    // Contact Section
    'contact.title': 'Kontakt aufnehmen',
    'contact.subtitle': 'Haben Sie Fragen, Ideen oder Kooperationsträume? Lassen Sie uns reden!',
    'contact.name': 'Vollständiger Name',
    'contact.email': 'E-Mail',
    'contact.subject': 'Betreff',
    'contact.message': 'Nachricht',
    'contact.consent': 'Ich stimme der Datenschutzerklärung zu',
    'contact.send': 'Nachricht senden',
    'contact.sending': 'Senden...',
    
    // Footer
    'footer.brand': 'Travel Butts',
    'footer.description': 'Ihr ultimativer Reisebegleiter für Abenteuer auf der ganzen Welt. Entdecken Sie neue Ziele, planen Sie Ihre Reise und lassen Sie sich inspirieren.',
    'footer.quickLinks': 'Schnelllinks',
    'footer.followUs': 'Folgen Sie uns',
    'footer.builtWith': 'Erstellt mit',
    'footer.using': 'mit',
    'footer.privacy': 'Datenschutzerklärung',
    'footer.terms': 'Nutzungsbedingungen',
    
    // Profile Setup
    'profile.welcome': 'Willkommen bei Travel Butts!',
    'profile.subtitle': 'Vervollständigen Sie Ihr Profil, um erstaunliche Reise-Tools und Inhalte zu entdecken.',
    'profile.description': 'Wir benötigen einige Details, um Ihre Erfahrung zu personalisieren und Ihnen zu helfen, sich mit anderen Reisenden zu verbinden.',
    'profile.username': 'Benutzername',
    'profile.usernameRequired': 'Benutzername ist erforderlich',
    'profile.usernameMinLength': 'Benutzername muss mindestens 2 Zeichen lang sein',
    'profile.usernameMaxLength': 'Benutzername muss weniger als 50 Zeichen lang sein',
    'profile.usernameInvalid': 'Benutzername darf nur Buchstaben, Zahlen, Leerzeichen, Bindestriche und Unterstriche enthalten',
    'profile.usernameHelp': 'Dies wird Ihr Anzeigename auf der Plattform sein',
    'profile.email': 'E-Mail-Adresse',
    'profile.emailRequired': 'E-Mail-Adresse ist erforderlich',
    'profile.emailInvalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    'profile.emailHelp': 'Wir verwenden diese, um Ihnen Reisetipps und Updates zu senden (Sie können sich jederzeit abmelden)',
    'profile.newsletter': 'Newsletter abonnieren',
    'profile.newsletterDescription': 'Erhalten Sie Reisetipps, Reiseführer und exklusive Inhalte in Ihrem Posteingang. Sie können sich jederzeit abmelden.',
    'profile.language': 'Bevorzugte Sprache',
    'profile.languageHelp': 'Wählen Sie Ihre bevorzugte Sprache für die Website',
    'profile.privacyTitle': 'Ihre Privatsphäre ist wichtig',
    'profile.privacyDescription': 'Ihre Informationen sind sicher und werden nur verwendet, um Ihre Travel Butts-Erfahrung zu verbessern. Wir geben Ihre Daten niemals ohne Ihre Zustimmung an Dritte weiter.',
    'profile.submit': 'Registrierung abschließen',
    'profile.submitting': 'Profil erstellen...',
    'profile.required': 'Pflichtfelder - Alle Informationen sind erforderlich, um die Registrierung abzuschließen',
    
    // Loading
    'loading.text': 'Travel Butts wird geladen...',
    
    // Language Selector
    'language.select': 'Sprache',
  },
  fr: {
    // Header
    'nav.home': 'Accueil',
    'nav.travelTools': 'Outils de Voyage',
    'nav.blog': 'Blog',
    'nav.shop': 'Boutique',
    'nav.admin': 'Admin',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.loggingIn': 'Connexion...',
    
    // Travel Tools
    'tools.tripRandomizer': 'Générateur de Voyage',
    'tools.printOnDemand': 'Produits à la Demande',
    'tools.trainVsFlight': 'Prix Train vs Avion',
    'tools.packingList': 'Liste de Bagages',
    'tools.geographyQuiz': 'Quiz de Géographie',
    'tools.travelStyleQuiz': 'Quiz de Style de Voyage',
    
    // Blog Section
    'blog.title': 'Dernières Histoires & Médias',
    'blog.subtitle': 'Découvrez l\'inspiration de voyage à travers nos articles de blog et aventures Instagram',
    'blog.tab': 'Articles de Blog',
    'blog.instagramTab': 'Flux Instagram',
    'blog.readMore': 'Lire la suite',
    'blog.noPosts': 'Pas encore d\'articles de blog. Revenez bientôt pour des histoires de voyage!',
    'blog.addPost': 'Ajouter un Article',
    'blog.viewCount': 'vues',
    
    // Pagination
    'pagination.previous': 'Précédent',
    'pagination.next': 'Suivant',
    'pagination.page': 'Page',
    'pagination.of': 'sur',
    
    // Instagram
    'instagram.followAdventures': 'Suivez Nos Aventures',
    'instagram.description': 'Découvrez nos dernières photos et vidéos de voyage du monde entier! Suivez-nous sur Instagram pour une inspiration de voyage quotidienne et du contenu en coulisses.',
    'instagram.viewOnInstagram': 'Voir sur Instagram',
    'instagram.video': 'Vidéo',
    'instagram.image': 'Image',
    'instagram.link': 'Lien',
    'instagram.viewPost': 'Voir la Publication',
    
    // Shop Section
    'shop.title': 'Boutique TravelButts',
    'shop.buy': 'ACHETER',
    'shop.noProducts': 'Aucun produit disponible pour le moment.',
    'shop.comingSoon': 'Boutique Bientôt Disponible',
    'shop.comingSoonDescription': 'Nous sélectionnons des produits et accessoires de voyage incroyables pour vous. Revenez bientôt pour notre sélection soigneusement choisie d\'essentiels de voyage!',
    'shop.addProduct': 'Ajouter un Produit',
    'shop.productDetails': 'Détails du Produit',
    'shop.buyNow': 'ACHETER MAINTENANT',
    'shop.redirectMessage': 'Vous serez redirigé vers le paiement sécurisé de notre partenaire',
    'shop.whyWeLove': 'Pourquoi Nous Aimons Ce Produit',
    'shop.whyWeLoveDescription': 'Sélectionné par l\'équipe Travel Butts pour la qualité, la fonctionnalité et le style. Parfait pour améliorer votre expérience de voyage et rendre vos aventures plus mémorables.',
    'shop.photos': 'photos',
    'shop.backToHome': 'Retour à l\'Accueil',
    'shop.searchProducts': 'Rechercher des produits...',
    'shop.newestFirst': 'Plus Récents d\'Abord',
    'shop.priceLowToHigh': 'Prix: Bas à Élevé',
    'shop.priceHighToLow': 'Prix: Élevé à Bas',
    'shop.noProductsFound': 'Aucun Produit Trouvé',
    'shop.noProductsFoundDescription': 'Aucun produit ne correspond à votre recherche. Essayez d\'ajuster vos termes de recherche.',
    'shop.clearSearch': 'Effacer la Recherche',
    
    // Contact Section
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Des questions, des idées ou des rêves de collaboration? Discutons!',
    'contact.name': 'Nom Complet',
    'contact.email': 'E-mail',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.consent': 'J\'accepte la politique de confidentialité',
    'contact.send': 'Envoyer le Message',
    'contact.sending': 'Envoi...',
    
    // Footer
    'footer.brand': 'Travel Butts',
    'footer.description': 'Votre compagnon de voyage ultime pour des aventures dans le monde entier. Découvrez de nouvelles destinations, planifiez votre voyage et laissez-vous inspirer.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.followUs': 'Suivez-nous',
    'footer.builtWith': 'Créé avec',
    'footer.using': 'en utilisant',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    
    // Profile Setup
    'profile.welcome': 'Bienvenue sur Travel Butts!',
    'profile.subtitle': 'Complétez votre profil pour commencer à explorer d\'incroyables outils de voyage et contenus.',
    'profile.description': 'Nous avons besoin de quelques détails pour personnaliser votre expérience et vous aider à vous connecter avec d\'autres voyageurs.',
    'profile.username': 'Nom d\'utilisateur',
    'profile.usernameRequired': 'Le nom d\'utilisateur est requis',
    'profile.usernameMinLength': 'Le nom d\'utilisateur doit contenir au moins 2 caractères',
    'profile.usernameMaxLength': 'Le nom d\'utilisateur doit contenir moins de 50 caractères',
    'profile.usernameInvalid': 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres, des espaces, des tirets et des underscores',
    'profile.usernameHelp': 'Ce sera votre nom d\'affichage sur la plateforme',
    'profile.email': 'Adresse E-mail',
    'profile.emailRequired': 'L\'adresse e-mail est requise',
    'profile.emailInvalid': 'Veuillez entrer une adresse e-mail valide',
    'profile.emailHelp': 'Nous l\'utiliserons pour vous envoyer des conseils de voyage et des mises à jour (vous pouvez vous désabonner à tout moment)',
    'profile.newsletter': 'S\'abonner à notre newsletter',
    'profile.newsletterDescription': 'Recevez des conseils de voyage, des guides de destination et du contenu exclusif dans votre boîte de réception. Vous pouvez vous désabonner à tout moment.',
    'profile.language': 'Langue Préférée',
    'profile.languageHelp': 'Choisissez votre langue préférée pour le site web',
    'profile.privacyTitle': 'Votre Vie Privée Compte',
    'profile.privacyDescription': 'Vos informations sont sécurisées et ne seront utilisées que pour améliorer votre expérience Travel Butts. Nous ne partageons jamais vos données avec des tiers sans votre consentement.',
    'profile.submit': 'Terminer l\'Inscription',
    'profile.submitting': 'Création du Profil...',
    'profile.required': 'Champs obligatoires - Toutes les informations sont requises pour terminer l\'inscription',
    
    // Loading
    'loading.text': 'Chargement de Travel Butts...',
    
    // Language Selector
    'language.select': 'Langue',
  },
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.travelTools': 'Herramientas de Viaje',
    'nav.blog': 'Blog',
    'nav.shop': 'Tienda',
    'nav.admin': 'Admin',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.loggingIn': 'Iniciando sesión...',
    
    // Travel Tools
    'tools.tripRandomizer': 'Generador de Viajes',
    'tools.printOnDemand': 'Productos bajo Demanda',
    'tools.trainVsFlight': 'Precios Tren vs Avión',
    'tools.packingList': 'Lista de Equipaje',
    'tools.geographyQuiz': 'Quiz de Geografía',
    'tools.travelStyleQuiz': 'Quiz de Estilo de Viaje',
    
    // Blog Section
    'blog.title': 'Últimas Historias y Medios',
    'blog.subtitle': 'Descubre inspiración de viaje a través de nuestras publicaciones de blog y aventuras de Instagram',
    'blog.tab': 'Publicaciones de Blog',
    'blog.instagramTab': 'Feed de Instagram',
    'blog.readMore': 'Leer más',
    'blog.noPosts': '¡Aún no hay publicaciones de blog. Vuelve pronto para historias de viaje!',
    'blog.addPost': 'Agregar Publicación',
    'blog.viewCount': 'vistas',
    
    // Pagination
    'pagination.previous': 'Anterior',
    'pagination.next': 'Siguiente',
    'pagination.page': 'Página',
    'pagination.of': 'de',
    
    // Instagram
    'instagram.followAdventures': 'Sigue Nuestras Aventuras',
    'instagram.description': '¡Mira nuestras últimas fotos y videos de viaje de todo el mundo! Síguenos en Instagram para inspiración de viaje diaria y contenido detrás de escena.',
    'instagram.viewOnInstagram': 'Ver en Instagram',
    'instagram.video': 'Video',
    'instagram.image': 'Imagen',
    'instagram.link': 'Enlace',
    'instagram.viewPost': 'Ver Publicación',
    
    // Shop Section
    'shop.title': 'Tienda TravelButts',
    'shop.buy': 'COMPRAR',
    'shop.noProducts': 'Aún no hay productos disponibles.',
    'shop.comingSoon': 'Tienda Próximamente',
    'shop.comingSoonDescription': 'Estamos seleccionando increíbles productos y accesorios de viaje para ti. ¡Vuelve pronto para nuestra selección cuidadosamente elegida de esenciales de viaje!',
    'shop.addProduct': 'Agregar Producto',
    'shop.productDetails': 'Detalles del Producto',
    'shop.buyNow': 'COMPRAR AHORA',
    'shop.redirectMessage': 'Serás redirigido al pago seguro de nuestro socio',
    'shop.whyWeLove': 'Por Qué Amamos Este Producto',
    'shop.whyWeLoveDescription': 'Seleccionado por el equipo de Travel Butts por calidad, funcionalidad y estilo. Perfecto para mejorar tu experiencia de viaje y hacer tus aventuras más memorables.',
    'shop.photos': 'fotos',
    'shop.backToHome': 'Volver al Inicio',
    'shop.searchProducts': 'Buscar productos...',
    'shop.newestFirst': 'Más Recientes Primero',
    'shop.priceLowToHigh': 'Precio: Bajo a Alto',
    'shop.priceHighToLow': 'Precio: Alto a Bajo',
    'shop.noProductsFound': 'No Se Encontraron Productos',
    'shop.noProductsFoundDescription': 'Ningún producto coincide con tu búsqueda. Intenta ajustar tus términos de búsqueda.',
    'shop.clearSearch': 'Limpiar Búsqueda',
    
    // Contact Section
    'contact.title': 'Ponte en Contacto',
    'contact.subtitle': '¿Tienes preguntas, ideas o sueños de colaboración? ¡Hablemos!',
    'contact.name': 'Nombre Completo',
    'contact.email': 'Correo Electrónico',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.consent': 'Acepto la política de privacidad',
    'contact.send': 'Enviar Mensaje',
    'contact.sending': 'Enviando...',
    
    // Footer
    'footer.brand': 'Travel Butts',
    'footer.description': 'Tu compañero de viaje definitivo para aventuras alrededor del mundo. Descubre nuevos destinos, planifica tu viaje e inspírate.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.followUs': 'Síguenos',
    'footer.builtWith': 'Creado con',
    'footer.using': 'usando',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    
    // Profile Setup
    'profile.welcome': '¡Bienvenido a Travel Butts!',
    'profile.subtitle': 'Completa tu perfil para comenzar a explorar increíbles herramientas de viaje y contenido.',
    'profile.description': 'Necesitamos algunos detalles para personalizar tu experiencia y ayudarte a conectar con otros viajeros.',
    'profile.username': 'Nombre de Usuario',
    'profile.usernameRequired': 'El nombre de usuario es obligatorio',
    'profile.usernameMinLength': 'El nombre de usuario debe tener al menos 2 caracteres',
    'profile.usernameMaxLength': 'El nombre de usuario debe tener menos de 50 caracteres',
    'profile.usernameInvalid': 'El nombre de usuario solo puede contener letras, números, espacios, guiones y guiones bajos',
    'profile.usernameHelp': 'Este será tu nombre de visualización en la plataforma',
    'profile.email': 'Dirección de Correo Electrónico',
    'profile.emailRequired': 'La dirección de correo electrónico es obligatoria',
    'profile.emailInvalid': 'Por favor ingresa una dirección de correo electrónico válida',
    'profile.emailHelp': 'Lo usaremos para enviarte consejos de viaje y actualizaciones (puedes darte de baja en cualquier momento)',
    'profile.newsletter': 'Suscribirse a nuestro boletín',
    'profile.newsletterDescription': 'Recibe consejos de viaje, guías de destinos y contenido exclusivo en tu bandeja de entrada. Puedes darte de baja en cualquier momento.',
    'profile.language': 'Idioma Preferido',
    'profile.languageHelp': 'Elige tu idioma preferido para el sitio web',
    'profile.privacyTitle': 'Tu Privacidad Importa',
    'profile.privacyDescription': 'Tu información está segura y solo se utilizará para mejorar tu experiencia en Travel Butts. Nunca compartimos tus datos con terceros sin tu consentimiento.',
    'profile.submit': 'Completar Registro',
    'profile.submitting': 'Creando Perfil...',
    'profile.required': 'Campos obligatorios - Toda la información es necesaria para completar el registro',
    
    // Loading
    'loading.text': 'Cargando Travel Butts...',
    
    // Language Selector
    'language.select': 'Idioma',
  },
};
