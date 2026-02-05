import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FeaturesSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Truck,
      title: t('footer.free_shipping'),
      description: t('footer.free_shipping_desc'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: RotateCcw,
      title: t('footer.easy_return'),
      description: t('footer.easy_return_desc'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: t('footer.cash_on_delivery'),
      description: t('footer.cash_on_delivery_desc'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Headphones,
      title: t('footer.support_24_7'),
      description: t('footer.support_24_7_desc'),
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon Container */}
                <div className="mb-4 inline-flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} p-0.5 shadow-lg`}>
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                      <feature.icon className={`h-7 w-7 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text group-hover:text-white transition-colors duration-300`} />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
