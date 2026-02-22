'use client';

import Icon from '@/src/components/Icon/Icon';
import css from './page.module.css';
import { getShop } from '@/src/lib/shop';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/src/app/loading';
import Link from 'next/link';
import { addToShop, createProduct, getProducts } from '@/src/lib/product';
import { toast } from 'react-toastify';
import Image from 'next/image';

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

export type ProductProps = {
  id: string;
  photo: string;
  name: string;
  price: string;
  category: string;
  description: string;
};

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const pathname = usePathname();

  const [shop, setShop] = useState<ShopProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;
      try {
        const data = await getProducts(id);
        const list = Array.isArray(data)
          ? data
          : data.products || data.data || [];
        setProducts(list);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
          fetchProducts();
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddMedicine = async (data: any) => {
    try {
      const newProduct = await createProduct(id, data);
      setProducts([...products, newProduct]);
      toast.success('Medicine added successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Error adding medicine');
    }
  };

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
              <Link href={`/shop/${id}/update`} className={css.edit}>
                Edit data
              </Link>
              <button className={css.add}>Add medicine</button>
            </div>
          </div>
        </div>

        <div className={css.tabsCont}>
          <Link
            href={`/shop/${id}/product`}
            className={`${css.tab} ${
              pathname.includes('/product') ? css.tabActive : ''
            }`}
          >
            Drug store
          </Link>
          <Link
            href={`/medicine`}
            className={`${css.tab} ${
              pathname.includes('/medicine') ? css.tabActive : ''
            }`}
          >
            All medicine
          </Link>
        </div>

        <div className={css.products}>
          {products.length === 0 ? (
            <p className={css.empty}>No products yet</p>
          ) : (
            <ul className={css.list}>
              {products.map((item) => (
                <li className={css.item} key={item.id}>
                  <Image
                    src={item.photo}
                    alt={item.name}
                    className={css.img}
                    width={335}
                    height={300}
                  />
                  <div className={css.infoItem}>
                    <div className={css.up}>
                      <div className={css.med}>
                        <p className={css.name}>{item.name}</p>
                        <p className={css.category}>{item.category}</p>
                      </div>
                      <p className={css.price}>৳{item.price}</p>
                    </div>
                    <div className={css.down}>
                      <button className={css.btn}>Edit</button>
                      <button className={css.btn}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
