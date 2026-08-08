import { Product, ProductInput } from '../types/product';
import { generateId } from '../utils/id';

export function createProduct(input: ProductInput): Product {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyProductChanges(product: Product, changes: ProductInput): Product {
  return {
    ...product,
    ...changes,
    updatedAt: new Date().toISOString(),
  };
}

export function applyStockDelta(product: Product, delta: number): Product {
  return {
    ...product,
    quantity: Math.max(0, product.quantity + delta),
    updatedAt: new Date().toISOString(),
  };
}

export function isReferenceTaken(products: Product[], reference: string, excludeId?: string): boolean {
  const normalized = reference.trim().toLowerCase();
  return products.some((p) => p.id !== excludeId && p.reference.trim().toLowerCase() === normalized);
}
