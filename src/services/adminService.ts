import apiClient from './apiClient';

export const addProductImages = async (productId: number, images: File[]) => {
  const formData = new FormData();
  
  images.forEach((image) => {
    formData.append('photos', image);
  });

  const response = await apiClient.post(`/products/${productId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
