
import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import YoutubePlayerModal from '../components/YoutubePlayerModal';
import { useData } from '../contexts/DataContext';

const YOUTUBE_VIDEO_ID = 'RdFkC6Gtb5A';

const VRSection: React.FC = () => {
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [showOffers, setShowOffers] = useState(false);
    const { t } = useLanguage();
    const { offers } = useData();
    
    const handlePlay = () => {
        setIsPlayerOpen(true);
    };

    const handleCloseModal = () => {
        setIsPlayerOpen(false);
        setShowOffers(true);
    };

    const relatedOffers = offers.filter(o => o.location.en.includes('Djanet'));

    return (
        <section className="py-12 bg-white dark:bg-dark-blue">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-dark-blue dark:text-white">{t('vrSectionTitle')}</h2>
                    <p className="text-gray-600 mt-2 dark:text-gray-300">{t('vrSectionSubtitle')}</p>
                </div>
                
                <div 
                    className="relative rounded-lg overflow-hidden shadow-2xl cursor-pointer group w-full max-w-5xl mx-auto"
                    onClick={handlePlay}
                >
                    <img src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`} alt="VR Experience Thumbnail" className="w-full h-auto object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-70">
                        <PlayCircle size={80} className="text-white transform group-hover:scale-110 transition-transform"/>
                    </div>
                </div>

                {showOffers && (
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-dark-blue mb-4 dark:text-white">{t('vrOffersTitle')}</h3>
                        <p className="text-gray-600 mb-8 dark:text-gray-300">{t('vrOffersSubtitle')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
                        </div>
                        <Link to="/offers?category=trip&q=Djanet" className="mt-8 inline-block bg-sand hover:bg-clay text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                            {t('vrViewAllButton')}
                        </Link>
                    </div>
                )}
            </div>
            <YoutubePlayerModal 
                isOpen={isPlayerOpen}
                onClose={handleCloseModal}
                videoId={YOUTUBE_VIDEO_ID}
                title={t('vrExperience360')}
            />
        </section>
    );
};

export default VRSection;
