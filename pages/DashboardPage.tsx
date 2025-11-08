
import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Booking, Offer, UserType, Inquiry } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Calendar, MessageSquare, Check, X } from 'lucide-react';
import EditOfferModal from '../components/EditOfferModal';
import { useData } from '../contexts/DataContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { offers, bookings, updateOffer, deleteOffer, users, inquiries, updateBooking, updateInquiry } = useData();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState<Offer | null>(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

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

  const providerBookings = useMemo(() => {
    if (user?.type === UserType.Provider) {
      const providerOfferIds = offers.filter(o => o.provider.id === user.id).map(o => o.id);
      return bookings.filter(b => providerOfferIds.includes(b.offer.id))
                     .sort((a, b) => (a.status === 'pending' ? -1 : 1)); // Show pending first
    }
    return [];
  }, [user, offers, bookings]);

  const providerInquiries = useMemo(() => {
    if (user?.type === UserType.Provider) {
        return inquiries.filter(i => i.providerId === user.id)
                        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [];
  }, [user, inquiries]);

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

  const handleApproveBooking = (booking: Booking) => {
    updateBooking({ ...booking, status: 'upcoming' });
  };

  const handleRejectBooking = (booking: Booking) => {
    if(window.confirm(t('confirmRejectBooking'))) {
        updateBooking({ ...booking, status: 'cancelled', paymentStatus: 'refunded' });
    }
  };

  const handleSendReply = (inquiry: Inquiry) => {
    if (!replyMessage.trim()) return;
    updateInquiry({ ...inquiry, response: replyMessage, isReadByProvider: true });
    setReplyingTo(null);
    setReplyMessage('');
  };


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

  const renderProviderOffers = () => (
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

  const renderBookingRequests = () => {
    const statusStyles: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
        <div>
            {providerBookings.length > 0 ? (
                <div className="space-y-4">
                    {providerBookings.map(booking => {
                        const tourist = users.find(u => u.id === booking.userId);
                        return (
                            <div key={booking.id} className="bg-white dark:bg-dark-navy p-4 rounded-lg shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                    <div className="flex-grow">
                                    <p className="font-bold text-lg text-dark-blue dark:text-white">{booking.offer.title[language]}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('tourist')}: {tourist?.name}</p>
                                    {booking.checkInDate && <p className="text-sm text-gray-600 dark:text-gray-300">{t('checkIn')}: {booking.checkInDate}</p>}
                                    {booking.checkOutDate && <p className="text-sm text-gray-600 dark:text-gray-300">{t('checkOut')}: {booking.checkOutDate}</p>}
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('travelers')}: {booking.companions.length + 1}</p>
                                    <p className="text-sand font-semibold mt-2">{booking.totalPrice.toLocaleString()} {t('dzd')}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[booking.status]}`}>{t(booking.status)}</span>
                                        {booking.status === 'pending' && (
                                            <div className="flex gap-2 mt-2">
                                                <button title={t('approve')} onClick={() => handleApproveBooking(booking)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center transition-colors"><Check size={16}/></button>
                                                <button title={t('reject')} onClick={() => handleRejectBooking(booking)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full flex items-center justify-center transition-colors"><X size={16}/></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : <p>{t('noBookingRequests')}</p>}
        </div>
    );
  };
    
  const renderCustomerInquiries = () => (
    <div>
        {providerInquiries.length > 0 ? (
            <div className="space-y-4">
                {providerInquiries.map(inquiry => {
                    const isReplying = replyingTo === inquiry.id;
                    return (
                        <div key={inquiry.id} className="bg-white dark:bg-dark-navy p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-dark-blue dark:text-white">{inquiry.offerTitle[language]}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('from')}: {inquiry.userName}</p>
                                    <p className="text-xs text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</p>
                                </div>
                                {!inquiry.isReadByProvider && <span title="New Inquiry" className="w-3 h-3 bg-sand rounded-full flex-shrink-0 ms-2"></span>}
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-blue p-3 rounded-md">{inquiry.message}</p>
                            
                            {inquiry.response && (
                                <div className="mt-4 border-t pt-4 dark:border-gray-700">
                                    <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400">{t('yourReply')}</h4>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300 bg-sand-light/30 dark:bg-dark-navy p-3 rounded-md">{inquiry.response}</p>
                                </div>
                            )}

                            {!inquiry.response && !isReplying &&(
                                <div className="mt-4">
                                    <button onClick={() => { setReplyingTo(inquiry.id); updateInquiry({...inquiry, isReadByProvider: true}); }} className="text-sand hover:underline text-sm font-semibold">{t('reply')}</button>
                                </div>
                            )}

                            {isReplying && (
                                <div className="mt-4 border-t pt-4 dark:border-gray-700">
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        rows={4}
                                        className="w-full p-2 border rounded-md dark:bg-dark-blue dark:border-gray-600 focus:ring-sand focus:border-sand"
                                        placeholder={t('typeYourReplyHere')}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => { setReplyingTo(null); setReplyMessage(''); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">{t('cancel')}</button>
                                        <button onClick={() => handleSendReply(inquiry)} className="bg-sand hover:bg-clay text-white font-bold py-2 px-4 rounded-lg text-sm">{t('sendReply')}</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        ) : <p>{t('noInquiries')}</p>}
    </div>
  );

  const renderProviderDashboard = () => (
    <div>
      <div className="flex border-b mb-6 dark:border-gray-700">
        <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'bookings' ? 'text-sand border-b-2 border-sand' : 'text-gray-500 hover:text-dark-blue dark:hover:text-white'}`}>
            {t('bookingRequests')}
        </button>
        <button onClick={() => setActiveTab('inquiries')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'inquiries' ? 'text-sand border-b-2 border-sand' : 'text-gray-500 hover:text-dark-blue dark:hover:text-white'}`}>
            {t('customerInquiries')}
        </button>
        <button onClick={() => setActiveTab('offers')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'offers' ? 'text-sand border-b-2 border-sand' : 'text-gray-500 hover:text-dark-blue dark:hover:text-white'}`}>
            {t('myOffers')}
        </button>
      </div>

      {activeTab === 'offers' && renderProviderOffers()}
      {activeTab === 'bookings' && renderBookingRequests()}
      {activeTab === 'inquiries' && renderCustomerInquiries()}
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
