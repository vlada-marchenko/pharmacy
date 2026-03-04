'use client';

import { useRouter, useParams } from 'next/navigation';
import css from './page.module.css';
import Icon from '@/src/components/Icon/Icon';
import { useState } from 'react';
import api from '../../../../../../../../lib/api';
import { useEffect } from 'react';
import Loading from '../../../../../../../loading';

type BoughtProducts = {
  productId: string;
  name: string;
  price: string;
  category: string;
};

type Customer = {
  _id: string;
  name: string;
  email: string;
  spent: string;
  bought_products: BoughtProducts[];
};

export default function CustomerGoodsModal() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.clientId as string;
  const shopId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shop/${shopId}/statistics/${clientId}/goods`);
        setCustomer(res.data.customer);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer:', error);
        setError(error instanceof Error ? error.message : 'Error fetching customer');
        setLoading(false);
      }
    };

    if (clientId && shopId) {
      fetchCustomer();
    }
  }, [clientId, shopId]);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={css.overlay} onClick={handleClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.close} onClick={handleClose}>
          <Icon name="x" width={20} height={20} />
        </button>
        <div className={css.content}>
          <h2 className={css.title}>The clients goods</h2>
          <div className={css.customer}>
            <div className={css.item}>
              <span className={css.name}>Name</span>
              <span className={css.value}>{customer?.name}</span>
            </div>
            <div className={css.item}>
              <span className={css.name}>Email</span>
              <span className={`${css.value} ${css.email}`}>{customer?.email}</span>
            </div>
            <div className={css.item}>
              <span className={css.name}>Spent</span>
              <span className={css.value}>{customer?.spent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
