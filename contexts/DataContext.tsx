import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, Offer, Booking, Inquiry } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { MOCK_OFFERS } from '../data/mockData';
import { MOCK_BOOKINGS, MOCK_INQUIRIES } from '../data/mockData';

interface DataContextType {
  users: User[];
  offers: Offer[];
  bookings: Booking[];
  inquiries: Inquiry[];
  findUserByEmail: (email: string) => User | undefined;
  addUser: (user: User) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (offer: Offer) => void;
  deleteOffer: (offerId: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiry: (inquiry: Inquiry) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);

  const findUserByEmail = (email: string) => users.find(u => u.email === email);

  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };
  
  const addOffer = (offer: Offer) => {
    setOffers(prevOffers => [offer, ...prevOffers]);
  };

  const updateOffer = (updatedOffer: Offer) => {
    setOffers(prevOffers => prevOffers.map(o => o.id === updatedOffer.id ? updatedOffer : o));
  };
  
  const deleteOffer = (offerId: string) => {
    setOffers(prevOffers => prevOffers.filter(o => o.id !== offerId));
  };

  const addBooking = (booking: Booking) => {
    setBookings(prevBookings => [booking, ...prevBookings]);
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const addInquiry = (inquiry: Inquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
  };

  const updateInquiry = (updatedInquiry: Inquiry) => {
    setInquiries(prev => prev.map(i => i.id === updatedInquiry.id ? updatedInquiry : i));
  };

  const value = useMemo(() => ({
    users,
    offers,
    bookings,
    inquiries,
    findUserByEmail,
    addUser,
    addOffer,
    updateOffer,
    deleteOffer,
    addBooking,
    updateBooking,
    addInquiry,
    updateInquiry,
  }), [users, offers, bookings, inquiries]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
