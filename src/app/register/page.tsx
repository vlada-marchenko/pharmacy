'use client';

import { register } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Image from 'next/image';
import css from './page.module.css';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+?[0-9\s\-().]{7,20}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
});

type RegisterFormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
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
          <form className={css.form} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
