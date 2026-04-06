import { api } from './api';

export const saveLocation = async (formData: FormData, id?: string) => {
  if (id) {
    const { data } = await api.patch(`/locations/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  }

  const { data } = await api.post('/locations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};
