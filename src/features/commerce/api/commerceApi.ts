import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

interface ProductRaw {
  product_id?: number;
  productId?: number;
  id?: number;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  recommendation?: string;
  image_url?: string;
  imageUrl?: string;
  style_tags?: string[];
  styleTags?: string[];
  rating: number;
  price: number;
  discount_rate?: number;
  discountRate?: number;
  sale_price?: number;
  salePrice?: number;
  details?: string[];
  purchase_url?: string;
  purchaseUrl?: string;
}

interface ProductListRaw {
  products: ProductRaw[];
  total: number;
}

export interface CommerceProduct {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  recommendation: string;
  imageUrl: string;
  styleTags: string[];
  rating: number;
  price: number;
  discountRate: number;
  salePrice: number;
  details: string[];
  purchaseUrl?: string;
}

export interface CommerceProductList {
  products: CommerceProduct[];
  total: number;
}

const toProduct = (product: ProductRaw): CommerceProduct => ({
  id: String(product.product_id ?? product.productId ?? product.id ?? ''),
  category: product.category,
  subcategory: product.subcategory,
  name: product.name,
  description: product.description,
  recommendation: product.recommendation ?? '',
  imageUrl: product.image_url ?? product.imageUrl ?? '',
  styleTags: product.style_tags ?? product.styleTags ?? [],
  rating: product.rating,
  price: Number(product.price),
  discountRate: product.discount_rate ?? product.discountRate ?? 0,
  salePrice: product.sale_price ?? product.salePrice ?? Number(product.price),
  details: product.details ?? [],
  purchaseUrl: product.purchase_url ?? product.purchaseUrl,
});

export const getRecommendedProducts = async (): Promise<CommerceProductList> => {
  const { data } = await api.get<ApiResponse<ProductListRaw>>(
    '/api/v1/products/recommendations',
  );
  return {
    products: data.result.products.map(toProduct),
    total: data.result.total,
  };
};

export const getProduct = async (productId: string): Promise<CommerceProduct> => {
  const { data } = await api.get<ApiResponse<ProductRaw>>(`/api/v1/products/${productId}`);
  return toProduct(data.result);
};
