import { ShoppingBag, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/contexts/ShopContext';

export function Hero() {
  const { language } = useShop();

  const content = {
    fr: {
      badge: 'Nouveau',
      title: 'Découvrez Sheikh Store',
      subtitle: 'Votre destination premium pour l\'électronique, cosmétiques et mode',
      description: 'Des produits de qualité, livraison rapide et service client exceptionnel',
      cta: 'Découvrir nos produits',
      features: [
        'Livraison gratuite dès 500 DH',
        'Garantie satisfaction',
        'Support client 24/7'
      ]
    },
    ar: {
      badge: 'جديد',
      title: 'اكتشف متجر الشيخ',
      subtitle: 'وجهتك المميزة للإلكترونيات ومستحضرات التجميل والأزياء',
      description: 'منتجات عالية الجودة وتوصيل سريع وخدمة عملاء استثنائية',
      cta: 'اكتشف منتجاتنا',
      features: [
        'شحن مجاني من 500 درهم',
        'ضمان الرضا',
        'دعم العملاء 24/7'
      ]
    }
  };

  const currentContent = content[language];

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary opacity-5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 mr-2" />
            {currentContent.badge}
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">{currentContent.title}</span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            {currentContent.description}
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="mb-12 px-8 py-6 text-lg font-semibold shadow-elegant"
            onClick={scrollToProducts}
          >
            <ShoppingBag className="h-5 w-5 mr-3" />
            {currentContent.cta}
          </Button>

          {/* Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}