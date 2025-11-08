
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { User, OfferCategory } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';


const ReceiptPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { t, language, dir } = useLanguage();
  const { bookings, users } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const booking = bookings.find(b => b.id === bookingId);

  const handleDownloadPdf = async () => {
    const input = receiptRef.current;
    if (!input || isLoading) return;

    setIsLoading(true);
    try {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
        }

        const canvas = await html2canvas(input, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        if (isDark) {
            document.documentElement.classList.add('dark');
        }
        
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const pdfImageWidth = pdfWidth - 20;
        const pdfImageHeight = pdfImageWidth / ratio;
        
        pdf.addImage(imgData, 'PNG', 10, 10, pdfImageWidth, pdfImageHeight);
        pdf.save(`marhaba-receipt-${bookingId}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (booking) {
      document.title = `${t('receipt')} - ${booking.offer.title[language]}`;
    }
  }, [booking, t, language]);

  if (!booking) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-dark-blue dark:text-white">{t('offerNotFound')}</h1>
        <p className="text-gray-600 mt-4 dark:text-gray-300">{t('offerNotFoundMessage')}</p>
        <Link to="/" className="mt-8 inline-block bg-sand hover:bg-clay text-white font-bold py-3 px-8 rounded-lg transition duration-300">
          {t('home')}
        </Link>
      </div>
    );
  }

  const tourist = users.find(u => u.id === booking.userId) as User;
  const provider = users.find(u => u.id === booking.offer.provider.id) as User;
  const numTravelers = 1 + booking.companions.length;

  const renderPriceBreakdown = () => {
      switch (booking.offer.category) {
          case OfferCategory.Hotel:
              return (
                  <tr className="border-b">
                      <td className="py-4 px-4">
                          <p className="font-bold text-dark-blue">{booking.offer.title[language]}</p>
                          <p className="text-sm text-gray-600">{booking.roomType?.name[language]}</p>
                          <p className="text-xs text-gray-500 mt-1">{booking.nights} {t('nights')} x {booking.roomType?.priceDZD.toLocaleString()} {t('dzd')}</p>
                      </td>
                      <td className="py-4 px-4 text-end font-semibold">{booking.totalPrice.toLocaleString()} {t('dzd')}</td>
                  </tr>
              );
          case OfferCategory.Guesthouse:
          case OfferCategory.OrganizedTrip:
          default:
              const basePrice = booking.offer.priceDZD;
              const companionPrice = booking.companions.length * basePrice * (booking.nights || 1);
              const mainTravelerPrice = basePrice * (booking.nights || 1);

              return (
                  <>
                      <tr className="border-b">
                          <td className="py-4 px-4">
                              <p className="font-bold text-dark-blue">{booking.offer.title[language]}</p>
                              <p className="text-sm text-gray-600">{t('mainTraveler')}</p>
                              {booking.nights && <p className="text-xs text-gray-500 mt-1">{booking.nights} {t('nights')}</p>}
                          </td>
                          <td className="py-4 px-4 text-end font-semibold">{mainTravelerPrice.toLocaleString()} {t('dzd')}</td>
                      </tr>
                      {booking.companions.length > 0 && (
                          <tr className="border-b">
                              <td className="py-4 px-4">
                                  <p className="font-bold text-dark-blue">{t('additionalTravelers')}</p>
                                  <p className="text-sm text-gray-600">{booking.companions.length} x {basePrice.toLocaleString()} {t('dzd')}{booking.nights ? ` x ${booking.nights} ${t('nights')}`: ''}</p>
                              </td>
                              <td className="py-4 px-4 text-end font-semibold">{companionPrice.toLocaleString()} {t('dzd')}</td>
                          </tr>
                      )}
                  </>
              );
      }
  };

  return (
    <div className="bg-sand-light py-8 dark:bg-dark-navy">
        <div ref={receiptRef} className="bg-white p-8 md:p-12 max-w-4xl mx-auto" dir={dir}>
          <div className="flex justify-between items-start border-b-2 border-sand pb-4">
            <div>
              <h1 className="text-4xl font-bold text-dark-blue">MARHABA</h1>
              <p className="text-gray-500">{t('footerDescription')}</p>
            </div>
            <div className="text-end">
              <h2 className="text-2xl font-bold text-gray-700">{t('receipt')}</h2>
              <p className="text-gray-600"><span className="font-semibold">{t('receiptNumber')}:</span> {booking.id.toUpperCase()}</p>
              <p className="text-gray-600"><span className="font-semibold">{t('paymentDate')}:</span> {new Date(booking.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">{t('billedTo')}</h3>
              <p className="font-bold text-lg text-dark-blue">{tourist.name}</p>
              <p className="text-gray-600">{tourist.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase">{t('serviceProvider')}</h3>
              <p className="font-bold text-lg text-dark-blue">{provider.name}</p>
              <p className="text-gray-600">{provider.email}</p>
              {provider.phone && <p className="text-gray-600">{provider.phone}</p>}
            </div>
          </div>

          <div className="my-8 bg-sand-light/50 p-4 rounded-lg">
             <h3 className="text-sm font-semibold text-gray-500 uppercase">{t('bookingDetails')}</h3>
             <div className="grid grid-cols-2 gap-4 mt-2">
                 <div>
                    <p className="font-bold">{t('travelers')}: {numTravelers}</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>{tourist.name} ({t('mainTraveler')})</li>
                        {booking.companions.map((c, i) => <li key={i}>{c.name}</li>)}
                    </ul>
                 </div>
                 {booking.checkInDate && booking.checkOutDate && (
                     <div>
                        <p><span className="font-semibold">{t('checkIn')}:</span> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                        <p><span className="font-semibold">{t('checkOut')}:</span> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        <p><span className="font-semibold">{t('duration')}:</span> {booking.nights} {t('nights')}</p>
                     </div>
                 )}
             </div>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-sand-light">
                <tr>
                  <th className="py-2 px-4 text-start font-semibold text-dark-blue">{t('item')}</th>
                  <th className="py-2 px-4 text-end font-semibold text-dark-blue">{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {renderPriceBreakdown()}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-full max-w-xs">
              <div className="flex justify-between items-center bg-sand-light p-4 rounded-lg">
                <span className="font-bold text-lg text-dark-blue">{t('total')}</span>
                <span className="font-extrabold text-xl text-sand">{booking.totalPrice.toLocaleString()} {t('dzd')}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-500 text-sm border-t pt-4">
            <p>{t('contactPageP1')}</p>
            <p>{t('contactPageEmail')} | {t('contactPagePhone')}</p>
          </div>
        </div>

      <div className="text-center mt-8">
          <button 
            onClick={handleDownloadPdf} 
            disabled={isLoading}
            className="bg-sand hover:bg-clay text-white font-bold py-2 px-6 rounded-lg disabled:opacity-70 disabled:cursor-wait flex items-center justify-center mx-auto"
          >
              {isLoading ? (
                  <>
                      <Loader2 className="animate-spin me-2" size={20} />
                      {t('generatingPdf')}
                  </>
              ) : (
                  t('downloadPdf')
              )}
          </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
