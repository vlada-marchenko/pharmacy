'use client';

import { RegisterRequest } from '@/src/lib/auth';
import { register } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Image from 'next/image';
import css from './page.module.css';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await register(data);

      toast.success('Registration successful');
      router.push('/login');
    } catch (err) {
      toast.error('Registration failed');
      console.log(err);
    }
  };

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
          <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={css.field}>
              <input
                className={css.input}
                id="name"
                type="text"
                placeholder=" "
                {...formRegister('name', { required: true })}
              />
              <label className={css.label} htmlFor="name">
                User Name
              </label>
            </div>
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
                id="phone"
                type="tel"
                placeholder=" "
                {...formRegister('phone', { required: true })}
              />
              <label className={css.label} htmlFor="phone">
                Phone number
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

            <button className={css.button} type="submit">
              Register
            </button>
          </form>
          <Link className={css.link} href={'/login'}>
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
