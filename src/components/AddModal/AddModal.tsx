'use client';
import css from './AddModal.module.css'
import Icon from '@/src/components/Icon/Icon';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { createProduct } from '@/src/lib/product';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getMedicine } from '@/src/lib/medicine';
import Select from 'react-select';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const schema = yup.object({
  name: yup.string().required('Medicine name is required'),
  price: yup
    .string()
    .typeError('Price must be a number')
    .required('Price is required'),
  category: yup.string().required('Category is required'),
  photo: yup.string().required('Photo is required'),
});

interface Props {
  onClose?: () => void;
}

type FormData = yup.InferType<typeof schema>;


export default function AddModal({ onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  const shopId = (params.id as string) || Cookies.get('shopId');

  const [photoPreview, setPhotoPreview] = useState('/pills.png');
  const [categories, setCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });
  const watchCategory = watch('category');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMedicine();
        const list = Array.isArray(data)
          ? data
          : data.medicines || data.data || [];

        const cats = [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...new Set(list.map((item: any) => item.category)),
        ] as string[];
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleClose = () => {
    reset();
    setPhotoPreview('/pills.png');
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!shopId) {
      toast.error('Shop not found');
      return;
    }

    try {
      await createProduct(shopId, data);
      toast.success('Medicine added successfully');
      reset();
      window.dispatchEvent(new Event('medicineUpdated'));
      if (onClose) {
        onClose();
      } else {
        router.back();
      }
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('ERROR RESPONSE:', error.response?.data);
      toast.error('Error adding medicine');
    }
  };

  return (
    <div className={css.overlay} onClick={handleClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className={css.close}>
          <Icon name="x" width={20} height={20} />
        </button>
        <div className={css.content}>
          <h3 className={css.title}>Add medicine to store</h3>
          <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={css.imageWrap}>
              <label htmlFor="photoUpload" className={css.imageLabel}>
                <Image
                  src={photoPreview}
                  alt="preview"
                  width={130}
                  height={130}
                  className={css.img}
                />
                <div className={css.uploadHint}>
                  <Icon name="pin" width={16} height={16} />
                  <span className={css.uploadText}>Upload image</span>
                </div>
              </label>
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                className={css.fileInput}
                onChange={handleFileChange}
              />
              {errors.photo && (
                <span className={css.imageError}>{errors.photo.message}</span>
              )}
            </div>

            <div className={css.field}>
              <label className={css.label} htmlFor="name">
                Medicine name
              </label>
              <input
                {...register('name')}
                className={`${css.input} ${errors.name ? css.inputError : ''}`}
                id="name"
                type="text"
                placeholder="Enter text"
              />
              {errors.name && (
                <span className={css.error}>{errors.name.message}</span>
              )}
            </div>
            <div className={css.field}>
              <label className={css.label} htmlFor="price">
                Price
              </label>
              <input
                {...register('price')}
                className={`${css.input} ${errors.price ? css.inputError : ''}`}
                id="price"
                type="text"
                placeholder="Enter text"
              />
              {errors.price && (
                <span className={css.error}>{errors.price.message}</span>
              )}
            </div>
            <div className={css.field}>
              <label className={css.label} htmlFor="category">
                Category
              </label>
              <Select
                instanceId="category-select"
                isSearchable={false}
                maxMenuHeight={160}
                options={[
                  { value: '', label: 'Select category' },
                  ...categories.map((cat) => ({ value: cat, label: cat })),
                ]}
                value={
                  watchCategory
                    ? { value: watchCategory, label: watchCategory }
                    : null
                }
                onChange={(option) =>
                  setValue('category', option?.value || '', {
                    shouldValidate: true,
                  })
                }
                placeholder="Select category"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: '60px',
                    borderColor: errors.category
                      ? '#e53e3e'
                      : state.isFocused
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
                  menuList: (base) => ({
                    ...base,
                    paddingRight: '6px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(89, 177, 122, 0.5) transparent',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                      marginTop: '8px',
                      marginBottom: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(89, 177, 122, 0.5)',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#59b17a',
                    },
                  }),
                  indicatorSeparator: () => ({ display: 'none' }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: '#1d1e21',
                    paddingRight: '16px',
                  }),
                }}
              />
              {errors.category && (
                <span className={css.error}>{errors.category.message}</span>
              )}
            </div>

            <div className={css.buttons}>
              <button className={css.confirm} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add medicine'}
              </button>
              <button className={css.cancel} onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
