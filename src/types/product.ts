export interface Product {
  id: string;
  name: string;
  reference: string;
  description: string;
  category: string;
  quantity: number;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export type StockStatus = 'ok' | 'low' | 'out';

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export function getStockStatus(product: Pick<Product, 'quantity' | 'alertThreshold'>): StockStatus {
  if (product.quantity <= 0) return 'out';
  if (product.quantity <= product.alertThreshold) return 'low';
  return 'ok';
}
