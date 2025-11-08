
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-blue text-white mt-12 dark:bg-dark-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start">
          <div>
            <h3 className="text-xl font-bold text-sand mb-4">MARHABA</h3>
            <p className="text-gray-300 dark:text-gray-400">
              {t('footerDescription')}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-sand dark:text-gray-400 dark:hover:text-sand">{t('home')}</Link></li>
              <li><Link to="/offers" className="text-gray-300 hover:text-sand dark:text-gray-400 dark:hover:text-sand">{t('browseOffers')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-sand dark:text-gray-400 dark:hover:text-sand">{t('aboutUs')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-sand dark:text-gray-400 dark:hover:text-sand">{t('contactUs')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">{t('legal')}</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-300 hover:text-sand dark:text-gray-400 dark:hover:text-sand">{t('privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-sand dark:text-gray-400 dark:hover:text-sand">{t('termsOfUse')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} MARHABA. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
