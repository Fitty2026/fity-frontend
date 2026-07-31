import { useQuery } from '@tanstack/react-query';

import { getProduct, getRecommendedProducts } from '../api/commerceApi';

export const commerceKeys = {
  all: ['commerce'] as const,
  recommendations: () => [...commerceKeys.all, 'recommendations'] as const,
  product: (productId: string) => [...commerceKeys.all, 'product', productId] as const,
};

export const useRecommendedProducts = () =>
  useQuery({
    queryKey: commerceKeys.recommendations(),
    queryFn: getRecommendedProducts,
  });

export const useCommerceProduct = (productId: string | undefined) =>
  useQuery({
    queryKey: commerceKeys.product(productId ?? ''),
    queryFn: () => getProduct(productId as string),
    enabled: Boolean(productId),
  });
