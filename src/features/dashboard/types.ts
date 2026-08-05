export interface OverviewStat {
  label: string;
  value: number;
  deltaPercent: number;
  direction: "up" | "down";
}

export interface CustomerAvatar {
  name: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  status: "Active" | "Offline";
}

export interface Comment {
  id: string;
  author: string;
  product: string;
  timestamp: string;
  text: string;
}
