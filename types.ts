
export type LocalizedString = {
  en: string;
  ar: string;
};

export enum OfferCategory {
  OrganizedTrip = 'trip',
  Hotel = 'hotel',
  Guesthouse = 'guesthouse',
}

export enum UserType {
  Tourist = 'tourist',
  Provider = 'provider',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  type: UserType;
  phone?: string;
}

export interface ItineraryItem {
  day: number;
  description: LocalizedString;
}

export interface RoomType {
  id: string;
  name: LocalizedString;
  priceDZD: number;
  capacity: number;
}

export interface OfferProvider {
  id: string;
  name: string;
  verified: boolean;
}

export interface Offer {
  id: string;
  title: LocalizedString;
  location: LocalizedString;
  description: LocalizedString;
  images: string[];
  category: OfferCategory;
  priceDZD: number;
  provider: OfferProvider;
  rating: number;
  reviewsCount: number;
  includedServices: LocalizedString[];
  cancellationPolicy: LocalizedString;
  duration?: LocalizedString;
  itinerary?: ItineraryItem[];
  roomTypes?: RoomType[];
}

export interface Companion {
  name: string;
}

export type BookingStatus = 'pending' | 'upcoming' | 'completed' | 'cancelled';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

export interface Booking {
  id: string;
  offer: Offer;
  userId: string;
  date: string; // ISO date string
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  companions: Companion[];
  totalPrice: number;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  roomType?: RoomType;
}

export interface Inquiry {
  id: string;
  offerId: string;
  offerTitle: LocalizedString;
  userId: string;
  userName: string;
  providerId: string;
  message: string;
  response?: string;
  createdAt: string; // ISO date string
  isReadByProvider: boolean;
}
