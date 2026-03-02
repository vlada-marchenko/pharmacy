'use client';

import css from './page.module.css';
import { useParams } from 'next/navigation';
import Icon from '@/src/components/Icon/Icon';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../../../lib/api';

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

type Product = {
  _id: string;
  id: string;
  photo: string;
  name: string;
  price: string;
};

type Transaction = {
  shopId: string;
  name: string;
  amount: string;
  type: string;
};

export default function StatisticsPage() {
  const params = useParams();
  const shopId = params.id as string;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await api.get(`/shop/${shopId}/statistics`);
        const data = await res.data

        setTotalProducts(data.totalProducts);
        setTotalCustomers(data.totalCustomers);
        setCustomers(data.customers);

        // Flatten transactions from transactionsByType
        if (data.transactionsByType) {
          const allTransactions = [
            ...(data.transactionsByType.Income || []),
            ...(data.transactionsByType.Expense || []),
            ...(data.transactionsByType.Error || []),
            ...(data.transactionsByType.Unknown || []),
          ];
          setTransactions(allTransactions);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(
          error instanceof Error ? error.message : 'Error fetching statistics',
        );
      }
    };

    if (shopId) {
      fetchStatistics();
    }
  }, [shopId]);

  if (error) {
    return <div className={css.page}>Error: {error}</div>;
  }

  return (
    <div className={css.page}>
      <div className={css.content}>
        <h2 className={css.title}>Statistics</h2>
        <div className={css.containers}>
          <div className={css.productsCont}>
            <div className={css.up}>
              <Icon name="products" width={18} height={18}  className={css.icon}/>
              <span className={css.span}>All products</span>
            </div>
            <span className={css.amount}>{totalProducts}</span>
          </div>
          <div className={css.productsCont}>
            <div className={css.up}>
              <Icon name="users" width={18} height={18} className={css.icon}/>
              <span className={css.span}>All customers</span>
            </div>
            <span className={css.amount}>{totalCustomers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
