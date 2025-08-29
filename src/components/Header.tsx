import { ShoppingCart, Search, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/contexts/ShopContext';
import { categories } from '@/data/products';
import { Category } from '@/types';

interface HeaderProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: HeaderProps) {
  const { language, setLanguage, toggleCart, getCartItemsCount, t } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = getCartItemsCount();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gradient">Sheikh Store</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id as Category)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {category.name[language]}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="hidden sm:flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="md:hidden relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.id as Category);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    {category.name[language]}
                  </button>
                ))}
              </nav>

              {/* Mobile Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="w-full justify-center"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'العربية' : 'Français'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}