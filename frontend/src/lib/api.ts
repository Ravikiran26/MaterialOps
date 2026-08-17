import type { Customer, Order, OrderStatus, Product, Vendor } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(body.message || 'Request failed');
  }
  return response.json();
}

export const api = {
  dashboard: () => request<any>('/dashboard'),
  orders: (search = '', status = 'ALL') => request<Order[]>(`/orders?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`),
  order: (id: string) => request<Order>(`/orders/${id}`),
  vendors: () => request<Vendor[]>('/vendors'),
  customers: () => request<Customer[]>('/customers'),
  products: () => request<Product[]>('/products'),
  reports: () => request<any>('/reports'),
  assignVendor: (orderId: string, vendorId: string) => request<Order>(`/orders/${orderId}/assign-vendor`, { method: 'PATCH', body: JSON.stringify({ vendorId }) }),
  updateStatus: (orderId: string, status: OrderStatus) => request<Order>(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};
