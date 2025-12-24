import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart, setCartOpen } = useShop();

  // Déclarer tous les hooks en haut du composant
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Pour le carousel responsive
  const itemsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4
  };
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return itemsPerSlide.desktop;
    const width = window.innerWidth;
    if (width < 640) return itemsPerSlide.mobile;
    if (width < 768) return itemsPerSlide.tablet;
    if (width < 1024) return itemsPerSlide.desktop;
    return itemsPerSlide.large;
  };
  const [itemsToShow, setItemsToShow] = useState(getItemsPerSlide());

  // Récupérer les catégories et produits
  const { data: categories, isLoading } = useQuery<CategoryResDTO[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Calculer le produit et les produits similaires
  const product = categories
    ?.flatMap((cat) => cat.products)
    .find((p) => p.id === Number(id));

  const similarProducts = categories
    ?.flatMap((cat) => cat.products)
    .filter(
      (p) =>
        p.category === product?.category &&
        p.id !== product?.id
    )
    .slice(0, 8) || [];

  // Calculer le nombre de slides pour le carousel
  const totalSlides = Math.ceil(similarProducts.length / itemsToShow);

  // Effet pour le responsive du carousel
  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsPerSlide());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effet pour l'auto-slide du carousel
  useEffect(() => {
    if (similarProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalSlides, similarProducts.length]);

  // Les returns conditionnels doivent venir après tous les hooks
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
  
  // Préparer les images (images du tableau ou photoPath par défaut)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.photoPath];

  // Carousel automatique pour les produits similaires
  // ...existing code...

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentProducts = () => {
    const startIndex = currentSlide * itemsToShow;
    return similarProducts.slice(startIndex, startIndex + itemsToShow);
  };

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
                      src={productImages[selectedImageIndex]}
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
                
                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-gray-200 hover:border-primary/50'
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
                  
                  {/* Promo Card - Buy 3 Get 1 Free */}
                  {product.promo && (
                    <Card className="overflow-hidden border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 animate-in slide-in-from-bottom duration-700">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl animate-bounce">🎁</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-1">
                              {t('product.buy_3_get_1')}
                            </h3>
                            <p className="text-sm text-green-600 dark:text-green-500">
                              {t('common.currency') === 'د.ت' 
                                ? 'عرض خاص لفترة محدودة' 
                                : 'Special offer for a limited time'}
                            </p>
                          </div>
                          <div className="text-green-600 dark:text-green-400 animate-pulse">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
          <div className="mt-16 px-4 sm:px-6 md:px-0">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {t('product.similar_products')}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* HTML Native Carousel */}
            <div className="relative">
              <div className="overflow-hidden">
                {/* Slides Container */}
                <div className="relative">
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className={`transition-all duration-500 ease-in-out ${
                        slideIndex === currentSlide 
                          ? 'opacity-100 relative' 
                          : 'opacity-0 absolute inset-0 pointer-events-none'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
                        {similarProducts
                          .slice(slideIndex * itemsToShow, (slideIndex + 1) * itemsToShow)
                          .map((similarProduct) => (
                            <div key={similarProduct.id} className="w-full flex justify-center">
                              <div className="w-full max-w-xs">
                                <ProductCard product={similarProduct} />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentSlide 
                          ? 'w-8 h-2 bg-primary' 
                          : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-primary/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
