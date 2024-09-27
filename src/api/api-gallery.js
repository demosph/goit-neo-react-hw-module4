import axios from 'axios';

const accessKey = '2ZvL_AvI1wPx76pYZWdXuQxuvFoY1p53zK0tjQi2cQY';
const imagesPerPage = 14;
axios.defaults.baseURL = 'https://api.unsplash.com';
axios.defaults.headers.common['Authorization'] = `Client-ID ${accessKey}`;

export const fetchGallery = async (searchQuery, page) => {
  const response = await axios.get(`/search/photos`, {
    params: {
      query: searchQuery,
      page,
      per_page: imagesPerPage,
      orientation: 'landscape',
    },
  });
  return response.data;
};