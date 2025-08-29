import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { Footer } from '@/components/Footer';
import { OrderForm } from '@/components/OrderForm';
import { useShop } from '@/contexts/ShopContext';
import { products, categories } from '@/data/products';
import { Category, Product } from '@/types';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useShop();

  // Group products by category and apply search filter
  const groupedProducts = useMemo(() => {
    let filteredProducts = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name[language].toLowerCase().includes(query) ||
        product.description[language].toLowerCase().includes(query)
      );
    }

    // Group by category
    const grouped: Record<string, Product[]> = {};
    categories.forEach(category => {
      if (category.id !== 'all') {
        grouped[category.id] = filteredProducts.filter(product => product.category === category.id);
      }
    });

    return grouped;
  }, [searchQuery, language]);

  const handleProductClick = (product: Product) => {
    // TODO: Implement product detail modal or navigation
    console.log('Product clicked:', product);
  };

  const scrollToCategory = (categoryId: Category) => {
    setActiveCategory(categoryId);
    if (categoryId !== 'all') {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name[language] : '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        selectedCategory={activeCategory}
        onCategoryChange={scrollToCategory}
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
                {language === 'fr' ? 'Nos Produits' : 'منتجاتنا'}
              </h2>
              {searchQuery && (
                <p className="text-muted-foreground">
                  {language === 'fr' 
                    ? `Résultats pour "${searchQuery}"`
                    : `النتائج لـ "${searchQuery}"`
                  }
                </p>
              )}
            </div>

            {/* Products by Category */}
            {Object.keys(groupedProducts).length > 0 ? (
              <div className="space-y-16">
                {categories
                  .filter(category => category.id !== 'all' && groupedProducts[category.id]?.length > 0)
                  .map((category) => (
                    <div key={category.id} id={`category-${category.id}`} className="scroll-mt-24">
                      <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                          {category.name[language]}
                        </h3>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                      </div>
                      
                      <div className="product-grid">
                        {groupedProducts[category.id].map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onProductClick={handleProductClick}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                }
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
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-primary hover:underline"
                >
                  {language === 'fr' ? 'Voir tous les produits' : 'عرض جميع المنتجات'}
                </button>
              </div>
            )}

            {/* Order Form */}
            <div className="mt-16 text-center">
              <OrderForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Cart />
    </div>
  );
};

export default Index;