import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { useShop } from "@/contexts/ShopContext";
import { getCategories } from "@/services/productsService";
import { CategoryResDTO, ProductDTO } from "@/models/types";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">(
    "name"
  );
  const { language } = useShop();

  // Récupérer catégories + produits
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<CategoryResDTO[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories_header = useMemo(() => {
    if (!categories) return [];
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
    }));
    }, [categories]);
  

  // Filtrage et tri
  const groupedProducts = useMemo(() => {
  if (!categories) return {};

  let allProducts: ProductDTO[] = categories.flatMap((c) => c.products);

  // Filtre recherche
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    allProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }

  // Filtre prix
  allProducts = allProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // Tri
  allProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Regrouper par catégories
  const grouped: Record<string, ProductDTO[]> = {};
  categories.forEach((cat) => {
    grouped[cat.id.toString()] = allProducts.filter(
      (p) => p.category === cat.name
    );
  });

  return grouped;
}, [categories, searchQuery, priceRange, sortBy]);

// 👇 Ici le log est OK (après calcul)
console.log("All Products:", groupedProducts);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId !== "all") {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        categories={categories_header}
        selectedCategory={activeCategory}
        onCategoryChange={scrollToCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <Hero />

        <section id="products" className="py-16">
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                منتجاتنا
              </h2>
              {searchQuery && (
                <p className="text-muted-foreground">
                  {`النتائج لـ ${searchQuery}`}
                </p>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center text-red-600 py-16">
                <p>
                   حدث خطأ أثناء تحميل المنتجات
                </p>
              </div>
            )}

            {/* Produits */}
            {!isLoading && !error && categories && (
              <>
                {Object.keys(groupedProducts).length > 0 ? (
                  <div className="space-y-16">
                    {categories
                      .filter(
                        (cat) =>
                          groupedProducts[cat.id.toString()]?.length > 0
                      )
                      .map((cat) => (
                        <div
                          key={cat.id}
                          id={`category-${cat.id}`}
                          className="scroll-mt-24"
                        >
                          <div className="mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                              {cat.name}
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                          </div>

                          <div className="product-grid">
                            {groupedProducts[cat.id.toString()].map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-semibold mb-2">
                      لم يتم العثور على منتجات
                    </h3>
                  </div>
                )}
              </>
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
