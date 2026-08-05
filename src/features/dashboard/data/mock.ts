import type {
  ChartPoint,
  Comment,
  CustomerAvatar,
  OverviewStat,
  Product,
} from "@/features/dashboard/types";

export const overviewStats: { customers: OverviewStat; balance: OverviewStat } = {
  customers: {
    label: "Customers",
    value: 1293,
    deltaPercent: 36.8,
    direction: "up",
  },
  balance: {
    label: "Balance",
    value: 256000,
    deltaPercent: 36.8,
    direction: "up",
  },
};

export const newCustomersToday = 857;

export const recentCustomerAvatars: CustomerAvatar[] = [
  { name: "Gladyce Rodriguez" },
  { name: "Elbert Chen" },
  { name: "Dash Patel" },
  { name: "Joyce Kim" },
  { name: "Marina Silva" },
];

export const productViewSeries: ChartPoint[] = [
  { label: "Mon", value: 6.1 },
  { label: "Tue", value: 7.4 },
  { label: "Wed", value: 5.8 },
  { label: "Thu", value: 2.2 },
  { label: "Fri", value: 8.9 },
  { label: "Sat", value: 6.7 },
  { label: "Sun", value: 5.3 },
];

export const productViewTotal = 10_200_000;
export const productViewHighlightIndex = 3;

export const popularProducts: Product[] = [
  { id: "1", name: "Crypter - NFT UI Kit", price: 3250, status: "Active" },
  { id: "2", name: "Bento Pro 2.0 Illustrations", price: 7890, status: "Active" },
  { id: "3", name: "Fleet - travel shopping kit", price: 1500, status: "Offline" },
  { id: "4", name: "SimpleSocial UI Design Kit", price: 9999.99, status: "Active" },
  { id: "5", name: "Bento Pro vol. 2", price: 4750, status: "Active" },
];

export const comments: Comment[] = [
  {
    id: "1",
    author: "Joyce",
    product: "Bento Pro 2.0",
    timestamp: "09:00 AM",
    text: "Great work! When HTML version will be available?",
  },
  {
    id: "2",
    author: "Gladyce",
    product: "Food Delivery App",
    timestamp: "08:14 AM",
    text: "Love the color palette on this one, super clean.",
  },
];
