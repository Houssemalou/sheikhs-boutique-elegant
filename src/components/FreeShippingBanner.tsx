import { Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FreeShippingBanner() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-2 px-4 overflow-hidden">
      <div className="container">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium animate-pulse">
          <Truck className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
          <span className="text-center">
            {t('banner.free_shipping')}
          </span>
          <Truck className="w-4 h-4 md:w-5 md:h-5 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
