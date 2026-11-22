export type Role = "customer" | "technician" | "admin";
export type Plan = "free" | "pro";
export type PaymentKind = "booking" | "pro_subscription";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  phone: string;
  area: string;
  bio: string;
  plan: Plan;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  technicianPlan: Plan;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
  statusHistory: Array<{ status: string; changedAt: string }>;
  rating?: number;
  review?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  kind: PaymentKind;
  plan?: Plan;
  paymentStatus: "paid";
  paidAt: string;
}

export interface ServiceListResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
