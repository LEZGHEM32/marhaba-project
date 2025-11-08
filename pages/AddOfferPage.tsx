import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Offer, OfferCategory, ItineraryItem, UserType } from '../types';
import { Plus, Trash2, UploadCloud, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';

type LocalizedString = { en: string; ar: string };

type FormData = {
  title: LocalizedString;
  location: LocalizedString;
  description: LocalizedString;
  images: string[];
  category: OfferCategory | '';
  priceDZD: number | '';
  includedServices: LocalizedString[];
  itinerary: ItineraryItem[];
  cancellationPolicy: LocalizedString;
  duration: LocalizedString;
};

const initialFormData: FormData = {
    title: { en: '', ar: '' },
    location: { en: '', ar: '' },
    description: { en: '', ar: '' },
    images: [],
    category: '',
    priceDZD: '',
    includedServices: [{ en: '', ar: '' }],
    itinerary: [{ day: 1, description: { en: '', ar: '' } }],
    cancellationPolicy: { en: '', ar: '' },
    duration: { en: '', ar: '' },
};

const AddOfferPage: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { addOffer } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<any>({});
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  
  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sand focus:border-sand dark:bg-dark-navy dark:border-gray-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocalizedInputChange = (field: keyof FormData, subfield: 'en' | 'ar', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as LocalizedString),
        [subfield]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      // Fix: The 'file' parameter was being inferred as 'unknown', causing a type error.
      // Using a standard for-loop with files.item(i) ensures correct type inference and handles potential null values.
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (reader.result) {
                  setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
              }
          };
          reader.readAsDataURL(file);
        }
      }
  };

  const removeImage = (index: number) => {
      setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleServiceChange = (index: number, lang: 'en' | 'ar', value: string) => {
    const newServices = [...formData.includedServices];
    newServices[index][lang] = value;
    setFormData(prev => ({ ...prev, includedServices: newServices }));
  };

  const addService = () => {
    setFormData(prev => ({ ...prev, includedServices: [...prev.includedServices, { en: '', ar: '' }] }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({ ...prev, includedServices: prev.includedServices.filter((_, i) => i !== index) }));
  };
  
  const handleItineraryChange = (index: number, lang: 'en' | 'ar', value: string) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index].description[lang] = value;
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({ ...prev, itinerary: [...prev.itinerary, { day: nextDay, description: { en: '', ar: '' } }] }));
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const validate = () => {
      const newErrors: any = {};
      if (!formData.title.en.trim() || !formData.title.ar.trim()) newErrors.title = t('fieldCannotBeEmpty');
      if (!formData.location.en.trim() || !formData.location.ar.trim()) newErrors.location = t('fieldCannotBeEmpty');
      if (!formData.description.en.trim() || !formData.description.ar.trim()) newErrors.description = t('fieldCannotBeEmpty');
      if (!formData.cancellationPolicy.en.trim() || !formData.cancellationPolicy.ar.trim()) newErrors.cancellationPolicy = t('fieldCannotBeEmpty');
      if (formData.images.length === 0) newErrors.images = t('atLeastOneImage');
      if (!formData.category) newErrors.category = t('selectCategory');
      if (formData.priceDZD === '' || formData.priceDZD <= 0) newErrors.priceDZD = t('priceMustBePositive');
      if (formData.includedServices.some(s => !s.en.trim() || !s.ar.trim())) newErrors.includedServices = t('fieldCannotBeEmpty');
      if (formData.includedServices.length === 0) newErrors.includedServices = t('addAtLeastOneService');
      
      if (formData.category === OfferCategory.OrganizedTrip) {
          if (formData.itinerary.some(i => !i.description.en.trim() || !i.description.ar.trim())) newErrors.itinerary = t('fieldCannotBeEmpty');
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && user) {
      const offerData = {
          ...formData,
          priceDZD: Number(formData.priceDZD),
          category: formData.category as OfferCategory,
          itinerary: formData.category === OfferCategory.OrganizedTrip ? formData.itinerary : undefined,
          duration: (formData.duration.en && formData.duration.ar) ? formData.duration : undefined,
      };

      const newOffer: Offer = {
          ...offerData,
          id: `offer-${Date.now()}`,
          provider: { id: user.id, name: user.name, verified: user.type === UserType.Provider ? true : false },
          rating: 0,
          reviewsCount: 0,
      };

      addOffer(newOffer);
      navigate('/dashboard');
    }
  };

  const renderLocalizedFields = (field: 'title' | 'location' | 'description' | 'cancellationPolicy' | 'duration', type: 'input' | 'textarea' = 'input') => {
      const Component = type === 'input' ? 'input' : 'textarea';
      return (
          <div>
              <label className={`${labelClasses} capitalize`}>{t(field === 'cancellationPolicy' ? 'cancellationPolicy' : field)}</label>
              <div className="flex border-b mb-2 dark:border-gray-700">
                  <button type="button" onClick={() => setActiveLang('en')} className={`px-4 py-1 text-sm ${activeLang === 'en' ? 'border-b-2 border-sand text-sand' : 'text-gray-500 dark:text-gray-400'}`}>{t('english')}</button>
                  <button type="button" onClick={() => setActiveLang('ar')} className={`px-4 py-1 text-sm ${activeLang === 'ar' ? 'border-b-2 border-sand text-sand' : 'text-gray-500 dark:text-gray-400'}`}>{t('arabic')}</button>
              </div>
              <Component
                  name={`${field}.${activeLang}`}
                  value={formData[field][activeLang]}
                  onChange={(e) => handleLocalizedInputChange(field, activeLang, e.target.value)}
                  className={inputClasses}
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  rows={type === 'textarea' ? 4 : undefined}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
      )
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-dark-blue mb-6 dark:text-gray-300 dark:hover:text-white">
            <ArrowLeft size={20} />
            {t('back')}
        </button>
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 dark:bg-dark-blue">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-blue mb-6 border-b pb-4 dark:text-white dark:border-gray-700">{t('addNewOffer')}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-blue border-b pb-2 dark:text-white dark:border-gray-700">{t('basicInformation')}</h3>
            {renderLocalizedFields('title')}
            {renderLocalizedFields('location')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>{t('category')}</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className={`${inputClasses} bg-white dark:bg-dark-navy`}>
                        <option value="" disabled>{t('selectCategory')}</option>
                        <option value={OfferCategory.OrganizedTrip}>{t('organizedTrip')}</option>
                        <option value={OfferCategory.Hotel}>{t('hotelBooking')}</option>
                        <option value={OfferCategory.Guesthouse}>{t('guesthouse')}</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                <div>
                    <label className={labelClasses}>{t('price')} ({t('dzd')})</label>
                    <input type="number" name="priceDZD" value={formData.priceDZD} onChange={handleInputChange} className={inputClasses} />
                    {errors.priceDZD && <p className="text-red-500 text-xs mt-1">{errors.priceDZD}</p>}
                </div>
            </div>
            
            <div>
              <label className={labelClasses}>{t('uploadImages')}</label>
              <div className="mt-1">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md border-2 border-dashed border-gray-300 hover:border-sand transition-colors p-6 flex flex-col items-center justify-center text-center dark:bg-dark-navy dark:border-gray-600 dark:hover:border-sand">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-300">{t('dragDropOrClick')}</span>
                  <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{t('uploadImagesHelp')}</p>
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            </div>

            {formData.images.length > 0 && (
              <div>
                <label className={labelClasses}>{t('imagePreview')}</label>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold text-dark-blue border-b pb-2 pt-4 dark:text-white dark:border-gray-700">{t('details')}</h3>
            {renderLocalizedFields('description', 'textarea')}
            {renderLocalizedFields('cancellationPolicy', 'textarea')}
            {renderLocalizedFields('duration')}
            
            <h3 className="text-lg font-semibold text-dark-blue border-b pb-2 pt-4 dark:text-white dark:border-gray-700">{t('includedServices')}</h3>
            <div className="space-y-4">
                {formData.includedServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input type="text" placeholder={t('english')} value={service.en} onChange={e => handleServiceChange(index, 'en', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder={t('arabic')} value={service.ar} onChange={e => handleServiceChange(index, 'ar', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-white" dir="rtl" />
                        <button type="button" onClick={() => removeService(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-full dark:hover:bg-red-500/10"><Trash2 size={18}/></button>
                    </div>
                ))}
                <button type="button" onClick={addService} className="text-sm text-sand hover:underline flex items-center gap-1"><Plus size={16}/>{t('addService')}</button>
                {errors.includedServices && <p className="text-red-500 text-xs mt-1">{errors.includedServices}</p>}
            </div>
            
            {formData.category === OfferCategory.OrganizedTrip && (
                <>
                    <h3 className="text-lg font-semibold text-dark-blue border-b pb-2 pt-4 dark:text-white dark:border-gray-700">{t('tripItinerary')}</h3>
                    <div className="space-y-4">
                        {formData.itinerary.map((item, index) => (
                             <div key={index} className="flex items-start gap-2">
                                 <span className="font-bold pt-2 dark:text-white">{t('day')} {item.day}</span>
                                <div className="flex-grow space-y-2">
                                    <textarea placeholder={`${t('description')} (${t('english')})`} value={item.description.en} onChange={e => handleItineraryChange(index, 'en', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-white" />
                                    <textarea placeholder={`${t('description')} (${t('arabic')})`} value={item.description.ar} onChange={e => handleItineraryChange(index, 'ar', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-dark-navy dark:border-gray-600 dark:text-white" dir="rtl"/>
                                </div>
                                <button type="button" onClick={() => removeItineraryDay(index)} className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-full dark:hover:bg-red-500/10"><Trash2 size={18}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addItineraryDay} className="text-sm text-sand hover:underline flex items-center gap-1"><Plus size={16}/>{t('addItineraryDay')}</button>
                        {errors.itinerary && <p className="text-red-500 text-xs mt-1">{errors.itinerary}</p>}
                    </div>
                </>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
                <button type="button" onClick={() => navigate('/dashboard')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">{t('cancel')}</button>
                <button type="submit" className="bg-sand hover:bg-clay text-white font-bold py-2 px-6 rounded-lg transition duration-300">{t('saveOffer')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOfferPage;
