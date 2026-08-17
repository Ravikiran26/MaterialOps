import express from 'express';
import cors from 'cors';
import { customers, orderValue, orders, products, vendors, type OrderStatus } from './data.js';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'materialops-api' });
});

app.get('/api/dashboard', (_req, res) => {
  const totalValue = orders.reduce((sum, order) => sum + orderValue(order), 0);
  const stats = {
    totalOrders: orders.length,
    newOrders: orders.filter(o => o.status === 'NEW' || o.status === 'CONFIRMED').length,
    activeFulfilments: orders.filter(o => ['VENDOR_ASSIGNED', 'PROCESSING', 'DISPATCHED'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    totalValue,
    activeVendors: vendors.filter(v => v.active).length,
    customers: customers.length
  };

  const statusCounts = ['NEW', 'CONFIRMED', 'VENDOR_ASSIGNED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'].map(status => ({
    status,
    count: orders.filter(o => o.status === status).length
  }));

  res.json({ stats, statusCounts, recentOrders: orders.slice(0, 5).map(o => ({ ...o, value: orderValue(o) })) });
});

app.get('/api/orders', (req, res) => {
  const search = String(req.query.search || '').toLowerCase();
  const status = String(req.query.status || 'ALL');
  const filtered = orders.filter(order => {
    const matchesSearch = !search || [order.id, order.customerName, order.deliveryLocation, order.assignedVendorName || ''].join(' ').toLowerCase().includes(search);
    const matchesStatus = status === 'ALL' || order.status === status;
    return matchesSearch && matchesStatus;
  });
  res.json(filtered.map(o => ({ ...o, value: orderValue(o) })));
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ ...order, value: orderValue(order) });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const allowed: OrderStatus[] = ['NEW', 'CONFIRMED', 'VENDOR_ASSIGNED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
  const order = orders.find(o => o.id === req.params.id);
  const status = req.body.status as OrderStatus;
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  order.status = status;
  res.json({ ...order, value: orderValue(order) });
});

app.patch('/api/orders/:id/assign-vendor', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  const vendor = vendors.find(v => v.id === req.body.vendorId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  order.assignedVendorId = vendor.id;
  order.assignedVendorName = vendor.name;
  order.status = 'VENDOR_ASSIGNED';
  res.json({ ...order, value: orderValue(order) });
});

app.get('/api/vendors', (_req, res) => res.json(vendors));
app.get('/api/customers', (_req, res) => res.json(customers));
app.get('/api/products', (_req, res) => res.json(products));

app.get('/api/reports', (_req, res) => {
  const byVendor = vendors.map(vendor => {
    const vendorOrders = orders.filter(order => order.assignedVendorId === vendor.id);
    return {
      vendorId: vendor.id,
      vendorName: vendor.name,
      orders: vendorOrders.length,
      value: vendorOrders.reduce((sum, order) => sum + orderValue(order), 0),
      delivered: vendorOrders.filter(o => o.status === 'DELIVERED').length
    };
  }).filter(v => v.orders > 0);

  res.json({
    totalOrderValue: orders.reduce((sum, order) => sum + orderValue(order), 0),
    deliveredValue: orders.filter(o => o.status === 'DELIVERED').reduce((sum, order) => sum + orderValue(order), 0),
    byVendor
  });
});

app.listen(port, () => {
  console.log(`MaterialOps API running on http://localhost:${port}`);
});
