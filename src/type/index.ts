export enum CUSTOMER {
  MICROSOFT = "Microsoft",
  FACEBOOK = "Facebook",
  GOOGLE = "Google",
  AMAZON = "Amazon",
}

export enum SIZE {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface OrderItem {
  size: "small" | "medium" | "large";
  quantity: number;
  price: number;
  total?: number;
}

export interface Order {
  customer: string;
  orderItems: OrderItem[];
}

export interface Discount {
  type?: string;
  x?: number;
  y?: number;
  size?: string;
  price?: number;
}

export interface DiscountSettings {
  customer: string;
  discount: Discount;
}
