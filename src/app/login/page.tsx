'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '@/src/lib/auth';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './page.module.css';
import Link from 'next/link';
import Loading from '../loading';
import { useState } from 'react';

const schema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await login(data);
      const shopId = res.user.shopId;

      const isProduction = window.location.protocol === 'https:';

      const cookieOptions = isProduction
        ? {
            expires: 7,
            path: '/',
            sameSite: 'none' as const,
            secure: true,
          }
        : {
            expires: 7,
            path: '/',
            sameSite: 'lax' as const,
          };

      Cookies.set('token', res.token, {
        expires: 1,
        path: '/',
        ...(isProduction
          ? { sameSite: 'none' as const, secure: true }
          : { sameSite: 'lax' as const }),
      });
      localStorage.setItem('user', JSON.stringify(res.user));

      if (shopId) {
        Cookies.set('shopId', shopId, cookieOptions);
        localStorage.setItem('shopId', shopId);
        await new Promise((resolve) => setTimeout(resolve, 50));
        const cookieCheck = Cookies.get('shopId');
        console.log('All cookies after setting:', document.cookie);
        console.log('Cookie attributes used:', cookieOptions);
        console.log('Cookie set check:', cookieCheck);
        console.log('LocalStorage set check:', localStorage.getItem('shopId'));
        toast.success(`Welcome back, ${res.user.name}`);
        setTimeout(() => {
          router.push(`/shop/${shopId}/product`);
        }, 100);
      } else {
        router.push('/shop/create');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Login failed');
      console.log(err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`'container' ${css.page}`}>
      <div className={css.content}>
        <div className={css.titleCont}>
          <Image
            className={css.image}
            src="/pilll.png"
            alt="pill"
            width={92}
            height={92}
          />
          <h1 className={css.title}>
            Your medication, <br /> delivered Say goodbye to all{' '}
            <span className={css.span}>your healthcare</span> worries with us
          </h1>
        </div>
        <div className={css.formCont}>
          <form
            className={css.form}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className={css.field}>
              <input
                className={css.input}
                id="email"
                type="email"
                placeholder=" "
                {...formRegister('email')}
              />
              <label className={css.label} htmlFor="email">
                Email address
              </label>
              {errors.email && (
                <span className={css.errorMessage}>{errors.email.message}</span>
              )}
            </div>
            <div className={css.field}>
              <input
                className={css.input}
                id="password"
                type="password"
                placeholder=" "
                {...formRegister('password')}
              />
              <label className={css.label} htmlFor="password">
                Password
              </label>
              {errors.password && (
                <span className={css.errorMessage}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              className={css.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <Link className={css.link} href={'/register'}>
            Don`t have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
