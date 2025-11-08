
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import OfferCard from '../components/OfferCard';
import { useLanguage } from '../contexts/LanguageContext';
import { OfferCategory } from '../types';
import { useData } from '../contexts/DataContext';

const OffersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { offers: allOffers } = useData();

  const [sortBy, setSortBy] = useState('rating');

  const filteredOffers = useMemo(() => {
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') as OfferCategory | null;

    let offers = allOffers.filter(offer => {
      const titleMatch = offer.title[language].toLowerCase().includes(query);
      const locationMatch = offer.location[language].toLowerCase().includes(query);
      const categoryMatch = !category || offer.category === category;
      return (titleMatch || locationMatch) && categoryMatch;
    });

    offers.sort((a, b) => {
        switch (sortBy) {
            case 'price_asc':
                return a.priceDZD - b.priceDZD;
            case 'price_desc':
                return b.priceDZD - a.priceDZD;
            case 'rating':
            default:
                return b.rating - a.rating;
        }
    });

    return offers;
  }, [searchParams, language, sortBy, allOffers]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-dark-blue">
          <h1 className="text-3xl font-bold text-dark-blue dark:text-white">{t('browseOffers')}</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-300">{t('offersPageSubtitle')}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">{t('foundOffers', { count: filteredOffers.length })}</p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('sortBy')}:</label>
            <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sand focus:border-transparent dark:bg-dark-navy dark:border-gray-600 dark:text-white"
            >
                <option value="rating">{t('rating')}</option>
                <option value="price_asc">{t('priceAsc')}</option>
                <option value="price_desc">{t('priceDesc')}</option>
            </select>
          </div>
      </div>

      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-xl text-gray-500 dark:text-gray-400">{t('noOffersFound')}</p>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
