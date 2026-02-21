'use client';

import Icon from '@/src/components/Icon/Icon';
import css from './page.module.css';
import { getShop } from '@/src/lib/shop';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Loading from '@/src/app/loading';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { getMedicine } from '@/src/lib/medicine';

export type PropertierProps = {
    anti_inflammatory: string;
    sympotoms_relief: string;
    supportive_care: string;
    preventive_benefits: string;
    safery_note: string
}

export type DescriptionProps = {
    overview: string;
    medicinal_properties: PropertierProps;
}

export type ReviewsProps = {
    author: string;
    text: string;
    date: string;
}

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

export type MedicineProps = {
    id: string;
    photo: string,
    name: string,
    price: string,
    category: string;
    description: DescriptionProps;
    reviews: ReviewsProps[];
}

export default function MedicinePage() {
  const pathname = usePathname();
  const shopId = Cookies.get('shopId');

  const [shop, setShop] = useState<ShopProps | null>(null);
  const [loading, setLoading] = useState(true);

  const [medicine, setMedicine] = useState<MedicineProps[]>([]);

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

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const data = await getMedicine();
        setMedicine(Array.isArray(data) ? data : data.medicines || data.data || [])
      } catch (error) {
        console.error('Error fetching medicine:', error);
      }
    }
    fetchMedicine()
  }, [])

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


          <div className={css.products}>
            <ul className={css.list}>
              {medicine.map(item => {
                return (
                  <li key={item.id} className={css.itemLi}>
                    <Image src={item.photo} alt={item.name} className={css.img} width={335} height={300}/>
                    <div className={css.infoItem}>
                    <div className={css.up}>
                      <div className={css.med}>
                        <p className={css.name}>{item.name}</p>
                        <p className={css.category}>{item.category}</p>
                      </div>
                      <p className={css.price}>৳{item.price}</p>
                    </div>
                    <div className={css.down}>
                      <button className={css.btn}>Add to shop</button>
                      <Link href={`/medicine/${item.id}`} className={css.link}>Details</Link>
                    </div>
                    </div>
                  </li>
                );
              })}
              </ul>
          </div>
      </div>
    </div>
  );
}
