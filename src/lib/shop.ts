import api from './api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createShop = async (data: any) => {
  const res = await api.post('/shop/create', data);
  const shopId = res.data.shopId || res.data._id || res.data.data?._id;
  console.log('createShop response:', { ...res.data, shopId });

  return { ...res.data, shopId };
};

export const getShop = async (shopId: string) => {
  const res = await api.get(`/shop/${shopId}`);
  return res.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editShop = async (data: any) => {
  const res = await api.put(`/shop/${data.shopId}/update`, data);
  return res.data;
};
