'use client';

import Icon from '@/src/components/Icon/Icon';
import css from './page.module.css';
import { getShop } from '@/src/lib/shop';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/src/app/loading';
import Link from 'next/link';

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

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const pathname = usePathname();

  const [shop, setShop] = useState<ShopProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      if (!id) return;
      try {
        const data = await getShop(id);
        setShop(data);
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

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
              <Link href={`/shop/${id}/update`} className={css.edit}>Edit data</Link>
              <button className={css.add}>Add medicine</button>
            </div>
          </div>
          </div>

          <div className={css.tabsCont}>
            <Link href={`/shop/${id}/product`}className={`${css.tab} ${pathname.includes('/product') ? css.tabActive : ''}`}>Drug store</Link>
            <Link href={`/shop/${id}/medicine`} className={`${css.tab} ${pathname.includes('/medicine') ? css.tabActive : ''}`}>All medicine</Link>
          </div>


          <div className={css.products}>
            <p className={css.empty}>No medicine yet</p>
          </div>
      </div>
    </div>
  );
}
