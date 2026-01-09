import { ShoppingCart, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/contexts/ShopContext';
import { Category, ProductDTO } from '@/models/types';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchBar } from '@/components/SearchBar';
import { FreeShippingBanner } from '@/components/FreeShippingBanner';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string | number;
  onCategoryChange: (categoryId: string | number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allProducts?: ProductDTO[];
}

const MAX_VISIBLE_CATEGORIES = 5;

export function Header({
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  allProducts = [],
}: HeaderProps) {
  const { getCartItemsCount, setCartOpen } = useShop();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const cartItemsCount = getCartItemsCount();
  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const moreCategories = categories.slice(MAX_VISIBLE_CATEGORIES);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <FreeShippingBanner />
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center gap-3">
              <img 
                src="/arda-logo.svg" 
                alt="ARDA Store Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-2">
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {category.name}
              </button>
            ))}
            {moreCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen((open) => !open)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  {t('header.more')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isMoreOpen && (
                  <div
                    className="absolute left-0 mt-2 w-40 bg-background border border-border rounded-md shadow-lg z-50"
                    onMouseLeave={() => setIsMoreOpen(false)}
                  >
                    {moreCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onCategoryChange(category.id);
                          setIsMoreOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-foreground text-background'
                            : 'text-muted-foreground hover:text-primary hover:bg-muted'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              allProducts={allProducts}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background border-border">
                  <Globe className="h-4 w-4 mr-2" />
                  {i18n.language === 'ar' ? 'العربية' : 'English'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background">
                <DropdownMenuItem onClick={() => changeLanguage('ar')} className="cursor-pointer">
                  <span className="mr-2">🇶🇦</span>
                  العربية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
                  <span className="mr-2">🇬🇧</span>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCartOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

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

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <div className="space-y-4">
              <nav className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Barre de recherche mobile - toujours visible sur petits écrans */}
      <div className="md:hidden border-b border-border bg-background/95 backdrop-blur">
        <div className="container py-3">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            allProducts={allProducts}
            className="w-full"
          />
        </div>
      </div>
    </header>
    </>
  );
}
