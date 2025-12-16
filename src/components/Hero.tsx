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
import { useRef } from 'react';

export function Hero() {
  const { t } = useTranslation();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const slides = [
    {
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      cta: t('hero.slide1.cta'),
      icon: Sparkles,
      gradient: 'from-purple-600 via-pink-600 to-blue-600',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&h=1080&fit=crop&q=80'
    },
    {
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      cta: t('hero.slide2.cta'),
      icon: Truck,
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1920&h=1080&fit=crop&q=80'
    },
    {
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      cta: t('hero.slide3.cta'),
      icon: Headphones,
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop&q=80'
    }
  ];

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
                <div className="relative py-20 lg:py-28 w-full">
                  {/* Background Image with Overlay */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-100"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  
                  {/* Dark Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-10`} />
                  
                  <div className="container relative">
                    <div className="max-w-4xl mx-auto text-center">
                      {/* Icon */}
                      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>

                      {/* Main Heading */}
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                          {slide.title}
                        </span>
                      </h1>

                      {/* Subtitle */}
                      <h2 className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {slide.subtitle}
                      </h2>

                      {/* CTA Button */}
                      <Button 
                        size="lg" 
                        className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
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