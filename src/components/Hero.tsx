import { ShoppingBag, Truck, Headphones, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useMemo } from 'react';

export function Hero() {
  const { t, i18n } = useTranslation();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const slides = useMemo(() => [
    {
      title: t('hero.slide1.title', { defaultValue: 'Welcome to ARDA Store' }),
      subtitle: t('hero.slide1.subtitle', { defaultValue: 'Discover our quality products' }),
      cta: t('hero.slide1.cta', { defaultValue: 'View products' }),
      icon: Sparkles,
      gradient: 'from-purple-600 via-pink-600 to-blue-600',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&h=1080&fit=crop&q=95&auto=format&brightness=1.2'
    },
    {
      title: t('hero.slide2.title', { defaultValue: 'Fast Delivery' }),
      subtitle: t('hero.slide2.subtitle', { defaultValue: 'Receive your orders in 24-48h' }),
      cta: t('hero.slide2.cta', { defaultValue: 'Order now' }),
      icon: Truck,
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1920&h=1080&fit=crop&q=95&auto=format&brightness=1.2'
    },
    {
      title: t('hero.slide3.title', { defaultValue: '24/7 Customer Service' }),
      subtitle: t('hero.slide3.subtitle', { defaultValue: 'Our team is always here to help you' }),
      cta: t('hero.slide3.cta', { defaultValue: 'Contact us' }),
      icon: Headphones,
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop&q=95&auto=format&brightness=1.2'
    }
  ], [t]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <CarouselItem key={index} className="pl-0">
                <div className="relative py-12 sm:py-16 md:py-20 lg:py-28 w-full min-h-[400px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[700px]">
                  {/* Background Image with Overlay and Animation */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 animate-in fade-in zoom-in-40 duration-1000"
                    style={{ 
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'brightness(1.15) contrast(1.1) saturate(1.2)',
                    }}
                  />
                  
                  {/* Dark Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/30 animate-in fade-in duration-700" />
                  
                  {/* Gradient Overlay with Animation */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-20 animate-in fade-in duration-1000`} />
                  
                  <div className="container relative">
                    <div className="max-w-4xl mx-auto text-center">
                      {/* Icon */}
                      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur animate-in zoom-in duration-500 delay-200">
                        <Icon className="h-10 w-10 text-primary animate-pulse" />
                      </div>

                      {/* Main Heading */}
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-in slide-in-from-bottom duration-700 delay-300">
                        <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                          {slide.title}
                        </span>
                      </h1>

                      {/* Subtitle */}
                      <h2 className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-700 delay-500">
                        {slide.subtitle}
                      </h2>

                      {/* CTA Button */}
                      <Button 
                        size="lg" 
                        className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-in zoom-in duration-700 delay-700"
                        onClick={scrollToProducts}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {slide.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}