import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '16856017-103375b7b51e461a01e4f4edb';

export const getImages = (query, page = 1) =>
  axios.get(BASE_URL, {
    params: {
      orientation: 'horizontal',
      key: KEY,
      q: query,
      page: page,
    },
  });
