import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { FreeShippingBanner } from '@/components/FreeShippingBanner';

export default function OrderConfirmation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <FreeShippingBanner />
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
            {t('header.store_name')}
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-md w-full text-center">
          {/* Success Icon with Animation */}
          <div className="mb-8 flex justify-center">
            <div
              className={`transition-all duration-1000 ${
                animate
                  ? 'scale-100 opacity-100 rotate-0'
                  : 'scale-0 opacity-0 rotate-180'
              }`}
            >
              <CheckCircle2 
                className="w-24 h-24 text-green-500 animate-bounce" 
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Success Message */}
          <div
            className={`space-y-4 transition-all duration-700 delay-300 ${
              animate
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {t('orderConfirmation.title')}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {t('orderConfirmation.message')}
            </p>

            <div className="bg-muted/50 rounded-lg p-6 my-6">
              <p className="text-sm text-muted-foreground">
                {t('orderConfirmation.contact_info')}
              </p>
            </div>

            {/* Animated Decorative Element */}
            <div className="flex justify-center gap-2 my-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full bg-primary transition-all duration-500`}
                  style={{
                    animationDelay: `${i * 200}ms`,
                    animation: animate ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate('/')}
                className="flex-1"
                size="lg"
              >
                {t('orderConfirmation.back_to_home')}
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                {t('orderConfirmation.continue_shopping')}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
