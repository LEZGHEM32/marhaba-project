import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfUsePage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto dark:bg-dark-blue">
                <h1 className="text-4xl font-bold text-dark-blue mb-6 dark:text-white">{t('termsOfUse')}</h1>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed dark:text-gray-300">
                    <p>{t('termsPageP1')}</p>
                     <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUsePage;