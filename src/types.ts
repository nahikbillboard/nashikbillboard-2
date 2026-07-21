export type BillboardAvailability = 'Available' | 'Booked' | 'Fast Filling' | 'Under Maintenance';
export type BillboardType = 'Digital LED' | 'Classic Hoarding' | 'Unipole' | 'Gantry' | 'Bus Shelter';

export interface Billboard {
  id: string;
  name: string;
  agency: string;
  location: string;
  area: string; // e.g., CIDCO, College Road, Gangapur Road, Panchavati, Dwarka, Nashik Road
  rating: number;
  ratingsCount: number;
  yearsInBusiness: number;
  category: string[];
  images: string[];
  size: string;
  type: BillboardType;
  pricePerMonth: number;
  pricePerWeek: number;
  viewsPerDay: number;
  availability: BillboardAvailability;
  availableFrom: string;
  latitude: number; // 0 to 100 (relative coordinate for interactive custom map)
  longitude: number; // 0 to 100
  lighting: 'Lit (Front-lit)' | 'Lit (Back-lit)' | 'Non-Lit' | 'LED Digital Display';
  phone: string;
  whatsapp: string;
  claimed: boolean;
  isTopSearch: boolean;
  verified?: boolean;
  googleMapLink?: string;
  description: string;
}

export interface Booking {
  id: string;
  billboardId: string;
  billboardName: string;
  billboardImage: string;
  agencyName: string;
  advertiserName: string;
  advertiserPhone: string;
  advertiserEmail: string;
  startDate: string;
  endDate: string;
  creativeText?: string;
  creativeUrl?: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed';
  createdAt: string;
  paymentStatus: 'Paid' | 'Unpaid';
}

export interface Inquiry {
  id: string;
  billboardId: string;
  billboardName: string;
  agencyName: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}
