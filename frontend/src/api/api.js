
import axios from 'axios';


// export async function productsData() {
//   const products = await axios.get('http://localhost:5000/api/products'); // or your real backend URL
//   return products;
// }

// export async function productsData() {
//   const products = await axios.get('https://dummyjson.com/products?limit=100');
//   return products.data; // ✅ Use .data
// }


export async function productsData() {
  const response = await axios.get('https://dummyjson.com/products?limit=100');
  return response.data.products; // <-- this is likely the actual array
}

