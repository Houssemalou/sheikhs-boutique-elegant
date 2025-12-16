import { ShoppingCart, X, Star, Package, Truck, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useShop } from "@/contexts/ShopContext";
import { ProductDTO } from "@/models/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDetailsModalProps {
  product: ProductDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useShop();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  // Créer un tableau d'images avec photoPath comme première image
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.photoPath];

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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Section Image avec Carousel */}
          <div className="bg-gray-50 p-6 flex flex-col">
            {/* Image principale */}
            <div className="relative group mb-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Badges sur l'image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {isPromo && (
                  <Badge className="bg-red-600/95 text-white text-sm px-3 py-1 shadow-lg backdrop-blur-sm">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
                {product.promo === true && (
                  <Badge className="bg-green-600/95 text-white text-sm px-3 py-1 shadow-lg backdrop-blur-sm animate-pulse">
                    🎁 Promo Spéciale
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge className="bg-gray-800/95 text-white text-sm px-3 py-1 shadow-lg backdrop-blur-sm">
                    {t("out-of-stock")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Miniatures des images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index 
                        ? 'border-primary shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Informations de confiance */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-xs font-medium">Livraison rapide</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-green-600 mb-1" />
                <span className="text-xs font-medium">Paiement sécurisé</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <Package className="h-6 w-6 text-purple-600 mb-1" />
                <span className="text-xs font-medium">Garantie qualité</span>
              </div>
            </div>
          </div>

          {/* Section Détails */}
          <div className="flex flex-col p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-3xl font-bold leading-tight pr-8">
                {product.name}
              </DialogTitle>
              {product.category && (
                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide">
                  {product.category}
                </p>
              )}
            </DialogHeader>

            {/* Note et avis (optionnel) */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8 / 5)</span>
            </div>

            {/* Prix */}
            <div className="border-y py-6 mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} {t("currency")}
                </span>
                {isPromo && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString()} {t("currency")}
                  </span>
                )}
              </div>
              {isPromo && (
                <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                  Vous économisez {(product.originalPrice - product.price).toLocaleString()} {t("currency")}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Disponibilité</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <p className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                  {isOutOfStock 
                    ? 'Rupture de stock' 
                    : `${product.stock} unité${product.stock > 1 ? 's' : ''} en stock`
                  }
                </p>
              </div>
            </div>

            {/* Promotions spéciales */}
            {product.promo === true && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  Offres exclusives
                </h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>اشترِي 2 واحصل على 1 مجانًا</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>اشترِي 4 واحصل على 2 مجانًا</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Bouton d'ajout au panier */}
            <div className="mt-auto pt-4">
              {!isOutOfStock ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isLoading ? "Ajout en cours..." : t("add-to-cart")}
                </Button>
              ) : (
                <Button disabled className="w-full py-6" size="lg">
                  <X className="h-5 w-5 mr-2" />
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