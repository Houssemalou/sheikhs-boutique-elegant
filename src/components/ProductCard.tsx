import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useShop } from '@/contexts/ShopContext';
import { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToCart, language, t } = useShop();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addToCart(product, 1, selectedColor);
    setIsLoading(false);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('currency')}`;
  };

  return (
    <Card 
      className="group cursor-pointer card-elegant overflow-hidden h-full flex flex-col"
      onClick={() => onProductClick?.(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.originalPrice && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {t('out-of-stock')}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add to Cart */}
        {product.inStock && (
          <Button
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? '...' : t('add-to-cart')}
          </Button>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
            {product.name[language]}
          </h3>
          
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
            {product.description[language]}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mb-3">
              {product.colors.slice(0, 4).map((color, index) => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-primary scale-110'
                      : 'border-muted-foreground/30'
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase().includes('noir') || color.toLowerCase().includes('black')
                      ? '#000000'
                      : color.toLowerCase().includes('blanc') || color.toLowerCase().includes('white')
                      ? '#ffffff'
                      : color.toLowerCase().includes('bleu') || color.toLowerCase().includes('blue')
                      ? '#3b82f6'
                      : color.toLowerCase().includes('rouge') || color.toLowerCase().includes('red')
                      ? '#ef4444'
                      : color.toLowerCase().includes('or') || color.toLowerCase().includes('gold')
                      ? '#f59e0b'
                      : color.toLowerCase().includes('vert') || color.toLowerCase().includes('green')
                      ? '#10b981'
                      : color.toLowerCase().includes('violet') || color.toLowerCase().includes('purple')
                      ? '#8b5cf6'
                      : '#6b7280'
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="font-bold text-sm">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="text-right">
            <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
              {product.inStock ? t('in-stock') : t('out-of-stock')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}