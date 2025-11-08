import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Offer, OfferCategory, Companion, Booking, BookingStatus, PaymentStatus } from '../types';
import { X, Plus, Trash2, Users, Calendar, Moon, BedDouble } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, offer }) => {
  const { t, language, dir } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const { addBooking } = useData();
  const navigate = useNavigate();

  const [companions, setCompanions] = useState<Companion[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(offer.roomTypes?.[0]?.id || null);
  const [errors, setErrors] = useState<any>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end > start) {
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      }
    }
    return 0;
  }, [checkIn, checkOut]);

  const selectedRoom = useMemo(() => {
    return offer.roomTypes?.find(r => r.id === selectedRoomId);
  }, [selectedRoomId, offer.roomTypes]);

  const totalPrice = useMemo(() => {
    const numPeople = companions.length + 1;
    switch (offer.category) {
      case OfferCategory.OrganizedTrip:
        return offer.priceDZD * numPeople;
      case OfferCategory.Hotel:
        if (selectedRoom && nights > 0) {
          return selectedRoom.priceDZD * nights;
        }
        return 0;
      case OfferCategory.Guesthouse:
        if (nights > 0) {
          return offer.priceDZD * numPeople * nights;
        }
        return 0;
      default:
        return 0;
    }
  }, [companions, offer, nights, selectedRoom]);

  if (!isOpen) return null;

  const handleAddCompanion = () => {
    setCompanions([...companions, { name: '' }]);
  };

  const handleCompanionNameChange = (index: number, name: string) => {
    const newCompanions = [...companions];
    newCompanions[index].name = name;
    setCompanions(newCompanions);
  };
  
  const handleRemoveCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };
  
  const validate = (): boolean => {
    const newErrors: any = {};
    if (offer.category !== OfferCategory.OrganizedTrip) {
      if (!checkIn) newErrors.dates = t('checkInRequired');
      if (!checkOut) newErrors.dates = t('checkOutRequired');
      if (nights <= 0) newErrors.dates = t('checkOutAfterIn');
    }
    if (offer.category === OfferCategory.Hotel && !selectedRoom) {
      newErrors.room = t('selectRoomType');
    }
    if (companions.some(c => !c.name.trim())) {
      newErrors.companions = t('companionNameRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  const handleProceedToPayment = () => {
    if (!user) {
        onClose();
        openAuthModal();
        return;
    }

    if(validate()) {
      setIsPaymentModalOpen(true);
    }
  }
  
  const handlePaymentSuccess = () => {
    const newBooking: Booking = {
        id: `b${Date.now()}`,
        offer: offer,
        userId: user!.id,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as BookingStatus,
        paymentStatus: 'paid' as PaymentStatus,
        companions,
        totalPrice,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: nights > 0 ? nights : undefined,
        roomType: selectedRoom,
    };
    addBooking(newBooking);
    setIsPaymentModalOpen(false);
    onClose();
    navigate(`/receipt/${newBooking.id}`);
  }

  const renderBookingForm = () => {
      switch (offer.category) {
          case OfferCategory.Hotel:
              return (
                  <>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Calendar size={16} />{t('checkIn')}</label>
                              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-gray-300 dark:[color-scheme:dark]" />
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Calendar size={16} />{t('checkOut')}</label>
                              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-gray-300 dark:[color-scheme:dark]" />
                          </div>
                      </div>
                      {errors.dates && <p className="text-red-500 text-xs mt-1">{errors.dates}</p>}
                      {nights > 0 && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2"><Moon size={16}/>{t('totalNights', { count: nights })}</p>}
                      
                      <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><BedDouble size={16} />{t('selectRoom')}</label>
                          <select value={selectedRoomId || ''} onChange={e => setSelectedRoomId(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-dark-navy dark:border-gray-600 dark:text-white">
                            {offer.roomTypes?.map(room => <option key={room.id} value={room.id}>{room.name[language]} - {room.priceDZD.toLocaleString()} {t('dzd')}/{t('night')}</option>)}
                          </select>
                           {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
                      </div>
                  </>
              );
          case OfferCategory.Guesthouse:
               return (
                  <>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Calendar size={16} />{t('checkIn')}</label>
                              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-gray-300 dark:[color-scheme:dark]" />
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Calendar size={16} />{t('checkOut')}</label>
                              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-gray-300 dark:[color-scheme:dark]" />
                          </div>
                      </div>
                      {errors.dates && <p className="text-red-500 text-xs mt-1">{errors.dates}</p>}
                      {nights > 0 && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2"><Moon size={16}/>{t('totalNights', { count: nights })}</p>}
                  </>
              );
          default: // OrganizedTrip
              return null;
      }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl m-4 max-w-lg w-full relative max-h-[90vh] overflow-y-auto dark:bg-dark-blue" onClick={(e) => e.stopPropagation()} dir={dir}>
          <div className="sticky top-0 bg-white border-b p-4 z-10 flex justify-between items-center dark:bg-dark-blue dark:border-gray-700">
            <h2 className="text-xl font-bold text-dark-blue dark:text-white">{t('bookYourStay')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-dark-blue dark:text-gray-400 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <img src={offer.images[0]} alt={offer.title[language]} className="w-24 h-24 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg text-dark-blue dark:text-white">{offer.title[language]}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{offer.location[language]}</p>
              </div>
            </div>

            {renderBookingForm()}

            {offer.category !== OfferCategory.Hotel && (
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Users size={16}/>{t('companions')}</label>
                    <div className="space-y-2 mt-1">
                        {companions.map((comp, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder={`${t('companion')} ${index + 1} ${t('name')}`} value={comp.name} onChange={e => handleCompanionNameChange(index, e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-white" />
                                <button onClick={() => handleRemoveCompanion(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-full dark:hover:bg-red-500/10"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                     {errors.companions && <p className="text-red-500 text-xs mt-1">{errors.companions}</p>}
                    <button onClick={handleAddCompanion} className="text-sm text-sand hover:underline flex items-center gap-1 mt-2"><Plus size={16}/>{t('addCompanion')}</button>
                </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between items-center dark:bg-dark-navy dark:border-gray-700">
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('totalPrice')}</p>
                <p className="font-bold text-2xl text-sand">{totalPrice.toLocaleString()} {t('dzd')}</p>
            </div>
            <button onClick={handleProceedToPayment} className="bg-sand hover:bg-clay text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={totalPrice <= 0}>
                {user ? t('proceedToPayment') : t('loginToBook')}
            </button>
          </div>
        </div>
      </div>
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        offer={offer}
        totalPrice={totalPrice}
      />
    </>
  );
};

export default BookingModal;
