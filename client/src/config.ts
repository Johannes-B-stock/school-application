const dev = {
  API_URL: 'http://localhost:3000',
  IMAGE_URL: 'http://localhost:3000/images/avatars/',
};

const prod = {
  API_URL: '',
  IMAGE_URL: '/images/avatars/',
};

console.log(process.env.NODE_ENV);
const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default {
  ...config,
};
