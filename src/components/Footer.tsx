import { Truck, Shield, RotateCcw, Headphones, Mail, Phone, MapPin, Instagram, Globe  } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  
  const features = [
  {
    icon: Truck,
    title: t('footer.free_shipping'),
    description: t('footer.free_shipping_desc'),
  },
  {
    icon: RotateCcw,
    title: t('footer.easy_return'),
    description: t('footer.easy_return_desc'),
  },
  {
    icon: Shield,
    title: t('footer.cash_on_delivery'),
    description: t('footer.cash_on_delivery_desc'),
  },
  {
    icon: Headphones,
    title: t('footer.support_24_7'),
    description: t('footer.support_24_7_desc'),
  },
];


  const contactInfo = {
    title: t('footer.store_title'),
    description: t('footer.store_description'),
    address: t('footer.address'),
    email: 'ardastore598@gmail.com',
    phone: '+974 7033 6561',
    hours: t('footer.hours_24_7')
  };

  return (
    <footer className="bg-muted/30 mt-16">
      {/* Features Section */}
      <div className="border-b border-border">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gradient mb-4">{contactInfo.title}</h3>
            <p className="text-muted-foreground mb-6">{contactInfo.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">{contactInfo.phone}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Instagram className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="https://www.instagram.com/elsheikh_store1" target="_blank" className="hover:text-primary">Instagram</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="https://www.tiktok.com/@arda.store0?_r=1&_t=ZS-92H1PbQ8vZt" target="_blank" className="hover:text-primary">TikTok</a>

               
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quick_links')}</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">{t('footer.about_us')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">{t('footer.return_policy')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">{t('footer.terms_of_use')}</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.customer_service')}</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">{t('footer.working_hours')}</div>
                <div className="text-muted-foreground">{contactInfo.hours}</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium">{t('footer.help')}</div>
                <div className="text-muted-foreground">{t('footer.live_chat')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">©{new Date().getFullYear()} Arda Store. {t('footer.rights')}.</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{t('footer.payment_method')}</span>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-background rounded text-xs font-medium">{t('footer.cash_payment')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
