'use client';

import css from './page.module.css';
import { useParams } from 'next/navigation';
import Icon from '@/src/components/Icon/Icon';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../../../lib/api';
import Link from 'next/link';
import Loading from '@/src/app/loading';

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
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/shop/${shopId}/statistics`);
        const data = await res.data;

        setTotalProducts(data.totalProducts);
        setTotalCustomers(data.totalCustomers);
        setCustomers(data.customers);

        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(
          error instanceof Error ? error.message : 'Error fetching statistics',
        );
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchStatistics();
    }
  }, [shopId]);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <div className={css.notFound}>Failed to fetch statistics</div>;
  }

  return (
    <div className={css.page}>
      <div className={css.content}>
        <h2 className={css.title}>Statistics</h2>
        <div className={css.containers}>
          <div className={css.productsCont}>
            <div className={css.up}>
              <Icon
                name="products"
                width={18}
                height={18}
                className={css.icon}
              />
              <span className={css.span}>All products</span>
            </div>
            <span className={css.amount}>{totalProducts}</span>
          </div>
          <div className={css.productsCont}>
            <div className={css.up}>
              <Icon name="users" width={18} height={18} className={css.icon} />
              <span className={css.span}>All customers</span>
            </div>
            <span className={css.amount}>{totalCustomers}</span>
          </div>
        </div>
        <div className={css.conts}>
          <div className={css.customers}>
            <h3 className={css.tableTitle}>Recent Customers</h3>
            <div className={css.tableWrapper}>
              <table className={css.table}>
                <thead>
                  <tr className={css.tr}>
                    <th className={css.th}>Name</th>
                    <th className={css.th}>Email</th>
                    <th className={css.th}>Spent</th>
                    <th className={css.th}>Medicine</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 5).map((customer) => (
                    <tr key={customer._id} className={css.tr}>
                      <td className={css.td}>{customer.name}</td>
                      <td className={css.td}>{customer.email}</td>
                      <td className={css.tdSpent}>{customer.spent}</td>
                      <td className={css.td}>
                        <Link href={`/shop/${shopId}/statistics/${customer._id}/goods`} className={css.viewBtn}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={css.transactions}>
            <h3 className={css.tableTitle}>Income/Expenses</h3>
            <table className={css.tableTr}>
              <thead className={css.thead}>
                <tr className={css.date}>
                  <th className={css.dateItem}>Today</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 6).map((transaction, index) => (
                  <tr key={index} className={css.trItem}>
                    <td className={css.trContent}>
                      <span
                        className={`${css.type} ${
                          css[transaction.type.toLowerCase()]
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className={css.trName}>{transaction.name}</td>
                    <td className={css.trAmount}>
                      <span
                        className={`${css.amount} ${
                          css[transaction.type.toLowerCase()]
                        }`}
                      >
                        {transaction.amount}
                      </span>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
