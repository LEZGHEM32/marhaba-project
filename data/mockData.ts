import { User, UserType, Offer, OfferCategory, Booking, BookingStatus, PaymentStatus } from '../types';

// MOCK USERS
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmed Benali', email: 'ahmed@test.com', password: 'password', type: UserType.Tourist },
  { id: 'u2', name: 'Fatima Zohra', email: 'fatima@test.com', password: 'password', type: UserType.Tourist },
  { id: 'p1', name: 'Sahara Adventures', email: 'sahara@provider.com', password: 'password', type: UserType.Provider, phone: '+213 555 123 456' },
  { id: 'p2', name: 'Coastal Escapes', email: 'coastal@provider.com', password: 'password', type: UserType.Provider, phone: '+213 666 987 654' },
  { id: 'p3', name: 'Kabylie Guesthouses', email: 'kabylie@provider.com', password: 'password', type: UserType.Provider, phone: '+213 777 555 444' }
];

// MOCK OFFERS
export const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    title: { en: 'Djanet Desert Expedition', ar: 'رحلة استكشافية في جانت الصحراوية' },
    location: { en: 'Djanet, Illizi', ar: 'جانت، إليزي' },
    description: { en: 'A 10-day 4x4 expedition through the stunning landscapes of the Tassili n\'Ajjer National Park. Discover ancient rock art, towering sand dunes, and unique rock formations.', ar: 'رحلة استكشافية لمدة 10 أيام بالدفع الرباعي عبر المناظر الطبيعية الخلابة في حديقة طاسيلي ناجر الوطنية. اكتشف الفن الصخري القديم والكثبان الرملية الشاهقة والتكوينات الصخرية الفريدة.' },
    images: [
        'https://images.unsplash.com/photo-1605652289947-a855d4d38e8f?q=80&w=1920&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1619733979028-78c5432652b4?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543787002-99035a968925?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617293523282-e278a2e0965e?q=80&w=1920&auto=format&fit=crop'
    ],
    category: OfferCategory.OrganizedTrip,
    priceDZD: 85000,
    provider: { id: 'p1', name: 'Sahara Adventures', verified: true },
    rating: 4.8,
    reviewsCount: 124,
    includedServices: [{ en: '4x4 Transport', ar: 'النقل بالدفع الرباعي' }, { en: 'Full board catering', ar: 'إقامة كاملة' }, { en: 'Professional guide', ar: 'دليل محترف' }, { en: 'Camping equipment', ar: 'معدات التخييم' }],
    cancellationPolicy: { en: 'Free cancellation up to 14 days before the trip.', ar: 'إلغاء مجاني حتى 14 يومًا قبل الرحلة.' },
    duration: { en: '10 Days, 9 Nights', ar: '10 أيام ، 9 ليالي' },
    itinerary: [
      { day: 1, description: { en: 'Arrival in Djanet, transfer to the campsite.', ar: 'الوصول إلى جانت، الانتقال إلى المخيم.' } },
      { day: 2, description: { en: 'Explore the "Crying Cow" rock painting.', ar: 'استكشاف لوحة "البقرة الباكية" الصخرية.' } },
      { day: 3, description: { en: 'Journey to the great dunes of Erg Admer.', ar: 'رحلة إلى كثبان عرق آدمر العظيمة.' } }
    ]
  },
  {
    id: 'offer-2',
    title: { en: 'Luxury Stay at Oran Bay Hotel', ar: 'إقامة فاخرة في فندق خليج وهران' },
    location: { en: 'Oran', ar: 'وهران' },
    description: { en: 'Experience luxury with a sea view at the prestigious Oran Bay Hotel. Enjoy our infinity pool, spa, and gourmet restaurants.', ar: 'جرب الفخامة مع إطلالة على البحر في فندق خليج وهران المرموق. استمتع بمسبحنا اللامتناهي والمنتجع الصحي والمطاعم الفاخرة.' },
    images: [
        'https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=1920&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1540541338287-417002075841?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1621293954908-907159247d87?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1920&auto=format&fit=crop'
    ],
    category: OfferCategory.Hotel,
    priceDZD: 22000,
    provider: { id: 'p2', name: 'Coastal Escapes', verified: true },
    rating: 4.5,
    reviewsCount: 340,
    includedServices: [{ en: 'Breakfast included', ar: 'شامل الإفطار' }, { en: 'Free Wi-Fi', ar: 'واي فاي مجاني' }, { en: 'Pool and Gym access', ar: 'الوصول إلى المسبح والجيم' }],
    cancellationPolicy: { en: 'Free cancellation up to 48 hours before check-in.', ar: 'إلغاء مجاني حتى 48 ساعة قبل تسجيل الوصول.' },
    roomTypes: [
      { id: 'room-1', name: { en: 'Standard Double Room', ar: 'غرفة مزدوجة قياسية' }, priceDZD: 22000, capacity: 2 },
      { id: 'room-2', name: { en: 'Sea View Suite', ar: 'جناح بإطلالة على البحر' }, priceDZD: 35000, capacity: 3 }
    ]
  },
  {
    id: 'offer-3',
    title: { en: 'Charming Guesthouse in Tizi Ouzou', ar: 'دار ضيافة ساحرة في تيزي وزو' },
    location: { en: 'Tizi Ouzou, Kabylie', ar: 'تيزي وزو، القبائل' },
    description: { en: 'A traditional Berber guesthouse in the heart of the Djurdjura mountains. Enjoy authentic cuisine and breathtaking mountain views.', ar: 'دار ضيافة أمازيغية تقليدية في قلب جبال جرجرة. استمتع بالمأكولات الأصيلة وإطلالات جبلية خلابة.' },
    images: [
        'https://images.unsplash.com/photo-1558331163-f50473315a63?q=80&w=1920&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1588821782294-279541a14175?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596328330553-832c7a022567?q=80&w=1920&auto=format&fit=crop'
    ],
    category: OfferCategory.Guesthouse,
    priceDZD: 9000, // per person per night
    provider: { id: 'p3', name: 'Kabylie Guesthouses', verified: true },
    rating: 4.9,
    reviewsCount: 88,
    includedServices: [{ en: 'Traditional breakfast', ar: 'إفطار تقليدي' }, { en: 'Guided hikes available', ar: 'جولات مشي بصحبة مرشد متاحة' }],
    cancellationPolicy: { en: 'Free cancellation up to 7 days before check-in.', ar: 'إلغاء مجاني حتى 7 أيام قبل تسجيل الوصول.' },
    duration: { en: 'Price per night', ar: 'السعر لليلة الواحدة' }
  },
  {
    id: 'offer-4',
    title: { en: 'Roman Ruins Tour of Timgad', ar: 'جولة في آثار تيمقاد الرومانية' },
    location: { en: 'Timgad, Batna', ar: 'تيمقاد، باتنة' },
    description: { en: 'A guided day trip to the UNESCO World Heritage site of Timgad. Explore one of the best-preserved Roman cities in the world.', ar: 'رحلة يومية بصحبة مرشد إلى موقع تيمقاد للتراث العالمي لليونسكو. استكشف واحدة من أفضل المدن الرومانية المحفوظة في العالم.' },
    images: [
        'https://images.unsplash.com/photo-1596628012472-32a127a537dd?q=80&w=1920&auto=format&fit=crop', 
        'https://images.unsplash.com/photo-1656274403333-56839e557f6b?q=80&w=1920&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616835288219-049807578759?q=80&w=1920&auto=format&fit=crop'
    ],
    category: OfferCategory.OrganizedTrip,
    priceDZD: 15000,
    provider: { id: 'p1', name: 'Sahara Adventures', verified: true },
    rating: 4.7,
    reviewsCount: 95,
    includedServices: [{ en: 'Private transport', ar: 'النقل الخاص' }, { en: 'Lunch', ar: 'الغداء' }, { en: 'Certified guide', ar: 'دليل معتمد' }],
    cancellationPolicy: { en: 'Full refund if cancelled 24 hours in advance.', ar: 'استرداد كامل المبلغ في حالة الإلغاء قبل 24 ساعة.' },
    duration: { en: '1 Day', ar: 'يوم واحد' }
  }
];

// MOCK BOOKINGS
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    offer: MOCK_OFFERS[0],
    userId: 'u1',
    date: '2023-10-15',
    status: 'completed',
    paymentStatus: 'paid',
    companions: [{ name: 'Aisha Benali' }],
    totalPrice: 170000
  },
  {
    id: 'b2',
    offer: MOCK_OFFERS[1],
    userId: 'u2',
    date: '2023-11-01',
    status: 'upcoming',
    paymentStatus: 'paid',
    companions: [],
    totalPrice: 66000,
    checkInDate: '2024-08-20',
    checkOutDate: '2024-08-23',
    nights: 3,
    roomType: MOCK_OFFERS[1].roomTypes![0]
  }
];