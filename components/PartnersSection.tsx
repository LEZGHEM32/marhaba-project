import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const partners = [
  { name: 'Ooredoo', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ooredoo_logo.svg', alt: 'Ooredoo', transparent: true },
  { name: 'Ministry of Tourism', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Minist%C3%A8re_du_Tourisme_et_de_l%27Artisanat_%28Alg%C3%A9rie%29_-_Logo.svg', alt: 'Ministry of Tourism', transparent: true },
  { name: 'ONAT', logoUrl: 'https://onat.dz/wp-content/uploads/2021/05/logo-onat-dz.png', alt: 'Office National du Tourisme', transparent: false },
  { name: 'Groupe HTT', logoUrl: 'https://www.groupehtt.dz/wp-content/uploads/2020/06/logo_groupe_HTT_-_Version_02.png', alt: 'Groupe HTT', transparent: false },
];

const PartnersSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-sand-light dark:bg-dark-navy">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-blue dark:text-white">{t('ourPartners')}</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16 lg:gap-x-20">
          {partners.map((partner) => (
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              key={partner.name}
              title={partner.alt}
              className="group"
            >
              <img 
                src={partner.logoUrl} 
                alt={partner.alt} 
                className={`h-12 md:h-14 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105 ${!partner.transparent ? 'mix-blend-multiply dark:mix-blend-luminosity' : ''}`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;