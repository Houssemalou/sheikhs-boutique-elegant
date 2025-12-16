import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useShop } from "@/contexts/ShopContext";
import { useState, useEffect } from "react";
import { OrderForm } from "./OrderForm";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/orderService";
import { CustomerInfo } from "@/models/types";
import { useTranslation } from "react-i18next";

export function Cart() {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useShop();

  const { t } = useTranslation();
  const [checkoutMode, setCheckoutMode] = useState(false);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('common.currency')}`;
  };

  // Livraison toujours gratuite → on retire toute logique de seuil/progress bar
  const currentTotal = getCartTotal();

  useEffect(() => {
    if (isCartOpen) setCheckoutMode(false);
  }, [isCartOpen]);

  // Mutation React Query
  const {
    mutate: submitOrder,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      clearCart();
      setCartOpen(false);
    },
  });

  // Construire OrderData depuis le panier
  const handleOrderSubmit = (customerInfo: CustomerInfo) => {
    const order = {
      items: cartItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
      })),
      total: currentTotal,
      // ✅ correspond exactement à l'interface OrderData (propriété "CustomerInfo")
      customerInfo: customerInfo,
    };
    submitOrder(order);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("cart.view_cart")}
            {cartItems.length > 0 && (
              <Badge variant="secondary">{cartItems.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("cart.empty")}</h3>
              <Button onClick={() => setCartOpen(false)} variant="outline">
                {t("cart.continue_shopping")}
              </Button>
            </div>
          ) : checkoutMode ? (
            <>
              {/* Mode Checkout - Formulaire */}
              <div className="flex-1 overflow-y-auto -mx-6 px-6">
                <OrderForm
                  inline
                  onCancel={() => setCheckoutMode(false)}
                  onSubmit={handleOrderSubmit}
                />
              </div>

              <div className="mt-4 space-y-3 border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCheckoutMode(false)}
                >
                  {t("cart.continue_shopping")}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* ⛔ Progress bar supprimée (toujours Free Shipping) */}

              <Separator className="my-4" />

              {/* Cart Items */}
              <div className="flex-1 overflow-auto space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex gap-3"
                  >
                    <img
                      src={item.product.photoPath}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </h4>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
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
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-bold text-lg">
                    {formatPrice(currentTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <Badge variant="outline">
                    الشحن مجاني
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setCheckoutMode(true)}
                  >
                    {t("cart.checkout")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCartOpen(false)}
                  >
                    {t("cart.continue_shopping")}
                  </Button>
                  {cartItems.length > 1 && (
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={clearCart}
                    >
                      إفراغ السلة (Empty Cart)
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
