'use client';

import css from './page.module.css';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { getMedicineById } from '@/src/lib/medicine';
import { toast } from 'react-toastify';
import { addToShop } from '@/src/lib/product';
import Loading from '../../loading';

export type PropertierProps = {
  anti_inflammatory: string;
  sympotoms_relief: string;
  supportive_care: string;
  preventive_benefits: string;
  safery_note: string;
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

  return <div>medicne page</div>;
}
