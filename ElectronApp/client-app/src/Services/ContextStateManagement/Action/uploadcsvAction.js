import { uploadCSVAPI } from '../../index';
import { uploadFile } from '../Type/type';

// Action Type
export const uploadFilecsv = () => {
  return { type: uploadFile };
};


const token = localStorage.getItem('access_token');

// Upload CSV Function
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(uploadCSVAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token':token,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json(); // Adjust according to your API response
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
};