
import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Booking, Offer, UserType } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Calendar } from 'lucide-react';
import EditOfferModal from '../components/EditOfferModal';
import { useData } from '../contexts/DataContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { offers, bookings, updateOffer, deleteOffer } = useData();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState<Offer | null>(null);

  const userBookings = useMemo(() => {
    if (user?.type === UserType.Tourist) {
      return bookings.filter(b => b.userId === user.id);
    }
    return [];
  }, [user, bookings]);

  const providerOffers = useMemo(() => {
    if (user?.type === UserType.Provider) {
      return offers.filter(o => o.provider.id === user.id);
    }
    return [];
  }, [user, offers]);

  if (!user) {
    // This should ideally be handled by a protected route component
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>{t('pleaseLogin')}</p>
        <Link to="/" className="text-sand hover:underline">{t('home')}</Link>
      </div>
    );
  }

  const handleEditOffer = (offer: Offer) => {
    setOfferToEdit(offer);
    setIsEditModalOpen(true);
  };
  
  const handleSaveOffer = (updatedOffer: Offer) => {
    updateOffer(updatedOffer);
    setIsEditModalOpen(false);
    setOfferToEdit(null);
  }
  
  const handleDeleteOffer = (offerId: string) => {
      if(window.confirm(t('confirmDeleteOffer'))) {
        deleteOffer(offerId);
      }
  }

  const renderTouristDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar size={24}/>{t('myBookings')}</h2>
      {userBookings.length > 0 ? (
        <div className="space-y-4">
          {userBookings.map(booking => (
            <div key={booking.id} className="bg-white dark:bg-dark-navy p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-dark-blue dark:text-white">{booking.offer.title[language]}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(booking.date).toLocaleDateString()}</p>
                <p className="text-sm text-sand font-semibold">{booking.totalPrice.toLocaleString()} {t('dzd')}</p>
              </div>
              <Link to={`/receipt/${booking.id}`} className="bg-sand hover:bg-clay text-white font-bold py-2 px-4 rounded-lg transition duration-300">{t('viewReceipt')}</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noBookings')}</p>
      )}
    </div>
  );

  const renderProviderDashboard = () => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Package size={24}/>{t('myOffers')}</h2>
            <Link to="/dashboard/add-offer" className="bg-sand hover:bg-clay text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300">
                <Plus size={20} />
                {t('addNewOffer')}
            </Link>
        </div>
       {providerOffers.length > 0 ? (
        <div className="space-y-4">
          {providerOffers.map(offer => (
            <div key={offer.id} className="bg-white dark:bg-dark-navy p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={offer.images[0]} alt={offer.title[language]} className="w-20 h-20 object-cover rounded-md" />
                <div>
                    <p className="font-bold text-lg text-dark-blue dark:text-white">{offer.title[language]}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{offer.location[language]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditOffer(offer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:hover:bg-blue-500/10"><Edit size={18}/></button>
                <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full dark:hover:bg-red-500/10"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noOffers')}</p>
      )}
    </div>
  );

  return (
    <>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 p-6 bg-white dark:bg-dark-blue rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-dark-blue dark:text-white">{t('dashboard')}</h1>
                    <p className="text-gray-600 mt-2 dark:text-gray-300">{t('welcome')}, {user.name}!</p>
                </div>
                {user.type === UserType.Tourist ? renderTouristDashboard() : renderProviderDashboard()}
            </div>
        </div>
        {offerToEdit && (
            <EditOfferModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                offerToEdit={offerToEdit}
                onSaveOffer={handleSaveOffer}
            />
        )}
    </>
  );
};

export default DashboardPage;
