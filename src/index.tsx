import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { Path } from './constant/path';
import CartPage from './cartPage/CartPage';
import FavoriteItems from './FavoriteItems';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path={Path.TOP} element={<App />} >
      </Route>
      <Route path={Path.CARTPAGE} element={<CartPage />}>
      </Route>
      <Route path={Path.PRODUCTDETAIL} element={<ProductDetail />}>
      </Route>
      <Route path={Path.FAVORIEITEMS} element={<FavoriteItems/>}>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
