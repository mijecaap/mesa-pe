"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPublic } from "@/lib/public-api";

export interface PublicBusiness {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  whatsappNumber: string;
  address: string | null;
  googleMapsUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  currency: string;
  isPublished: boolean;
  manualStatus: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
  isOpenNow: boolean;
  openingHours: {
    id: string;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  categories: {
    id: string;
    name: string;
    description: string | null;
    sortOrder: number;
    items: {
      id: string;
      name: string;
      description: string | null;
      basePrice: string;
      imageUrl: string | null;
      isVisible: boolean;
      isAvailable: boolean;
      tags: string[];
      sortOrder: number;
      modifiers: {
        id: string;
        name: string;
        isRequired: boolean;
        selectionType: string;
        options: {
          id: string;
          name: string;
          priceDelta: string;
          isAvailable: boolean;
        }[];
      }[];
    }[];
  }[];
  paymentMethods: {
    id: string;
    type: string;
    name: string;
    details: string | null;
    qrImageUrl: string | null;
  }[];
  zones: {
    id: string;
    name: string;
    deliveryFee: string;
    minimumOrderAmount: string | null;
    estimatedMinutes: number | null;
  }[];
  promotions: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    ctaUrl: string | null;
    buttonText: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];
}

export function usePublicBusiness(slug: string) {
  return useQuery<PublicBusiness | null>({
    queryKey: ["public-business", slug],
    queryFn: () => fetchPublic(`/businesses/public/${slug}`),
    staleTime: 1000 * 60 * 2,
  });
}
