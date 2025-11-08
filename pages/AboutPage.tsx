import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto dark:bg-dark-blue">
                <h1 className="text-4xl font-bold text-dark-blue mb-6 dark:text-white">{t('aboutUs')}</h1>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed dark:text-gray-300">
                    <p>{t('aboutPageP1')}</p>
                    <p>{t('aboutPageP2')}</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;