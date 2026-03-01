'use client';

import css from './page.module.css';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { getMedicineById } from '@/src/lib/medicine';
import { toast } from 'react-toastify';
import { addToShop } from '@/src/lib/product';
import Loading from '../../loading';
import Image from 'next/image';

export type PropertierProps = {
  anti_inflammatory: string;
  symptom_relief: string;
  supportive_care: string;
  preventive_benefits: string;
  safety_note: string;
};

export type DescriptionProps = {
  overview: string;
  medicinal_properties: PropertierProps;
};

export type ReviewsProps = {
  author: string;
  text: string;
  date: string;
};

type MedicineProps = {
  _id: string;
  photo: string;
  name: string;
  price: string;
  category: string;
  description: DescriptionProps;
  reviews: ReviewsProps[];
};

export default function MedicinePage() {
  const params = useParams();
  const medicineId = params.medicineId as string;
  const shopId = Cookies.get('shopId');

  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState<MedicineProps | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>(
    'description',
  );

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!medicineId) return;

      try {
        setLoading(true);
        const data = await getMedicineById(medicineId);
        setMedicine(data);
      } catch (error) {
        console.error('Error fetching medicine:', error);
        toast.error('Error fetching medicine');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [medicineId]);

  const handleAddToShop = async () => {
    if (!medicine || !shopId) {
      toast.error('Medicine or shop not found');
      return;
    }

    try {
      setIsAdding(true);
      await addToShop(shopId, medicine._id, Number(medicine.price));
      toast.success('Medicine added to shop');
    } catch (error) {
      console.error('Error adding medicine to shop:', error);
      toast.error('Error adding medicine to shop');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!medicine) {
    return <div>Medicine not found</div>;
  }

  return (
    <div className={css.page}>
      <div className={css.content}>
        <div className={css.item}>
          <Image
            src={medicine?.photo}
            alt={medicine?.name}
            width={300}
            height={300}
          />
          <div className={css.nameCont}>
            <div className={css.up}>
              <div className={css.names}>
                <span className={css.name}>{medicine.name}</span>
                <span className={css.category}>{medicine.category}</span>
              </div>
              <span className={css.price}>${medicine.price}</span>
            </div>
            <button
              className={css.btn}
              onClick={() => handleAddToShop()}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Shop'}
            </button>
          </div>
        </div>
        <div className={css.container}>
          <div className={css.buttons}>
            <button
              className={`${css.tabBtn} ${
                activeTab === 'description' ? css.tabActive : ''
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${css.tabBtn} ${
                activeTab === 'reviews' ? css.tabActive : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
          <div className={css.tabContent}>
            {activeTab === 'description' && (
              <div className={css.descr}>
                <p className={css.overview}>
                  {medicine.description.overview}</p>
                <p className={css.med}>Medical Effect: <span className={css.spanMed}>{medicine.description.medicinal_properties.anti_inflammatory}</span></p>
                <p className={css.med}>Medical Uses: <span className={css.spanMed}>{medicine.description.medicinal_properties.symptom_relief}</span></p>
                <p className={css.med}>Supportive Care: <span className={css.spanMed}>{medicine.description.medicinal_properties.supportive_care}</span></p>
                <p className={css.med}>Medical Properties: <span className={css.spanMed}>{medicine.description.medicinal_properties.preventive_benefits}</span></p>
                <p className={css.med}>Safety Note: <span className={css.spanMed}>{medicine.description.medicinal_properties.safety_note}</span></p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={css.reviewsTab}>
                {medicine.reviews.map((review, index) => (
                  <div key={index} className={css.review}>
                    <div className={css.header}>
                      <span className={css.nameReview}>{review.author}</span>
                      <span className={css.date}>{review.date}</span>
                    </div>
                    <p className={css.text}>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
