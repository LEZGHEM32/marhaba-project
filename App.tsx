
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import AddOfferPage from './pages/AddOfferPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ReceiptPage from './pages/ReceiptPage';
import AuthModal from './components/AuthModal';
import { DataProvider } from './contexts/DataContext';

const AppContent = () => {
  const { language, dir } = useLanguage();
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return (
    <div className="bg-sand-light min-h-screen flex flex-col text-dark-blue dark:bg-dark-navy dark:text-gray-200">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offer/:id" element={<OfferDetailsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/add-offer" element={<AddOfferPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/receipt/:bookingId" element={<ReceiptPage />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  )
}

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;