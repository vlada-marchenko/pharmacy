'use client';

import { LoginRequest } from '@/src/lib/auth';
import { useForm } from 'react-hook-form';
import { login } from '@/src/lib/auth';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './page.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();
  const router = useRouter();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res = await login(data);

      Cookies.set('token', res.token, { expires: 1 });

      if (res.user.shopId) {
        Cookies.set('shopId', res.user.shopId, { expires: 1 });
      }
      localStorage.setItem('user', JSON.stringify(res.user));
      toast.success(`Welcome back, ${res.user.name}`);
      router.push('/shop');
    } catch (err) {
      toast.error('Login failed');
      console.log(err);
    }
  };

  return (
    <div className={`'container' ${css.page}`}>
      <div className={css.content}>
        <div className={css.titleCont}>
          <Image
            className={css.image}
            src="/pill.png"
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
          <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={css.field}>
              <input
                className={css.input}
                id="email"
                type="email"
                placeholder=" "
                {...formRegister('email', { required: true })}
              />
              <label className={css.label} htmlFor="email">
                Email address
              </label>
            </div>
            <div className={css.field}>
              <input
                className={css.input}
                id="password"
                type="password"
                placeholder=" "
                {...formRegister('password', { required: true })}
              />
              <label className={css.label} htmlFor="password">
                Password
              </label>
            </div>

            <button
              className={css.button}
              type="submit"
              disabled={isSubmitting}
            >
              Log in
            </button>
          </form>
          <Link className={css.link} href={'/register'}>
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
