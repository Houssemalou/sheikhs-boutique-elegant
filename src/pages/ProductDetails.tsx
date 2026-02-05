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
import { Footer } from '@/components/Footer';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
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

      {/* Product Details - Nouveau Design Kotama */}
      <div className="container py-6 md:py-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Column: Images */}
            <div className="p-6 md:p-8">
              {/* Image principale */}
              <div className="relative bg-white rounded-lg overflow-hidden mb-4">
                <div className="aspect-square relative">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Badges */}
                  {isPromo && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-600 text-white text-base px-3 py-1">
                        -{Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}%
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Miniatures */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
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
                        className="w-full h-full object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Info & Order Form */}
            <div className="p-6 md:p-8 bg-gray-50 border-l">
              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-green-600">
                  {t('common.currency')} {product.price.toFixed(2)}
                </span>
                {isPromo && (
                  <span className="text-xl text-gray-400 line-through">
                    {t('common.currency')} {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Order Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 text-center font-medium">
                  {t('order.order_message')}
                </p>
              </div>

              {/* Order Form */}
              <div className="space-y-4">
                <OrderForm
                  inline={true}
                  initialItems={[{ product, quantity, selectedColor }]}
                />
              </div>

              {/* Promo Badge */}
              {product.promo && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎁</div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-green-700">
                        {t('product.buy_3_get_1')}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description - Section séparée */}
        {product.description && product.description.trim() !== '' ? (
          <div className="mt-8 w-full lg:w-1/4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-2xl md:text-3xl">✨</span>
              {t('product.description')}
            </h2>
            <div className="text-gray-800 leading-relaxed text-lg md:text-xl lg:text-2xl font-medium">
              <p className={`whitespace-pre-line ${
                !showFullDescription && product.description.length > 300 ? 'line-clamp-4' : ''
              }`}>
                {product.description}
              </p>
              {product.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary text-lg md:text-xl lg:text-2xl font-medium hover:underline mt-4 inline-block"
                >
                  {showFullDescription ? t('product.read_less') : t('product.read_more')}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Si pas de description, afficher les 3 premières images verticalement */
          productImages.length > 1 && (
            <div className="mt-8 max-w-2xl">
              <div className="space-y-4">
                {productImages.slice(0, 3).map((image, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

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
      
      <Footer />
    </div>
  );
}
