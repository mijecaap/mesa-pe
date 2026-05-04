"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "./hero-section";
import { PromotionBanner } from "./promotion-banner";
import { ProductList } from "./product-list";
import { BusinessInfo } from "./business-info";
import { PhotoGallery } from "./photo-gallery";
import { ClosedOverlay } from "./closed-overlay";
import { ProductModal } from "./product-modal";
import { CartButton } from "./cart-button";
import { CartSheet } from "./cart-sheet";
import { CheckoutModal } from "./checkout-modal";
import { useCartStore } from "@/stores/cart-store";
import { trackEvent } from "@/lib/analytics";
import type { PublicBusiness } from "@/hooks/use-public-business";

interface PublicPageClientProps {
  business: PublicBusiness;
}

export function PublicPageClient({ business }: PublicPageClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<
    PublicBusiness["categories"][0]["items"][0] | null
  >(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const setBusinessId = useCartStore((s) => s.setBusinessId);

  useEffect(() => {
    setBusinessId(business.id);
  }, [business.id, setBusinessId]);

  useEffect(() => {
    trackEvent("page_view", {
      business_id: business.id,
      business_name: business.name,
      page: `/${business.slug}`,
    });
  }, [business.id, business.name, business.slug]);

  const handleProductClick = (
    item: PublicBusiness["categories"][0]["items"][0]
  ) => {
    if (!business.isOpenNow || !item.isAvailable) return;
    setSelectedProduct(item);
    setProductModalOpen(true);
  };

  return (
    <>
      <HeroSection business={business} isOpenNow={business.isOpenNow} />
      <PromotionBanner promotions={business.promotions} />
      <ProductList 
        business={business} 
        onProductClick={handleProductClick}
        isOpenNow={business.isOpenNow}
      />
      <PhotoGallery business={business} />
      <BusinessInfo business={business} />
      <CartButton onClick={() => business.isOpenNow && setCartOpen(true)} disabled={!business.isOpenNow} />
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        currency={business.currency}
        onCheckout={() => {
          if (!business.isOpenNow) return;
          trackEvent("order_started", {
            business_id: business.id,
            business_name: business.name,
            item_count: useCartStore.getState().items.length,
          });
          setCheckoutOpen(true);
        }}
      />
      <ProductModal
        item={selectedProduct}
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        currency={business.currency}
        isOpenNow={business.isOpenNow}
      />
      <CheckoutModal
        business={business}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
      {business.plan === "FREE" && (
        <div className="border-t bg-[#FFF8F0] py-4 text-center">
          <p className="text-xs text-[#8D817C]">
            Carta digital creada con{" "}
            <a
              href="https://mesa.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#f97316] hover:underline"
            >
              Mesa.pe
            </a>
          </p>
        </div>
      )}
      {!business.isOpenNow && (
        <ClosedOverlay 
          openingHours={business.openingHours} 
          businessName={business.name}
        />
      )}
    </>
  );
}
