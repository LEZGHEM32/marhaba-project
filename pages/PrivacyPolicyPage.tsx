import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicyPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto dark:bg-dark-blue">
                <h1 className="text-4xl font-bold text-dark-blue mb-6 dark:text-white">{t('privacyPolicy')}</h1>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed dark:text-gray-300">
                    <p>{t('privacyPageP1')}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;