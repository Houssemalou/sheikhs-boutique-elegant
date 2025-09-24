import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useShop } from "@/contexts/ShopContext";
import { ProductDTO } from "@/models/types";
import { useState } from "react";

interface ProductDetailsModalProps {
  product: ProductDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart, t } = useShop();
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    addToCart(product, 1);
    setIsLoading(false);
  };

  const isPromo = product.discount !== 0;
  const isOutOfStock = product.stock === 0;
  const discountPercentage = isPromo 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative">
            <img
              src={product.photoPath}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            
            {/* Badges sur l'image */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isPromo && (
                <Badge className="bg-blue-600/90 text-white text-sm px-2 py-1">
                  -{discountPercentage}%
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-gray-600/90 text-white text-sm px-2 py-1">
                  {t("out-of-stock")}
                </Badge>
              )}
              {product.promo === true && (
                <Badge className="bg-green-600/90 text-white text-sm px-2 py-1">
                  Promo spéciale
                </Badge>
              )}
            </div>
          </div>

          {/* Détails */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              {product.category && (
                <p className="text-muted-foreground mb-3">Catégorie: {product.category}</p>
              )}
            </div>

            {/* Prix */}
            <div className="border-t border-b py-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString()} {t("currency")}
                </span>
                {isPromo && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString()} {t("currency")}
                  </span>
                )}
              </div>
              {isPromo && (
                <p className="text-sm text-green-600 mt-1">
                  Vous économisez {(product.originalPrice - product.price).toLocaleString()} {t("currency")}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock */}
            <div>
              <h3 className="font-semibold mb-1">Disponibilité</h3>
              <p className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'Rupture de stock' : `En stock (${product.stock} disponible${product.stock > 1 ? 's' : ''})`}
              </p>
            </div>

            {/* Promotions spéciales */}
            {product.promo === true && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h3 className="font-semibold text-green-800 mb-2">Offres spéciales</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• اشترِي 2 واحصل على 1 مجانًا</li>
                  <li>• اشترِي 4 واحصل على 2 مجانًا</li>
                </ul>
              </div>
            )}

            {/* Bouton d'ajout au panier */}
            <div className="mt-auto pt-4">
              {!isOutOfStock ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isLoading ? "Ajout en cours..." : t("add-to-cart")}
                </Button>
              ) : (
                <Button disabled className="w-full" size="lg">
                  Produit indisponible
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}