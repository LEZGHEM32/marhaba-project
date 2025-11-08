import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, Offer, Booking } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { MOCK_OFFERS } from '../data/mockData';
import { MOCK_BOOKINGS } from '../data/mockData';

interface DataContextType {
  users: User[];
  offers: Offer[];
  bookings: Booking[];
  findUserByEmail: (email: string) => User | undefined;
  addUser: (user: User) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (offer: Offer) => void;
  deleteOffer: (offerId: string) => void;
  addBooking: (booking: Booking) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

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

  const value = useMemo(() => ({
    users,
    offers,
    bookings,
    findUserByEmail,
    addUser,
    addOffer,
    updateOffer,
    deleteOffer,
    addBooking,
  }), [users, offers, bookings]);

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
