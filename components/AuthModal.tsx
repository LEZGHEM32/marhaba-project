
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t, dir } = useLanguage();
  const { login, register } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.Tourist);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let success = false;
    if (isLoginView) {
      success = login(email, password);
      if (!success) {
        setError(t('invalidCredentials'));
      }
    } else {
      if(!name || !email || !password) {
        setError(t('allFieldsRequired'));
        return;
      }
      success = register(name, email, password, userType);
       if (!success) {
        setError(t('emailExists'));
      }
    }
  };

  const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sand focus:border-transparent dark:bg-dark-navy dark:border-gray-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full relative dark:bg-dark-blue" onClick={(e) => e.stopPropagation()} dir={dir}>
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-dark-blue dark:text-white">{isLoginView ? t('login') : t('register')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-dark-blue dark:text-gray-400 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLoginView && (
            <div>
              <label className={labelClasses} htmlFor="name">{t('fullName')}</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={inputClasses} required />
            </div>
          )}
          <div>
            <label className={labelClasses} htmlFor="email">{t('email')}</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} required />
          </div>
          <div>
            <label className={labelClasses} htmlFor="password">{t('password')}</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} required />
          </div>
          {!isLoginView && (
            <div>
                <label className={labelClasses}>{t('accountType')}</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border rounded-lg flex-1 cursor-pointer dark:border-gray-600">
                        <input type="radio" name="userType" value={UserType.Tourist} checked={userType === UserType.Tourist} onChange={() => setUserType(UserType.Tourist)} className="text-sand focus:ring-sand" />
                        <span className="dark:text-white">{t('tourist')}</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded-lg flex-1 cursor-pointer dark:border-gray-600">
                        <input type="radio" name="userType" value={UserType.Provider} checked={userType === UserType.Provider} onChange={() => setUserType(UserType.Provider)} className="text-sand focus:ring-sand" />
                         <span className="dark:text-white">{t('serviceProvider')}</span>
                    </label>
                </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-sand hover:bg-clay text-white font-bold py-3 rounded-lg transition duration-300">
            {isLoginView ? t('login') : t('createAccount')}
          </button>
        </form>
        <div className="p-4 bg-gray-50 text-center border-t dark:bg-dark-navy dark:border-gray-700">
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm text-sand hover:underline">
            {isLoginView ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
