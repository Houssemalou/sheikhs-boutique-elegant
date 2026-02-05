import { Mail, Phone, MapPin, Instagram, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  const contactInfo = {
    title: t('footer.store_title'),
    description: t('footer.store_description'),
    address: t('footer.address'),
    email: 'ardastore598@gmail.com',
    phone: '+974 7033 6561',
    hours: t('footer.hours_24_7')
  };

  return (
    <footer className="bg-black text-white mt-16">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">{contactInfo.title}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{contactInfo.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm">{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-primary transition-colors text-sm">{contactInfo.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-primary transition-colors text-sm">{contactInfo.phone}</a>
              </div>
              
              {/* Social Media */}
              <div className="pt-4">
                <h4 className="font-semibold mb-3 text-white">{t('footer.follow_us')}</h4>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/elsheikh_store1" target="_blank" rel="noopener noreferrer" 
                     className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Instagram className="h-5 w-5 text-white" />
                  </a>
                  <a href="https://www.tiktok.com/@arda.store0?_r=1&_t=ZS-92H1PbQ8vZt" target="_blank" rel="noopener noreferrer"
                     className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Globe className="h-5 w-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">{t('footer.quick_links')}</h4>
            <div className="space-y-3">
              <a href="#" className="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1 transform duration-200 text-sm">
                {t('footer.about_us')}
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1 transform duration-200 text-sm">
                {t('footer.return_policy')}
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1 transform duration-200 text-sm">
                {t('footer.terms_of_use')}
              </a>
              <a href="#" className="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1 transform duration-200 text-sm">
                {t('footer.privacy')}
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">{t('footer.customer_service')}</h4>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="font-medium text-white mb-1 text-sm">{t('footer.working_hours')}</div>
                <div className="text-gray-300 text-sm">{contactInfo.hours}</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="font-medium text-white mb-1 text-sm">{t('footer.help')}</div>
                <div className="text-gray-300 text-sm">{t('footer.live_chat')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} <span className="text-primary font-semibold">Arda Store</span>. {t('footer.rights')}.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{t('footer.payment_method')}</span>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg text-sm font-semibold text-primary">
                  {t('footer.cash_payment')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
