import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ProductDTO } from '@/models/types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allProducts: ProductDTO[];
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  allProducts,
  className = '',
  placeholder,
}: SearchBarProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
      setFilteredProducts(results.slice(0, 8)); // Limiter à 8 résultats
      setIsOpen(true);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
  }, [searchQuery, allProducts]);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onSearchChange('');
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder || t('header.search_placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => searchQuery && setIsOpen(true)}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown des résultats */}
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? t('product.results_found').slice(0, -1) : t('product.results_found')}
            </div>
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-md transition-colors text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-md overflow-hidden">
                  <img
                    src={product.photoPath}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.category}</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-sm font-bold text-primary">
                    {product.price.toFixed(2)} {t('common.currency')}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-xs text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)} {t('common.currency')}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {isOpen && searchQuery && filteredProducts.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg p-4">
          <div className="text-center text-muted-foreground text-sm">
            {t('product.no_products_found')}
          </div>
        </div>
      )}
    </div>
  );
}
