import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useShop } from '@/contexts/ShopContext';
import { useState, useEffect } from 'react';
import { OrderForm } from './OrderForm';

export function Cart() {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    language,
    t,
  } = useShop();
  const [checkoutMode, setCheckoutMode] = useState(false);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('currency')}`;
  };

  const shippingThreshold = 500;
  const currentTotal = getCartTotal();
  const freeShippingRemaining = Math.max(0, shippingThreshold - currentTotal);

  // Whenever the cart sidebar opens, ensure we show the cart (not the checkout form)
  useEffect(() => {
    if (isCartOpen) setCheckoutMode(false);
  }, [isCartOpen]);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('view-cart')}
            {cartItems.length > 0 && (
              <Badge variant="secondary">{cartItems.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('cart-empty')}</h3>
              <Button onClick={() => setCartOpen(false)} variant="outline">
                {t('continue-shopping')}
              </Button>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              {freeShippingRemaining > 0 && (
                <div className="mb-4 p-3 bg-primary-light rounded-lg">
                  <div className="text-sm text-primary font-medium mb-2">
                    {language === 'fr' 
                      ? `Ajoutez ${formatPrice(freeShippingRemaining)} pour la livraison gratuite!`
                      : `أضف ${formatPrice(freeShippingRemaining)} للشحن المجاني!`
                    }
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, (currentTotal / shippingThreshold) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              <Separator className="my-4" />

              {/* Cart Items */}
              <div className="flex-1 overflow-auto space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name[language]}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.product.name[language]}
                      </h4>
                      
                      {item.selectedColor && (
                        <p className="text-xs text-muted-foreground">
                          {language === 'fr' ? 'Couleur' : 'اللون'}: {item.selectedColor}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />

              {/* If checkoutMode: show form first, then order summary below; otherwise show summary/buttons below products */}
              {checkoutMode ? (
                <div>
                  <OrderForm inline onCancel={() => setCheckoutMode(false)} />

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t('order-summary') || t('total')}</span>
                      <span className="font-bold text-lg">{formatPrice(currentTotal)}</span>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" onClick={() => {/* already submitting in OrderForm */}}>
                        {t('submit-order') || t('checkout')}
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setCheckoutMode(false)}>
                        {language === 'fr' ? 'Retour' : 'العودة'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t('total')}</span>
                    <span className="font-bold text-lg">{formatPrice(currentTotal)}</span>
                  </div>

                  {currentTotal >= shippingThreshold && (
                    <div className="flex items-center justify-center gap-2 text-sm text-success font-medium">
                      <Badge variant="outline" className="text-success border-success">
                        {t('free-shipping')}
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button className="w-full" size="lg" onClick={() => setCheckoutMode(true)}>
                      {t('checkout')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setCartOpen(false)}>
                      {t('continue-shopping')}
                    </Button>
                    {cartItems.length > 1 && (
                      <Button variant="ghost" className="w-full text-muted-foreground" onClick={clearCart}>
                        {language === 'fr' ? 'Vider le panier' : 'إفراغ السلة'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}