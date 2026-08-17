export type OrderStatus = 'NEW' | 'CONFIRMED' | 'VENDOR_ASSIGNED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export type Vendor = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  gst: string;
  city: string;
  serviceAreas: string[];
  categories: string[];
  rating: number;
  active: boolean;
};

export type Customer = {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gst: string;
  city: string;
  totalOrders: number;
  totalValue: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  indicativePrice: number;
  activeVendors: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedRate: number;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  deliveryLocation: string;
  city: string;
  requiredDate: string;
  createdAt: string;
  status: OrderStatus;
  assignedVendorId?: string;
  assignedVendorName?: string;
  assignedExecutive: string;
  notes?: string;
  items: OrderItem[];
};

export const vendors: Vendor[] = [
  // ── Gachibowli cluster (4 vendors) ──
  { id: 'VND-001', name: 'Sri Balaji Building Materials', contactPerson: 'Suresh Reddy',    phone: '+91 98490 11223', gst: '36ABCDE1234F1Z5', city: 'Hyderabad',    serviceAreas: ['Gachibowli', 'Kondapur', 'Madhapur'],          categories: ['Cement', 'Steel', 'Sand'],              rating: 4.7, active: true  },
  { id: 'VND-002', name: 'Metro Steel & Cement Traders',  contactPerson: 'Naveen Kumar',    phone: '+91 99887 44556', gst: '36PQRSX5678K1Z2', city: 'Hyderabad',    serviceAreas: ['Gachibowli', 'Hitech City', 'Kukatpally'],     categories: ['Cement', 'Steel'],                      rating: 4.5, active: true  },
  { id: 'VND-006', name: 'Apex Construction Supplies',    contactPerson: 'Ravi Shankar',    phone: '+91 98765 33210', gst: '36APXCS6789R1Z3', city: 'Hyderabad',    serviceAreas: ['Gachibowli', 'Raidurgam', 'Nanakramguda'],     categories: ['Cement', 'Aggregates', 'Bricks'],       rating: 4.4, active: true  },
  { id: 'VND-007', name: 'Vertex Cement & Steel Depot',   contactPerson: 'Anil Reddy',      phone: '+91 90000 55678', gst: '36VTXCS7890A1Z6', city: 'Hyderabad',    serviceAreas: ['Gachibowli', 'Jubilee Hills', 'Banjara Hills'], categories: ['Cement', 'Steel', 'Hardware'],           rating: 4.2, active: true  },

  // ── Secunderabad cluster (3 vendors) ──
  { id: 'VND-008', name: 'Srinivasa Building Suppliers',  contactPerson: 'Murali Krishna',  phone: '+91 98480 77001', gst: '36SRBLD8901S1Z7', city: 'Secunderabad', serviceAreas: ['Secunderabad', 'Trimulgherry', 'Malkajgiri'],   categories: ['Cement', 'Steel', 'Sand', 'Aggregates'], rating: 4.6, active: true  },
  { id: 'VND-009', name: 'North Star Aggregates',         contactPerson: 'Prasad Rao',      phone: '+91 97001 44332', gst: '36NSTAR9012P1Z8', city: 'Secunderabad', serviceAreas: ['Secunderabad', 'Bolaram', 'Alwal'],            categories: ['Sand', 'Aggregates', 'Bricks'],          rating: 4.3, active: true  },
  { id: 'VND-010', name: 'Patel Brothers Hardware',       contactPerson: 'Deepak Patel',    phone: '+91 99660 22113', gst: '36PTLBR1023D1Z9', city: 'Secunderabad', serviceAreas: ['Secunderabad', 'Marredpally', 'Begumpet'],     categories: ['Hardware', 'Electrical', 'Plumbing'],    rating: 4.1, active: true  },

  // ── Other areas ──
  { id: 'VND-003', name: 'Deccan Aggregates Supply',      contactPerson: 'Arif Khan',       phone: '+91 97011 22334', gst: '36LMNOP3344G1Z8', city: 'Hyderabad',    serviceAreas: ['Financial District', 'Nanakramguda', 'Kokapet'], categories: ['Sand', 'Aggregates', 'Bricks'],          rating: 4.6, active: true  },
  { id: 'VND-004', name: 'Sai Ganesh Hardware & Electricals', contactPerson: 'Ganesh Rao', phone: '+91 98661 77889', gst: '36UVWXY9988J1Z9', city: 'Hyderabad',    serviceAreas: ['Manikonda', 'Puppalaguda', 'Narsingi'],        categories: ['Electrical', 'Plumbing', 'Hardware'],   rating: 4.3, active: true  },
  { id: 'VND-005', name: 'Prime Blocks & Bricks',         contactPerson: 'Kiran Yadav',     phone: '+91 90001 66778', gst: '36HJKKL7788M1Z4', city: 'Hyderabad',    serviceAreas: ['Shamshabad', 'Rajendranagar', 'Attapur'],      categories: ['Bricks', 'Blocks'],                     rating: 4.4, active: false },
];

