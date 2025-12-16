import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useShop } from '@/contexts/ShopContext';
import { getCategories } from '@/services/productsService';
import { CategoryResDTO, ProductDTO } from '@/models/types';
import { OrderForm } from '@/components/OrderForm';
import { ProductCard } from '@/components/ProductCard';
import { toast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart, setCartOpen } = useShop();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Récupérer le produit
  const { data: categories, isLoading } = useQuery<CategoryResDTO[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const product = categories
    ?.flatMap((cat) => cat.products)
    .find((p) => p.id === Number(id));

  // Récupérer les produits similaires (même catégorie)
  const similarProducts = categories
    ?.flatMap((cat) => cat.products)
    .filter(
      (p) =>
        p.category === product?.category &&
        p.id !== product?.id
    )
    .slice(0, 8) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('product.back_to_products')}
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isPromo = product.discount !== 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    try {
      setIsAddingToCart(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      addToCart(product, quantity, selectedColor);
      toast({
        title: '✓ ' + t('cart.title'),
        description: `${product.name} ${t('product.add_to_cart')}`,
      });
    } catch (error) {
      toast({
        title: '✗ ' + t('common.error'),
        description: t('common.error'),
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    try {
      setIsBuyingNow(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      addToCart(product, quantity, selectedColor);
      setCartOpen(true);
    } catch (error) {
      toast({
        title: '✗ ' + t('common.error'),
        description: t('common.error'),
        variant: 'destructive',
      });
    } finally {
      setIsBuyingNow(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('product.back_to_products')}
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Product Info */}
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-8">
              {/* Image Section */}
              <div className="relative">
                <Card className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={product.photoPath}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {isPromo && (
                        <Badge className="bg-blue-600 text-white">
                          -{Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          %
                        </Badge>
                      )}
                      {isOutOfStock && (
                        <Badge className="bg-gray-600 text-white">
                          {t('product.out_of_stock')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Info Section */}
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {product.name}
                  </h1>
                  {product.category && (
                    <p className="text-muted-foreground">{product.category}</p>
                  )}
                </div>

                <Separator />

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    {product.price.toFixed(2)} {t('common.currency')}
                  </span>
                  {isPromo && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)} {t('common.currency')}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div>
                  {isOutOfStock ? (
                    <Badge variant="destructive">{t('product.out_of_stock')}</Badge>
                  ) : (
                    <Badge variant="secondary">
                      {t('product.in_stock')} ({product.stock})
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('product.description')}</h3>
                    <div className="relative">
                      <p className={`text-muted-foreground leading-relaxed ${
                        !showFullDescription && product.description.length > 150 ? 'line-clamp-3' : ''
                      }`}>
                        {product.description}
                      </p>
                      {product.description.length > 150 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-primary text-sm font-medium hover:underline mt-2"
                        >
                          {showFullDescription ? t('product.read_less') : t('product.read_more')}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="space-y-2">
                    <Label>{t('product.quantity')}</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val > 0 && val <= product.stock) {
                              setQuantity(val);
                            }
                          }}
                          className="w-20 text-center border-0 focus-visible:ring-0"
                          min={1}
                          max={product.stock}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={incrementQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-muted-foreground">
                        Max: {product.stock}
                      </span>
                    </div>
                  </div>
                )}

                {/* Total */}
                {!isOutOfStock && (
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <span className="font-semibold">{t('product.total')}</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice.toFixed(2)} {t('common.currency')}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className="w-full"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAddingToCart ? t('common.loading') : t('product.add_to_cart')}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock || isBuyingNow}
                    className="w-full"
                  >
                    {isBuyingNow ? t('common.loading') : t('product.buy_now')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">{t('order.title')}</h2>
                <OrderForm
                  inline={true}
                  initialItems={[{ product, quantity, selectedColor }]}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {t('product.similar_products')}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {similarProducts.map((similarProduct) => (
                  <CarouselItem key={similarProduct.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <ProductCard product={similarProduct} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
}
