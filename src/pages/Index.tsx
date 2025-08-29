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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const { language } = useShop();

  // Group products by category and apply search and price filters
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

    // Filter by price range
    filteredProducts = filteredProducts.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name[language].localeCompare(b.name[language]);
      }
    });

    // Group by category
    const grouped: Record<string, Product[]> = {};
    categories.forEach(category => {
      if (category.id !== 'all') {
        grouped[category.id] = filteredProducts.filter(product => product.category === category.id);
      }
    });

    return grouped;
  }, [searchQuery, language, priceRange, sortBy]);

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

            {/* Filters */}
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-6">
              {/* Price Range Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  {language === 'fr' ? 'Fourchette de prix' : 'نطاق السعر'}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-24 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 30000])}
                    className="w-24 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <span className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'DH' : 'درهم'}
                  </span>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  {language === 'fr' ? 'Trier par' : 'ترتيب حسب'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price-low' | 'price-high')}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  <option value="name">
                    {language === 'fr' ? 'Nom' : 'الاسم'}
                  </option>
                  <option value="price-low">
                    {language === 'fr' ? 'Prix croissant' : 'السعر من الأقل للأعلى'}
                  </option>
                  <option value="price-high">
                    {language === 'fr' ? 'Prix décroissant' : 'السعر من الأعلى للأقل'}
                  </option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    setPriceRange([0, 30000]);
                    setSortBy('name');
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {language === 'fr' ? 'Réinitialiser' : 'إعادة تعيين'}
                </button>
              </div>
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

            {/* Order form removed from homepage - checkout available from cart sidebar */}
          </div>
        </section>
      </main>

      <Footer />
      <Cart />
    </div>
  );
};

export default Index;