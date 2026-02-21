'use client';

import Icon from '@/src/components/Icon/Icon';
import css from './Shop.module.css';
import { getShop } from '@/src/lib/shop';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Loading from '@/src/app/loading';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type ShopProps = {
  _id: string;
  ownerId: string;
  shopName: string;
  shopOwnerName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  zipPostal: string;
  hasDeliverySystem: boolean;
  createdAt: string;
  updatedAt: string;
};


export default function Shop() {
  const pathname = usePathname();
  const shopId = Cookies.get('shopId');

  const [shop, setShop] = useState<ShopProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopId = Cookies.get('shopId');
        if (!shopId) return
        const data = await getShop(shopId);
        setShop(data);
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className={css.page}>
      <div className={css.content}>
        <div className={css.shop}>
          <h2 className={css.title}>{shop.shopName}</h2>

          <div className={css.info}>
            <div className={css.data}>
              <p className={css.owner}>
                Owner: <span className={css.name}>{shop.shopOwnerName}</span>
              </p>
              <div className={css.contact}>
                <div className={css.item}>
                  <Icon name="map" width={18} height={18} />
                  <p className={css.text}>{shop.streetAddress}</p>
                </div>
                <div className={css.item}>
                  <Icon name="phone" width={18} height={18} />
                  <p className={css.text}>{shop.phoneNumber}</p>
                </div>
              </div>
            </div>
            <div className={css.buttons}>
              <Link href={`/shop/${shopId}/update`} className={css.edit}>Edit data</Link>
              <button className={css.add}>Add medicine</button>
            </div>
          </div>
          </div>

          <div className={css.tabsCont}>
            <Link href={`/shop/${shopId}/product`}className={`${css.tab} ${pathname.includes('/product') ? css.tabActive : ''}`}>Drug store</Link>
            <Link href={`/medicine`} className={`${css.tab} ${pathname.includes('/medicine') ? css.tabActive : ''}`}>All medicine</Link>
          </div>
          </div>
          </div>
)}
