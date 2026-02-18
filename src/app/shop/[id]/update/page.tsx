'use client';

import css from './page.module.css';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { getShop, editShop } from '../../../../lib/shop';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

type Props = {
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  hasDelivery: 'yes' | 'no';
};

export default function UpdateShopPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Props>({
    defaultValues: {
      hasDelivery: 'yes',
    },
  });

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const shopId = Cookies.get('shopId');

        if (!shopId) {
          toast.error('Shop ID not found in cookies.');
          router.push('/shop/create');
          return;
        }

        const shopData = await getShop(shopId);

        reset({
          shopName: shopData.shopName,
          ownerName: shopData.shopOwnerName,
          email: shopData.email,
          phone: shopData.phoneNumber,
          address: shopData.streetAddress,
          city: shopData.city,
          zip: shopData.zipPostal,
          hasDelivery: shopData.hasDeliverySystem ? 'yes' : 'no',
        });
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast.error('Failed to fetch shop data. Please try again.');
      }
    };
    fetchShopData();
  }, [reset, router]);

  const onSubmit = async (data: Props) => {
    try {
      const shopId = Cookies.get('shopId');
      if (!shopId) {
        toast.error('Shop ID not found in cookies.');
        router.push('/shop/create');
        return;
      }

      const backendData = {
        shopId: shopId,
        shopName: data.shopName,
        shopOwnerName: data.ownerName,
        email: data.email,
        phoneNumber: data.phone,
        streetAddress: data.address,
        city: data.city,
        zipPostal: data.zip,
        hasDeliverySystem: data.hasDelivery === 'yes',
      };

      await editShop(backendData);
      toast.success('Shop updated successfully!');

      router.push(`/shop/${shopId}/product`);
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error(typeof error === 'string' ? error : JSON.stringify(error));
      toast.error('Failed to update shop. Please try again.');
    }
  };
  return (
    <div className={css.page}>
      <div className={css.content}>
        <div className={css.container}>
          <h1 className={css.title}>Edit data</h1>
          <p className={css.description}>
            This information will be displayed publicly so be careful what you
            share.
          </p>
          <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={css.grid}>
              <div className={css.field}>
                <label htmlFor="name" className={css.label}>
                  Shop Name
                </label>
                <input
                  {...register('shopName', {
                    required: 'Shop name is required',
                  })}
                  className={css.input}
                  type="text"
                  id="name"
                  placeholder="Enter text"
                />
                {errors.shopName && (
                  <span className={css.errorMessage}>
                    {errors.shopName.message}
                  </span>
                )}
              </div>
              <div className={css.field}>
                <label htmlFor="ownerName" className={css.label}>
                  Shop Owner Name
                </label>
                <input
                  {...register('ownerName', {
                    required: 'Owner name is required',
                  })}
                  className={css.input}
                  type="text"
                  id="ownerName"
                  placeholder="Enter text"
                />
                {errors.ownerName && (
                  <span className={css.errorMessage}>
                    {errors.ownerName.message}
                  </span>
                )}
              </div>
              <div className={css.field}>
                <label htmlFor="email" className={css.label}>
                  Email address
                </label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  className={css.input}
                  type="email"
                  id="email"
                  placeholder="Enter text"
                />
                {errors.email && (
                  <span className={css.errorMessage}>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className={css.field}>
                <label htmlFor="phone" className={css.label}>
                  Phone Number
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                  className={css.input}
                  type="text"
                  id="phone"
                  placeholder="Enter text"
                />
                {errors.phone && (
                  <span className={css.errorMessage}>
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className={css.field}>
                <label htmlFor="address" className={css.label}>
                  Street address
                </label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className={css.input}
                  type="text"
                  id="address"
                  placeholder="Enter text"
                />
                {errors.address && (
                  <span className={css.errorMessage}>
                    {errors.address.message}
                  </span>
                )}
              </div>
              <div className={css.field}>
                <label htmlFor="city" className={css.label}>
                  City
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className={css.input}
                  type="text"
                  id="city"
                  placeholder="Enter text"
                />
                {errors.city && (
                  <span className={css.errorMessage}>
                    {errors.city.message}
                  </span>
                )}
              </div>
              <div className={css.field}>
                <label htmlFor="zip" className={css.label}>
                  Zip / Postal Code
                </label>
                <input
                  {...register('zip', { required: 'Zip code is required' })}
                  className={css.input}
                  type="text"
                  id="zip"
                  placeholder="Enter text"
                />
                {errors.zip && (
                  <span className={css.errorMessage}>{errors.zip.message}</span>
                )}
              </div>
            </div>

            <div className={css.field}>
              <label htmlFor="delivery" className={css.labelPoll}>
                Has own delivery System?
              </label>
              <div className={css.poll}>
                <input
                  className={css.inputRadio}
                  type="radio"
                  id="deliveryYes"
                  value="yes"
                  {...register('hasDelivery')}
                />
                <label htmlFor="deliveryYes" className={css.labelRadio}>
                  Yes
                </label>
                <input
                  className={css.inputRadio}
                  type="radio"
                  id="deliveryNo"
                  value="no"
                  {...register('hasDelivery')}
                />
                <label htmlFor="deliveryNo" className={css.labelRadio}>
                  No
                </label>
              </div>
            </div>
            <button
              type="submit"
              className={css.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
        <Image
          src="/pic.png"
          alt="Shop image"
          className={css.image}
          width={335}
          height={470}
        />
      </div>
    </div>
  );
}
