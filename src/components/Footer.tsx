import { Truck, Shield, RotateCcw, Headphones, Mail, Phone, MapPin, Instagram, Globe  } from 'lucide-react';

export function Footer() {
  const features = [
  {
    icon: Truck,
    title: 'شحن مجاني (Free Shipping)',
    description: 'لجميع الطلبات (For all orders)',
  },
  {
    icon: RotateCcw,
    title: 'إرجاع سهل (Easy Return)',
    description: '1 يوم لتغيير رأيك (1 day to change your mind)',
  },
  {
    icon: Shield,
    title: 'الدفع عند التسليم (Cash on Delivery)',
    description: 'الدفع نقدًا فقط عند التسليم (Cash only upon delivery)',
  },
  {
    icon: Headphones,
    title: 'دعم 24/7 (24/7 Support)',
    description: 'دعم عملاء مخصص (Dedicated customer support)',
  },
];


  const contactInfo = {
    title: 'متجر الشيخ',
    description: 'وجهتك الموثوقة للإلكترونيات ومستحضرات التجميل والأزياء الفاخرة.',
    address: 'قطر ,الدوحة',
    email: 'Mtjralshykhelsheikhstore@gmail.com',
    hours: '7/24'
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
                <Instagram className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="https://www.instagram.com/elsheikh_store1" target="_blank" className="hover:text-primary">Instagram</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="https://www.tiktok.com/@elsheikh.store1" target="_blank" className="hover:text-primary">TikTok</a>

               
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">معلومات عنا</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">سياسة الإرجاع</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">شروط الاستخدام</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">الخصوصية</a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">خدمة العملاء</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">ساعات العمل</div>
                <div className="text-muted-foreground">{contactInfo.hours}</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium">المساعدة</div>
                <div className="text-muted-foreground">محادثة مباشرة متاحة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">©{new Date().getFullYear()} Arda Store. جميع الحقوق محفوظة.</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>طريقة الدفع:</span>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-background rounded text-xs font-medium">الدفع نقدًا عند التسليم</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
