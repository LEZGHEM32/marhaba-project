import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RatingProps {
  rating: number;
  reviewsCount?: number;
}

const Rating: React.FC<RatingProps> = ({ rating, reviewsCount }) => {
  const { t, dir } = useLanguage();
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const halfStarStyle = {
    clipPath: dir === 'rtl'
      ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' // Right half for RTL
      : 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)',      // Left half for LTR
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-400 fill-current" size={16} />
        ))}
        {halfStar && <Star key="half" className="text-yellow-400 fill-current" style={halfStarStyle} size={16} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300 fill-current dark:text-gray-600" size={16} />
        ))}
      </div>
      {reviewsCount !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">({reviewsCount} {t('reviews')})</span>
      )}
    </div>
  );
};

export default Rating;