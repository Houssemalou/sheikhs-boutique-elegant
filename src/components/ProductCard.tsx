import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useShop } from "@/contexts/ShopContext";
import { ProductDTO } from "@/models/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: ProductDTO;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShop();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    addToCart(product, 1);
    setIsLoading(false);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const isPromo = product.discount !== 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden h-full flex flex-col max-w-[220px]"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : product.photoPath}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPromo && (
        <Badge className="bg-blue-600/90 text-white text-[10px] px-1.5 py-0">
          -{Math.round(
            ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
          )}
          %
        </Badge>
          )}
          {isOutOfStock && (
        <Badge className="bg-gray-600/90 text-white text-[10px] px-1.5 py-0">
          {t("product.out_of_stock")}
        </Badge>
          )}
        </div>

        {/* Actions (Wishlist only) */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to cart */}
        {!isOutOfStock && (
          <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-2 left-2 right-2 h-8 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleAddToCart}
        disabled={isLoading}
          >
        <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
        <span className="text-xs">
          {isLoading ? "..." : t("product.add_to_cart")}
        </span>
          </Button>
        )}
      </div>

      <CardContent className="p-3 flex-1 flex flex-col gap-1.5">
        {/* Infos */}
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">
              {product.price.toLocaleString()} {t("common.currency")}
            </span>
            {isPromo && (
              <span className="text-xs text-muted-foreground/80 line-through -mt-0.5">
                {product.originalPrice.toLocaleString()} {t("common.currency")}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
