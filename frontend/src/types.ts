export type OrderStatus = 'NEW' | 'CONFIRMED' | 'VENDOR_ASSIGNED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem { productId: string; name: string; quantity: number; unit: string; estimatedRate: number; }
export interface Order {
  id: string; customerId: string; customerName: string; contactPerson: string; phone: string;
  deliveryLocation: string; city: string; requiredDate: string; createdAt: string; status: OrderStatus;
  assignedVendorId?: string; assignedVendorName?: string; assignedExecutive: string; notes?: string;
  items: OrderItem[]; value: number;
}
export interface Vendor { id: string; name: string; contactPerson: string; phone: string; gst: string; city: string; serviceAreas: string[]; categories: string[]; rating: number; active: boolean; }
export interface Customer { id: string; companyName: string; contactPerson: string; phone: string; email: string; gst: string; city: string; totalOrders: number; totalValue: number; }
export interface Product { id: string; name: string; category: string; unit: string; indicativePrice: number; activeVendors: number; }
