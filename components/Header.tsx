
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, UserCircle, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, logout, openAuthModal } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sand text-white'
        : 'text-gray-300 hover:bg-dark-blue-light hover:text-white'
    }`;
    
  return (
    <header className="bg-dark-blue text-white shadow-md sticky top-0 z-40 dark:bg-dark-navy">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-sand">
              MARHABA
            </Link>
            <div className={`hidden md:block ${dir === 'rtl' ? 'mr-10' : 'ml-10'}`}>
              <div className="flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClasses} end>
                  {t('home')}
                </NavLink>
                <NavLink to="/offers" className={navLinkClasses}>
                  {t('browseOffers')}
                </NavLink>
                <NavLink to="/about" className={navLinkClasses}>
                  {t('aboutUs')}
                </NavLink>
                <NavLink to="/contact" className={navLinkClasses}>
                  {t('contactUs')}
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-dark-blue-light">
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-dark-blue-light">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {user ? (
              <div className="relative group">
                <Link to="/dashboard" className="flex items-center p-2 rounded-full hover:bg-dark-blue-light">
                  <UserCircle size={24} />
                </Link>
                <div className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white dark:bg-dark-blue rounded-md shadow-lg py-1 z-50 hidden group-hover:block`}>
                    <p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{user.name}</p>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-navy">{t('dashboard')}</Link>
                    <button onClick={logout} className="w-full text-start flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-navy">
                        <LogOut size={16} />
                        {t('logout')}
                    </button>
                </div>
              </div>
            ) : (
              <button onClick={openAuthModal} className="bg-sand hover:bg-clay text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300">
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
