import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { Footer } from '@/components/Footer';
import { useShop } from '@/contexts/ShopContext';
import { products } from '@/data/products';
import { Category, Product } from '@/types';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useShop();

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name[language].toLowerCase().includes(query) ||
        product.description[language].toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, language]);

  const handleProductClick = (product: Product) => {
    // TODO: Implement product detail modal or navigation
    console.log('Product clicked:', product);
  };

  const getCategoryTitle = () => {
    const categoryTitles = {
      fr: {
        all: 'Tous nos produits',
        electronics: 'Électronique',
        cosmetics: 'Cosmétiques', 
        fashion: 'Mode',
        home: 'Maison'
      },
      ar: {
        all: 'جميع منتجاتنا',
        electronics: 'الإلكترونيات',
        cosmetics: 'مستحضرات التجميل',
        fashion: 'الأزياء',
        home: 'المنزل'
      }
    };
    
    return categoryTitles[language][selectedCategory];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <Hero />

        {/* Products Section */}
        <section id="products" className="py-16">
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {getCategoryTitle()}
              </h2>
              {searchQuery && (
                <p className="text-muted-foreground">
                  {language === 'fr' 
                    ? `${filteredProducts.length} résultat${filteredProducts.length > 1 ? 's' : ''} pour "${searchQuery}"`
                    : `${filteredProducts.length} نتيجة لـ "${searchQuery}"`
                  }
                </p>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'fr' ? 'Aucun produit trouvé' : 'لم يتم العثور على منتجات'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'fr' 
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'حاول تغيير معايير البحث'
                  }
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-primary hover:underline"
                >
                  {language === 'fr' ? 'Voir tous les produits' : 'عرض جميع المنتجات'}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <Cart />
    </div>
  );
};

export default Index;