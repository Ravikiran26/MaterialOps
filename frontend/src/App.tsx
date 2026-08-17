import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Reports from './pages/Reports';

export default function App(){return <BrowserRouter><Routes><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/orders" element={<Orders/>}/><Route path="/vendors" element={<Vendors/>}/><Route path="/customers" element={<Customers/>}/><Route path="/products" element={<Products/>}/><Route path="/reports" element={<Reports/>}/></Route></Routes></BrowserRouter>}
