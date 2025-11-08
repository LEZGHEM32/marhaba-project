
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Rating from '../components/Rating';
import { CheckCircle, MapPin, Calendar, Clock, ShieldCheck } from 'lucide-react';
import Map from '../components/Map';
import BookingModal from '../components/BookingModal';
import { useData } from '../contexts/DataContext';

const OfferDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, dir } = useLanguage();
  const { offers } = useData();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const offer = offers.find(o => o.id === id);

  if (!offer) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-dark-blue dark:text-white">{t('offerNotFound')}</h1>
        <p className="text-gray-600 mt-4 dark:text-gray-300">{t('offerNotFoundMessage')}</p>
        <Link to="/offers" className="mt-8 inline-block bg-sand hover:bg-clay text-white font-bold py-3 px-8 rounded-lg transition duration-300">
          {t('browseOffers')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-xl dark:bg-dark-blue">
          {/* Header */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-dark-blue dark:text-white">{offer.title[language]}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{offer.location[language]}</span>
              </div>
              <Rating rating={offer.rating} reviewsCount={offer.reviewsCount} />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <img src={offer.images[0]} alt={offer.title[language]} className="w-full h-96 object-cover rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              {offer.images.slice(1, 5).map((img, index) => (
                <img key={index} src={img} alt={`${offer.title[language]} ${index + 2}`} className="w-full h-[11.5rem] object-cover rounded-lg" />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-dark-blue border-b pb-2 mb-4 dark:text-white dark:border-gray-700">{t('aboutThisOffer')}</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">{offer.description[language]}</p>

              {offer.duration && (
                <div className="flex items-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
                  <Clock size={20} className="text-sand" />
                  <span className="font-semibold">{t('duration')}:</span>
                  <span>{offer.duration[language]}</span>
                </div>
              )}

              <h3 className="text-xl font-bold text-dark-blue mt-8 mb-4 dark:text-white">{t('includedServices')}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {offer.includedServices.map((service, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>{service[language]}</span>
                  </li>
                ))}
              </ul>

              {offer.itinerary && (
                <>
                  <h3 className="text-xl font-bold text-dark-blue mt-8 mb-4 dark:text-white">{t('tripItinerary')}</h3>
                  <div className="space-y-4">
                    {offer.itinerary.map((item) => (
                      <div key={item.day} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="bg-sand text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">{item.day}</div>
                          <div className="border-l-2 border-dashed border-gray-300 h-full"></div>
                        </div>
                        <div>
                          <h4 className="font-bold text-dark-blue dark:text-white">{t('day')} {item.day}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{item.description[language]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <h3 className="text-xl font-bold text-dark-blue mt-8 mb-4 dark:text-white">{t('cancellationPolicy')}</h3>
              <div className="flex items-start gap-3 p-4 bg-sand-light/50 rounded-lg dark:bg-dark-navy">
                  <ShieldCheck size={24} className="text-sand mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">{offer.cancellationPolicy[language]}</p>
              </div>

            </div>

            {/* Booking Card */}
            <div className="sticky top-24 self-start">
              <div className="border rounded-lg shadow-lg p-6 dark:border-gray-700">
                <p className="text-2xl font-bold text-dark-blue dark:text-white">
                  {offer.priceDZD.toLocaleString()} {t('dzd')}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {offer.category === 'hotel' ? ` / ${t('night')}` : ` / ${t('person')}`}
                  </span>
                </p>
                <button onClick={() => setIsBookingModalOpen(true)} className="w-full mt-4 bg-sand hover:bg-clay text-white font-bold py-3 rounded-lg transition duration-300">
                  {t('bookNow')}
                </button>
              </div>
            </div>
          </div>
          
           {/* Map Section */}
          <div className="mt-12">
             <h2 className="text-2xl font-bold text-dark-blue border-b pb-2 mb-4 dark:text-white dark:border-gray-700">{t('location')}</h2>
             <Map locationName={offer.location[language]} locationSeed={offer.id} />
          </div>

        </div>
      </div>
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        offer={offer}
      />
    </>
  );
};

export default OfferDetailsPage;
