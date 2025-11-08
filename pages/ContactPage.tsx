import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto dark:bg-dark-blue">
                <h1 className="text-4xl font-bold text-dark-blue mb-6 dark:text-white">{t('contactUs')}</h1>
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">{t('contactPageP1')}</p>
                    <div className="flex items-center space-x-4">
                        <Mail className="text-sand" size={24} />
                        <span>{t('contactPageEmail')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Phone className="text-sand" size={24} />
                        <span>{t('contactPagePhone')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;