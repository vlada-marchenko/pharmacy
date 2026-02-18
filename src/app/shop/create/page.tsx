'use client';

import css from './page.module.css';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createShop } from '../../../lib/shop';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  shopName: yup.string().min(2, 'Shop name must be at least 2 characters').required('Shop name is required'),
  ownerName: yup.string().min(2, 'Owner name must be at least 2 characters').required('Owner name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+?[0-9\s\-().]{7,20}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  address: yup.string().min(5, 'Enter a full street address').required('Address is required'),
  city: yup.string().min(2, 'Enter a valid city name').required('City is required'),
  zip: yup
    .string()
    .matches(/^[A-Z0-9\s\-]{3,10}$/i, 'Enter a valid ZIP / postal code')
    .required('ZIP code is required'),
  hasDelivery: yup.mixed<'yes' | 'no'>().oneOf(['yes', 'no']).required(),
});

type Props = yup.InferType<typeof schema>;

export default function CreateShopPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Props>({
    resolver: yupResolver(schema),
    defaultValues: {
      hasDelivery: 'yes',
    },
  });

  const onSubmit = async (data: Props) => {
    try {

      const backendData = {
        shopName: data.shopName,
        shopOwnerName: data.ownerName,
        email: data.email,
        phoneNumber: data.phone,
        streetAddress: data.address,
        city: data.city,
        zipPostal: data.zip,
        hasDeliverySystem: data.hasDelivery === 'yes',
      };

      const response = await createShop(backendData);

      if (response && response.shopId) {
        Cookies.set('shopId', response.shopId, { expires: 1 });
        toast.success('Shop created successfully!');
        router.push(`/shop/${response.shopId}/product`);
      } else {
        toast.error('Failed to create shop. Please try again.');
        return;
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.message || 'Shop creating error';
      toast.error(message);
    }
  };
  return (
    <div className={css.page}>
      <div className={css.content}>
        <div className={css.container}>
          <h1 className={css.title}>Create your Shop</h1>
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
                {...register('shopName', { required: 'Shop name is required' })}
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
                <span className={css.errorMessage}>{errors.email.message}</span>
              )}
            </div>
            <div className={css.field}>
              <label htmlFor="phone" className={css.label}>
                Phone Number
              </label>
              <input
                {...register('phone', { required: 'Phone number is required' })}
                className={css.input}
                type="text"
                id="phone"
                placeholder="Enter text"
              />
              {errors.phone && (
                <span className={css.errorMessage}>{errors.phone.message}</span>
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
                <span className={css.errorMessage}>{errors.city.message}</span>
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
              {isSubmitting ? 'Creating...' : 'Create account'}
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