export const customers: Customer[] = [
  { id: 'CUS-001', companyName: 'ABC Constructions Pvt Ltd', contactPerson: 'Raghav Varma', phone: '+91 98480 10001', email: 'procurement@abcconstructions.in', gst: '36AAECA1111A1Z6', city: 'Hyderabad', totalOrders: 18, totalValue: 1845000 },
  { id: 'CUS-002', companyName: 'UrbanNest Developers', contactPerson: 'Meghana Rao', phone: '+91 98480 10002', email: 'meghana@urbannest.in', gst: '36AAFCU2222B1Z7', city: 'Hyderabad', totalOrders: 11, totalValue: 1218000 },
  { id: 'CUS-003', companyName: 'Vistara Infra Projects', contactPerson: 'Praveen Reddy', phone: '+91 98480 10003', email: 'purchase@vistarainfra.in', gst: '36AAGCV3333C1Z8', city: 'Hyderabad', totalOrders: 27, totalValue: 2896000 },
  { id: 'CUS-004', companyName: 'GreenSquare Contractors', contactPerson: 'Nikhil Jain', phone: '+91 98480 10004', email: 'nikhil@greensquare.in', gst: '36AAHCG4444D1Z9', city: 'Hyderabad', totalOrders: 9, totalValue: 876000 }
];

export const products: Product[] = [
  { id: 'PRD-001', name: 'OPC 53 Grade Cement', category: 'Cement', unit: 'Bag', indicativePrice: 390, activeVendors: 4 },
  { id: 'PRD-002', name: 'TMT Fe 550 Steel', category: 'Steel', unit: 'Kg', indicativePrice: 63, activeVendors: 3 },
  { id: 'PRD-003', name: 'River Sand', category: 'Sand', unit: 'Ton', indicativePrice: 1800, activeVendors: 3 },
  { id: 'PRD-004', name: '20mm Aggregate', category: 'Aggregates', unit: 'Ton', indicativePrice: 1450, activeVendors: 2 },
  { id: 'PRD-005', name: 'Red Clay Bricks', category: 'Bricks', unit: 'Piece', indicativePrice: 9, activeVendors: 2 },
  { id: 'PRD-006', name: 'AAC Blocks 6 inch', category: 'Blocks', unit: 'Piece', indicativePrice: 72, activeVendors: 2 },
  { id: 'PRD-007', name: 'PVC Pipe 1 inch', category: 'Plumbing', unit: 'Length', indicativePrice: 440, activeVendors: 2 },
  { id: 'PRD-008', name: 'Copper Wire 2.5 sq mm', category: 'Electrical', unit: 'Coil', indicativePrice: 2450, activeVendors: 2 }
];

