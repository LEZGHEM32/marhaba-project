
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Offer, Inquiry } from '../types';
import { X, Send } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, offer }) => {
  const { t, language, dir } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const { addInquiry } = useData();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      openAuthModal();
      return;
    }
    if (!message.trim()) {
      setError(t('fieldCannotBeEmpty'));
      return;
    }
    
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      offerId: offer.id,
      offerTitle: offer.title,
      userId: user.id,
      userName: user.name,
      providerId: offer.provider.id,
      message,
      createdAt: new Date().toISOString(),
      isReadByProvider: false,
    };

    addInquiry(newInquiry);
    onClose();
    setMessage('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-lg w-full relative dark:bg-dark-blue" onClick={(e) => e.stopPropagation()} dir={dir}>
        <div className="border-b p-4 flex justify-between items-center dark:border-gray-700">
          <h2 className="text-xl font-bold text-dark-blue dark:text-white">{t('askAQuestion')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-dark-blue dark:text-gray-400 dark:hover:text-white"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('about')}: <span className="font-semibold">{offer.title[language]}</span></p>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('yourQuestion')}</label>
            <textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sand focus:border-transparent dark:bg-dark-navy dark:border-gray-600 dark:text-white"
              placeholder={t('typeYourQuestionHere')}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-sand hover:bg-clay text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition duration-300">
              <Send size={18} />
              {t('send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
