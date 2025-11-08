
import React from 'react';
import { Link } from 'react-router-dom';
import { Offer, OfferCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Rating from './Rating';
import { MapPin } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const { t, language, dir } = useLanguage();

  const getCategoryLabel = (category: OfferCategory) => {
    switch (category) {
      case OfferCategory.OrganizedTrip:
        return t('organizedTrip');
      case OfferCategory.Hotel:
        return t('hotel');
      case OfferCategory.Guesthouse:
        return t('guesthouse');
    }
  };

  const priceSuffix = () => {
      switch (offer.category) {
          case OfferCategory.Hotel:
              return `/${t('night')}`;
          case OfferCategory.Guesthouse:
              return `/${t('person')}/${t('night')}`;
          default:
              return `/${t('person')}`;
      }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1 group dark:bg-dark-blue">
      <Link to={`/offer/${offer.id}`} className="block">
        <div className="relative">
          <img 
            src={offer.images[0]} 
            alt={offer.title[language]}
            className="w-full h-48 object-cover" 
          />
          <div className="absolute top-2 right-2 bg-sand text-white text-xs font-bold px-2 py-1 rounded-full">
            {getCategoryLabel(offer.category)}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-500 mb-2 dark:text-gray-400">
            <MapPin size={16} className="me-1" />
            <span>{offer.location[language]}</span>
          </div>
          <h3 className="text-lg font-bold text-dark-blue truncate dark:text-white" title={offer.title[language]}>
            {offer.title[language]}
          </h3>
          <div className="mt-2">
            <Rating rating={offer.rating} reviewsCount={offer.reviewsCount} />
          </div>
          <div className={`mt-4 text-end`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('startingFrom')}</p>
            <p className="text-xl font-bold text-sand">
              {offer.priceDZD.toLocaleString()} {t('dzd')}
            </p>
             <p className="text-xs text-gray-500 dark:text-gray-400">{priceSuffix()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OfferCard;
