import { Star, ShoppingCart, Heart, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
      className="group cursor-pointer overflow-hidden h-full flex flex-col max-w-[220px]"
      onClick={() => onProductClick?.(product)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.originalPrice && (
            <Badge className="bg-blue-600/90 text-white text-[10px] px-1.5 py-0">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-muted/90 text-muted-foreground text-[10px] px-1.5 py-0">
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
            variant="secondary"
            size="sm"
            className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 h-8 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">{isLoading ? '...' : t('add-to-cart')}</span>
          </Button>
        )}
      </div>

      <CardContent className="p-3 flex-1 flex flex-col gap-1.5">
        {/* Product Info */}
        <h3 className="font-medium text-sm line-clamp-1">
          {product.name[language]}
        </h3>
        
        <div className="relative">
          <p className={`text-muted-foreground text-xs transition-all duration-300 ${isExpanded ? '' : 'line-clamp-1'}`}>
            {product.description[language]}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] h-4 p-0 text-blue-600 hover:text-blue-700 hover:bg-transparent w-full flex items-center justify-center mt-0.5"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <><ChevronUp className="h-3 w-3" /> {t('show-less')}</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> {t('show-more')}</>
            )}
          </Button>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground/80 line-through -mt-0.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {!product.inStock && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted/90">
              {t('out-of-stock')}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}