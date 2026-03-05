'use client';

import Icon from '@/src/components/Icon/Icon';
import css from './page.module.css';
import { getShop } from '@/src/lib/shop';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/src/app/loading';
import Link from 'next/link';
import { getProducts } from '@/src/lib/product';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { deleteProduct } from '@/src/lib/product';
import DeleteModal from '@/src/components/DeleteModal/DeleteModal';
import EditModal from '@/src/components/EditModal/EditModal';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

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
  _id: string;
  id: string;
  photo: string;
  name: string;
  price: string;
  category: string;
  description: string;
};

export default function ProductPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [id, setId] = useState<string>('');
  const [shop, setShop] = useState<ShopProps | null>(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ProductProps | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [editTarget, setEditTarget] = useState<ProductProps | null>(null);

  useEffect(() => {
    console.log('=== DEBUG: Getting shopId ===');
    console.log('params.id:', params.id);
    console.log('Cookies.get(shopId):', Cookies.get('shopId'));
    console.log('localStorage.getItem(shopId):', localStorage.getItem('shopId'));

    let shopId = params.id as string;

    if (!shopId || shopId === 'undefined') {
      shopId = Cookies.get('shopId') || localStorage.getItem('shopId') || '';
    }

    console.log('Final shopId:', shopId);

    if (shopId && shopId !== 'undefined') {
      setId(shopId);
    } else {
      console.log('No shopId found, redirecting to /shop/create');
      toast.error('Shop ID not found. Please create a shop first.');
      router.push('/shop/create');
    }
  }, [params.id, router]);

  // useEffect(() => {
  //   const paramId = params?.id as string;
  //   const cookieId = Cookies.get('shopId');
  //   const localId = localStorage.getItem('shopId');

  //       console.log('=== PRODUCT PAGE DEBUG ===');
  //   console.log('paramId:', paramId);
  //   console.log('cookieId:', cookieId);
  //   console.log('localId:', localId);

  //   let validId = '';

  //   if (paramId && paramId !== 'undefined') {
  //     validId = paramId;
  //   } else if (cookieId && cookieId !== 'undefined') {
  //     validId = cookieId;
  //           router.replace(`/shop/${validId}/product`);
  //   } else if (localId && localId !== 'undefined' && localId !== 'null') {
  //     validId = localId;
  //      Cookies.set('shopId', localId, {
  //       expires: 7,
  //       path: '/',
  //       sameSite: 'lax',
  //     });
  //     router.replace(`/shop/${validId}/product`);
  //   }

  //       console.log('Final validId:', validId);

  //   if (validId) {
  //     setId(validId);
  //   } else {
  //           console.log('No valid ID found, redirecting to create');
  //     toast.error('Shop ID missing. Redirecting to setup...');
  //     router.push('/shop/create');
  //   }
  // }, [params.id, router]);



  useEffect(() => {
        if (!id || id === 'undefined') {
      console.log('Skipping fetchShop - invalid id:', id);
      return;
    }
    const fetchShop = async () => {
      setShopLoading(true);
      try {
                console.log('Fetching shop with id:', id);
        const data = await getShop(id);
                console.log('Shop data received:', data);
        setShop(data);
      } catch (error) {
        console.error('Error fetching shop:', error);
        toast.error('Failed to load shop');
      } finally {
        setShopLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  useEffect(() => {
        if (!id || id === 'undefined') {
      console.log('Skipping fetchProducts - invalid id:', id);
      return;
    }
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
                console.log('Fetching products with id:', id);
        const data = await getProducts(id);
        const list = Array.isArray(data)
          ? data
          : data.products || data.data || [];
                  console.log('Products received:', list.length, 'items');
        setProducts(list);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();

    const handleMedicineUpdate = () => {
      fetchProducts();
    };

    window.addEventListener('medicineUpdated', handleMedicineUpdate);

    return () => {
      window.removeEventListener('medicineUpdated', handleMedicineUpdate);
    };
  }, [id]);

  const handleEdit = async (product: ProductProps) => {
    setEditTarget(product);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !shop) return;
    setIsDeleting(true);
    try {
      await deleteProduct(shop!._id, deleteTarget.id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== deleteTarget.id),
      );
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!id || id === 'undefined' || shopLoading) {
    return <Loading />;
  }

  if (!shop) {
    return <div className={css.notFound}>Shop not found</div>;
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
              <Link href={`/shop/${id}/update`} className={css.edit}>
                Edit data
              </Link>
              <Link
                href={`/shop/${id}/product/add`}
                scroll={false}
                className={css.add}
              >
                Add medicine
              </Link>
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
          {productsLoading ? (
            <p className={css.empty}>Loading products...</p>
          ) : products.length === 0 ? (
            <p className={css.empty}>No products found</p>
          ) : (
            <ul className={css.list}>
              {products.map((item) => (
                <li className={css.itemLi} key={item.id || item._id}>
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
                      <button
                        className={css.btnEdit}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className={css.btnDelete}
                        onClick={() => setDeleteTarget(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.name || ''}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemPhoto={deleteTarget?.photo || ''}
        itemCategory={deleteTarget?.category || ''}
      />

      {editTarget && (
        <EditModal product={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </div>
  );
}
