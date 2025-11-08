import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Offer } from '../types';
import { X, Loader2, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  offer: Offer;
  totalPrice: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, offer, totalPrice }) => {
  const { t, language, dir } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvc) {
        setError(t('allFieldsRequired'));
        return;
    }
    setError('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2500);
  };
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

  const formatExpiry = (value: string) => {
    return value.replace(
      /[^0-9]/g, ''
    ).replace(
      /^([2-9])$/g, '0$1'
    ).replace(
      /^(1{1})([3-9]{1})$/g, '0$1/$2'
    ).replace(
      /^0{1,}/g, '0'
    ).replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2'
    );
  }

  const inputClasses = "mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-white";
  const labelClasses = "text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={!isProcessing ? onClose : undefined}>
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full relative dark:bg-dark-blue" onClick={(e) => e.stopPropagation()} dir={dir}>
        <div className="border-b p-4 flex justify-between items-center dark:border-gray-700">
          <h2 className="text-xl font-bold text-dark-blue dark:text-white">{t('completePayment')}</h2>
          {!isProcessing && (
              <button onClick={onClose} className="text-gray-500 hover:text-dark-blue dark:text-gray-400 dark:hover:text-white">
                  <X size={24} />
              </button>
          )}
        </div>
        
        <div className="p-6 space-y-4">
            <div className="bg-sand-light p-4 rounded-lg dark:bg-dark-navy">
                <h3 className="font-bold text-lg text-dark-blue dark:text-white">{offer.title[language]}</h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 dark:text-gray-400">{t('totalAmount')}:</span>
                    <span className="font-bold text-sand text-xl">{totalPrice.toLocaleString()} {t('dzd')}</span>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="relative">
                    <label className={labelClasses}>{t('cardNumber')}</label>
                    <CreditCard className={`absolute top-9 ${dir === 'rtl' ? 'right-3' : 'left-3'} text-gray-400`} size={20} />
                    <input 
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        className={`${inputClasses} ${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClasses}>{t('expiryDate')}</label>
                        <input 
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>{t('cvc')}</label>
                        <input 
                            type="text"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={3}
                            placeholder="123"
                            className={inputClasses}
                        />
                    </div>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg dark:bg-dark-navy dark:border-gray-700">
            <button type="button" onClick={handlePayment} disabled={isProcessing} className="bg-sand hover:bg-clay text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin me-2" />
                    <span>{t('processing')}...</span>
                  </>
              ) : (
                  t('payNow')
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;