import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Hero() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t('hero.slide1.title', { defaultValue: 'Welcome to ARDA Store' }),
      subtitle: t('hero.slide1.subtitle', { defaultValue: 'Discover our quality products' }),
      cta: t('hero.slide1.cta', { defaultValue: 'View products' }),
      gradient: 'from-violet-600 via-purple-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=1920&h=800&fit=crop&q=95'
    },
    {
      title: t('hero.slide2.title', { defaultValue: 'Fast Delivery' }),
      subtitle: t('hero.slide2.subtitle', { defaultValue: 'Receive your orders in 24-48h' }),
      cta: t('hero.slide2.cta', { defaultValue: 'Order now' }),
      gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop&q=95'
    },
    {
      title: t('hero.slide3.title', { defaultValue: '24/7 Customer Service' }),
      subtitle: t('hero.slide3.subtitle', { defaultValue: 'Our team is always here to help you' }),
      cta: t('hero.slide3.cta', { defaultValue: 'Contact us' }),
      gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&h=800&fit=crop&q=95'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden h-[400px] md:h-[500px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
          style={{ 
            transitionProperty: 'opacity, transform',
            pointerEvents: index === currentSlide ? 'auto' : 'none'
          }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              filter: 'brightness(0.8)'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-40`} />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-center">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center px-4">
                <h1 
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-2xl transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  {slide.title}
                </h1>
                
                <p 
                  className={`text-lg md:text-xl text-white/95 mb-8 drop-shadow-lg transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  {slide.subtitle}
                </p>
                
                <button
                  onClick={scrollToProducts}
                  className={`px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '600ms' }}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}