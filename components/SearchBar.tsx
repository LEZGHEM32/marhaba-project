
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, BedDouble } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { OfferCategory } from '../types';

const SearchBar: React.FC = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<OfferCategory | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) {
        params.set('q', destination);
    }
    if (category !== 'all') {
        params.set('category', category);
    }
    // Date parameter is not used in filtering on OffersPage yet, but is captured
    if (date) {
        params.set('date', date);
    }
    navigate(`/offers?${params.toString()}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg -mt-16 z-10 relative max-w-4xl mx-auto dark:bg-dark-blue/90">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative">
          <MapPin className={`absolute top-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'} -translate-y-1/2 text-gray-400`} size={20}/>
          <input 
            type="text" 
            placeholder={t('destinationPlaceholder')}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={`w-full p-3 ${dir === 'rtl' ? 'pr-10' : 'pl-10'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-sand focus:border-transparent dark:bg-dark-navy dark:border-gray-600 dark:text-white`}
          />
        </div>
        <div className="relative">
          <Calendar className={`absolute top-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'} -translate-y-1/2 text-gray-400`} size={20}/>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full p-3 ${dir === 'rtl' ? 'pr-10' : 'pl-10'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-sand focus:border-transparent text-gray-500 dark:bg-dark-navy dark:border-gray-600 dark:text-gray-300 dark:[color-scheme:dark]`}
          />
        </div>
        <div className="relative">
          <BedDouble className={`absolute top-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'} -translate-y-1/2 text-gray-400`} size={20}/>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as OfferCategory | 'all')}
            className={`w-full p-3 ${dir === 'rtl' ? 'pr-10' : 'pl-10'} border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-sand focus:border-transparent dark:bg-dark-navy dark:border-gray-600 dark:text-white`}>
            <option value="all">{t('allServices')}</option>
            <option value={OfferCategory.OrganizedTrip}>{t('organizedTrip')}</option>
            <option value={OfferCategory.Hotel}>{t('hotelBooking')}</option>
            <option value={OfferCategory.Guesthouse}>{t('guesthouse')}</option>
          </select>
        </div>
        <button type="submit" className="bg-sand hover:bg-clay text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-300">
          <Search size={20} />
          <span>{t('search')}</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
