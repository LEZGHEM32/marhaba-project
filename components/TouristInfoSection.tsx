import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Plane, Stamp } from 'lucide-react';

const TouristInfoSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-white dark:bg-dark-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark-blue dark:text-white">{t('touristInfoTitle')}</h2>
          <p className="text-gray-600 mt-2 dark:text-gray-300">{t('touristInfoSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* E-Visa Card */}
          <div className="bg-sand-light/50 p-6 rounded-lg shadow-lg text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300 dark:bg-dark-navy">
            <div className="bg-sky-blue text-white rounded-full p-4 mb-4">
              <Stamp size={40} />
            </div>
            <h3 className="text-xl font-bold text-dark-blue mb-2 dark:text-white">{t('evisaTitle')}</h3>
            <p className="text-gray-600 mb-4 flex-grow dark:text-gray-300">{t('evisaDescription')}</p>
            <a 
              href="https://visa.mfa.gov.dz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto inline-block bg-dark-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition duration-300 dark:bg-dark-navy dark:hover:bg-opacity-100 dark:ring-1 dark:ring-gray-600"
            >
              {t('evisaButton')}
            </a>
          </div>
          {/* Flights Card */}
          <div className="bg-sand-light/50 p-6 rounded-lg shadow-lg text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300 dark:bg-dark-navy">
             <div className="bg-sky-blue text-white rounded-full p-4 mb-4">
              <Plane size={40} />
            </div>
            <h3 className="text-xl font-bold text-dark-blue mb-2 dark:text-white">{t('flightsTitle')}</h3>
            <p className="text-gray-600 mb-4 flex-grow dark:text-gray-300">{t('flightsDescription')}</p>
             <a 
              href="https://airalgerie.dz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto inline-block bg-dark-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition duration-300 dark:bg-dark-navy dark:hover:bg-opacity-100 dark:ring-1 dark:ring-gray-600"
            >
              {t('flightsButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TouristInfoSection;