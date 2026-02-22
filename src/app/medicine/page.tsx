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
import Select from 'react-select';
import { addToShop } from '@/src/lib/product';
import { toast } from 'react-toastify';

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
  photo: string;
  name: string;
  price: string;
  category: string;
  description: DescriptionProps;
  reviews: ReviewsProps[];
};

export default function MedicinePage() {
  const pathname = usePathname();
  const shopId = Cookies.get('shopId');

  const [shop, setShop] = useState<ShopProps | null>(null);
  const [loading, setLoading] = useState(false);

  const [medicine, setMedicine] = useState<MedicineProps[]>([]);
  const [allMedicine, setAllMedicine] = useState<MedicineProps[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopId = Cookies.get('shopId');
        if (!shopId) return;
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
        const list = Array.isArray(data)
          ? data
          : data.medicines || data.data || [];
        setMedicine(list);
        setAllMedicine(list);
      } catch (error) {
        console.error('Error fetching medicine:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, []);

  const handleFilter = () => {
    let filtered = allMedicine;
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setMedicine(filtered);
  };

  const handleAddToShop = async (id: string) => {
    const price = window.prompt('Enter the price of the medicine:')
    if (!price) return;
    try {
      await addToShop(shopId!, id, Number(price))
      toast.success('Medicine added to shop');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const categories = [...new Set(allMedicine.map((item) => item.category))];

  const categoryOptions = [
    { value: '', label: 'All' },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

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
                Owner:{' '}
                <span className={css.ownerName}>{shop.shopOwnerName}</span>
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
              <Link href={`/shop/${shopId}/update`} className={css.edit}>
                Edit data
              </Link>
              <button className={css.add}>Add medicine</button>
            </div>
          </div>
        </div>

        <div className={css.tabsCont}>
          <Link
            href={`/shop/${shopId}/product`}
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
          <div className={css.filters}>
            <div className={css.inputs}>
            <div className={css.search}>
            <Select
              isSearchable={false}
              isClearable={false}
              options={categoryOptions}
              value={
                category
                  ? categoryOptions.find(
                      (option) => option.value === category,
                    ) || null
                  : null
              }
              onChange={(option) => setCategory(option?.value || '')}
              placeholder="Product category"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: '60px',
                  borderColor: state.isFocused
                    ? '#59b17a'
                    : 'rgba(29, 30, 33, 0.1)',
                  boxShadow: 'none',
                  height: '44px',
                  paddingLeft: '12px',
                  backgroundColor: '#fff',
                  '&:hover': { borderColor: '#59b17a' },
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '12px',
                  color: 'rgba(29, 30, 33, 0.4)',
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '12px',
                  color: '#1d1e21',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? '#59b17a'
                    : state.isFocused
                    ? '#f0f9f4'
                    : '#fff',
                  color: state.isSelected ? '#fff' : '#1d1e21',
                  fontSize: '12px',
                  cursor: 'pointer',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: '#1d1e21',
                  paddingRight: '16px',
                }),
              }}
            />
            </div>

            <div className={css.search}>
              <input
                type="text"
                className={css.input}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicine"
              />
              <Icon name="search" width={18} height={18} className={css.icon} />
            </div>

</div>
            <button className={css.button} onClick={handleFilter}>
              <Icon name="filter" width={18} height={18} />
              Filter
            </button>
          </div>

          <ul className={css.list}>
            {medicine.map((item) => {
              return (
                <li key={item.id} className={css.itemLi}>
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
                      <button className={css.btn} onClick={() => handleAddToShop(item.id)}>Add to shop</button>
                      <Link href={`/medicine/${item.id}`} className={css.link}>
                        Details
                      </Link>
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
