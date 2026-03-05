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
  const id =
    (params.id as string) ||
    Cookies.get('shopId') ||
    (typeof window !== 'undefined' ? localStorage.getItem('shopId') : null);
  const pathname = usePathname();
  const router = useRouter();

  const [shop, setShop] = useState<ShopProps | null>(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ProductProps | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [editTarget, setEditTarget] = useState<ProductProps | null>(null);

  useEffect(() => {
    if (!id) {
      router.push('/shop/create');
      return;
    }
  }, [id, router]);

  useEffect(() => {
    const fetchShop = async () => {
      if (!id) return;
      setShopLoading(true);
      try {
        const data = await getShop(id);
        setShop(data);
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setShopLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;
      setProductsLoading(true);
      try {
        const data = await getProducts(id);
        const list = Array.isArray(data)
          ? data
          : data.products || data.data || [];
        setProducts(list);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();

    window.addEventListener('medicineUpdated', fetchProducts);

    return () => {
      window.removeEventListener('medicineUpdated', fetchProducts);
    };
  }, [id]);

  const handleEdit = async (product: ProductProps) => {
    setEditTarget(product);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
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

  if (!id) {
    return <Loading />;
  }

  if (shopLoading) {
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
