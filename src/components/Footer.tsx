import { Truck, Shield, RotateCcw, Headphones, Mail, Phone, MapPin } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';

export function Footer() {
  const { language, t } = useShop();

  const features = [
    {
      icon: Truck,
      title: { fr: 'Livraison Gratuite', ar: 'شحن مجاني' },
      description: { fr: 'Pour les commandes +500 DH', ar: 'للطلبات +500 درهم' }
    },
    {
      icon: RotateCcw,
      title: { fr: 'Retours Faciles', ar: 'إرجاع سهل' },
      description: { fr: '30 jours pour changer d\'avis', ar: '30 يوم لتغيير رأيك' }
    },
    {
      icon: Shield,
      title: { fr: 'Paiement Sécurisé', ar: 'دفع آمن' },
      description: { fr: 'Protection SSL garantie', ar: 'حماية SSL مضمونة' }
    },
    {
      icon: Headphones,
      title: { fr: 'Support 24/7', ar: 'دعم 24/7' },
      description: { fr: 'Assistance client dédiée', ar: 'دعم عملاء مخصص' }
    }
  ];

  const contactInfo = {
    fr: {
      title: 'Sheikh Store',
      description: 'Votre destination de confiance pour l\'électronique, cosmétiques et mode premium.',
      address: '123 Rue Mohammed V, Casablanca',
      phone: '+212 522 123 456',
      email: 'contact@shekhstore.ma',
      hours: 'Lun-Ven: 9h-19h, Sam: 9h-18h'
    },
    ar: {
      title: 'متجر الشيخ',
      description: 'وجهتك الموثوقة للإلكترونيات ومستحضرات التجميل والأزياء الفاخرة.',
      address: '123 شارع محمد الخامس، الدار البيضاء',
      phone: '+212 522 123 456',
      email: 'contact@shekhstore.ma',
      hours: 'الإثنين-الجمعة: 9ص-7م، السبت: 9ص-6م'
    }
  };

  const currentInfo = contactInfo[language];

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
                <h3 className="font-semibold mb-2">{feature.title[language]}</h3>
                <p className="text-sm text-muted-foreground">{feature.description[language]}</p>
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
            <h3 className="text-xl font-bold text-gradient mb-4">{currentInfo.title}</h3>
            <p className="text-muted-foreground mb-6">{currentInfo.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{currentInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{currentInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{currentInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">
              {language === 'fr' ? 'Liens Rapides' : 'روابط سريعة'}
            </h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                {language === 'fr' ? 'À Propos' : 'معلومات عنا'}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                {language === 'fr' ? 'Politique de Retour' : 'سياسة الإرجاع'}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                {language === 'fr' ? 'Conditions d\'Utilisation' : 'شروط الاستخدام'}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                {language === 'fr' ? 'Confidentialité' : 'الخصوصية'}
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">
              {language === 'fr' ? 'Service Client' : 'خدمة العملاء'}
            </h4>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">
                  {language === 'fr' ? 'Horaires d\'Ouverture' : 'ساعات العمل'}
                </div>
                <div className="text-muted-foreground">{currentInfo.hours}</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium">
                  {language === 'fr' ? 'Assistance' : 'المساعدة'}
                </div>
                <div className="text-muted-foreground">
                  {language === 'fr' 
                    ? 'Chat en direct disponible'
                    : 'محادثة مباشرة متاحة'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Sheikh Store. {language === 'fr' ? 'Tous droits réservés.' : 'جميع الحقوق محفوظة.'}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{language === 'fr' ? 'Paiement accepté:' : 'طرق الدفع المقبولة:'}</span>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-background rounded text-xs font-medium">VISA</div>
                <div className="px-2 py-1 bg-background rounded text-xs font-medium">MC</div>
                <div className="px-2 py-1 bg-background rounded text-xs font-medium">
                  {language === 'fr' ? 'Espèces' : 'نقدي'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}