export let orders: Order[] = [
  {
    id: 'ORD-1021', customerId: 'CUS-001', customerName: 'ABC Constructions Pvt Ltd', contactPerson: 'Raghav Varma', phone: '+91 98480 10001', deliveryLocation: 'Gachibowli Site 3, Hyderabad', city: 'Hyderabad', requiredDate: '2026-08-18', createdAt: '2026-08-17T07:40:00+05:30', status: 'NEW', assignedExecutive: 'Ramesh', notes: 'Customer requested delivery before 2 PM.',
    items: [
      { productId: 'PRD-001', name: 'OPC 53 Grade Cement', quantity: 100, unit: 'Bags', estimatedRate: 390 },
      { productId: 'PRD-002', name: 'TMT Fe 550 Steel', quantity: 500, unit: 'Kg', estimatedRate: 63 },
      { productId: 'PRD-003', name: 'River Sand', quantity: 2, unit: 'Tons', estimatedRate: 1800 }
    ]
  },
  {
    id: 'ORD-1020', customerId: 'CUS-003', customerName: 'Vistara Infra Projects', contactPerson: 'Praveen Reddy', phone: '+91 98480 10003', deliveryLocation: 'Financial District Tower B, Hyderabad', city: 'Hyderabad', requiredDate: '2026-08-18', createdAt: '2026-08-17T06:55:00+05:30', status: 'VENDOR_ASSIGNED', assignedVendorId: 'VND-003', assignedVendorName: 'Deccan Aggregates Supply', assignedExecutive: 'Anusha',
    items: [
      { productId: 'PRD-004', name: '20mm Aggregate', quantity: 8, unit: 'Tons', estimatedRate: 1450 },
      { productId: 'PRD-005', name: 'Red Clay Bricks', quantity: 5000, unit: 'Pieces', estimatedRate: 9 }
    ]
  },
  {
    id: 'ORD-1019', customerId: 'CUS-002', customerName: 'UrbanNest Developers', contactPerson: 'Meghana Rao', phone: '+91 98480 10002', deliveryLocation: 'Kokapet Phase 2, Hyderabad', city: 'Hyderabad', requiredDate: '2026-08-17', createdAt: '2026-08-16T17:15:00+05:30', status: 'PROCESSING', assignedVendorId: 'VND-001', assignedVendorName: 'Sri Balaji Building Materials', assignedExecutive: 'Ramesh',
    items: [
      { productId: 'PRD-001', name: 'OPC 53 Grade Cement', quantity: 250, unit: 'Bags', estimatedRate: 390 },
      { productId: 'PRD-002', name: 'TMT Fe 550 Steel', quantity: 1250, unit: 'Kg', estimatedRate: 63 }
    ]
  },
  {
    id: 'ORD-1018', customerId: 'CUS-004', customerName: 'GreenSquare Contractors', contactPerson: 'Nikhil Jain', phone: '+91 98480 10004', deliveryLocation: 'Manikonda Villa Site, Hyderabad', city: 'Hyderabad', requiredDate: '2026-08-17', createdAt: '2026-08-16T13:20:00+05:30', status: 'DISPATCHED', assignedVendorId: 'VND-004', assignedVendorName: 'Sai Ganesh Hardware & Electricals', assignedExecutive: 'Kavya',
    items: [
      { productId: 'PRD-007', name: 'PVC Pipe 1 inch', quantity: 70, unit: 'Lengths', estimatedRate: 440 },
      { productId: 'PRD-008', name: 'Copper Wire 2.5 sq mm', quantity: 12, unit: 'Coils', estimatedRate: 2450 }
    ]
  },
  {
    id: 'ORD-1017', customerId: 'CUS-001', customerName: 'ABC Constructions Pvt Ltd', contactPerson: 'Raghav Varma', phone: '+91 98480 10001', deliveryLocation: 'Kondapur Commercial Site, Hyderabad', city: 'Hyderabad', requiredDate: '2026-08-16', createdAt: '2026-08-15T15:05:00+05:30', status: 'DELIVERED', assignedVendorId: 'VND-002', assignedVendorName: 'Metro Steel & Cement Traders', assignedExecutive: 'Anusha',
    items: [
      { productId: 'PRD-001', name: 'OPC 53 Grade Cement', quantity: 180, unit: 'Bags', estimatedRate: 388 }
    ]
  },
  {
    id: 'ORD-1016', customerId: 'CUS-003', customerName: 'Vistara Infra Projects', contactPerson: 'Praveen Reddy', phone: '+91 98480 10003', deliveryLocation: 'Nanakramguda Site Office, Hyderabad', city: 'Hyderabad', requiredDate: '2026-08-18', createdAt: '2026-08-17T05:40:00+05:30', status: 'CONFIRMED', assignedExecutive: 'Kavya',
    items: [
      { productId: 'PRD-006', name: 'AAC Blocks 6 inch', quantity: 950, unit: 'Pieces', estimatedRate: 72 }
    ]
  }
];

export function orderValue(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity * item.estimatedRate, 0);
}
