import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useShop } from '@/contexts/ShopContext';
import { CustomerInfo, CartItem } from '@/models/types';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';

interface OrderFormData {
  name: string;
  phone: string;
  streetNumber: string;
  areaNumber: string;
  villaNumber: string;
  notes?: string;
}

export function OrderForm({
  inline = false,
  onCancel,
  onSubmit,
  onClose,
  initialItems,
}: {
  inline?: boolean;
  onCancel?: () => void;
  onSubmit?: (customerInfo: CustomerInfo) => void;
  onClose?: () => void;
  initialItems?: CartItem[];
}) {
  const [isOpen, setIsOpen] = useState(initialItems ? true : false);
  const { cartItems, clearCart } = useShop();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<OrderFormData>();

  // Use initialItems if provided, otherwise use cart items
  const itemsToOrder = initialItems || cartItems;
  
  const calculateTotal = () => {
    return itemsToOrder.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Utiliser la même logique que Cart.tsx
  const {
    mutate: submitOrder,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Si c'est depuis le panier (pas initialItems), vider le panier
      if (!initialItems) {
        clearCart();
      }
      // Redirect to confirmation page
      navigate('/order-confirmation');
    },
    onError: (error) => {
      toast({
        title: '✗ ' + t('common.error'),
        description: t('order.error'),
        variant: 'destructive',
      });
    },
  });

  const handleFormSubmit = (data: OrderFormData) => {
    const composedAddress = `${t('order.street_number')}: ${data.streetNumber}, ${t('order.area_number')}: ${data.areaNumber}, ${t('order.villa_number')}: ${data.villaNumber}`;

    const customerInfo: CustomerInfo = {
      name: data.name,
      phone: data.phone,
      address: composedAddress
    };

    // Construire la commande avec la même structure que Cart.tsx
    const order = {
      items: itemsToOrder.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
      })),
      total: calculateTotal(),
      customerInfo: customerInfo,
    };

    submitOrder(order);

    // Appeler onSubmit si fourni (pour compatibilité)
    if (onSubmit) onSubmit(customerInfo);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const labels = {
    name: t('order.name'),
    phone: t('order.phone'),
    streetNumber: t('order.street_number'),
    areaNumber: t('order.area_number'),
    villaNumber: t('order.villa_number'),
    notes: t('order.notes_optional'),
    submitOrder: t('order.submit'),
    orderForm: t('order.title'),
    orderSummary: t('order.order_summary'),
    return: 'Back',
  };

  if (itemsToOrder.length === 0) return null;

  const innerContent = (
    <div className={inline ? "w-full" : "max-w-2xl"}>
      <div className="grid grid-cols-1 gap-6">
        {/* Order Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              handleFormSubmit(data);
            })}
            className="flex flex-col"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{labels.name}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={labels.name} className="border-gray-300 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{labels.phone}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={labels.phone} className="border-gray-300 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="streetNumber"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">{labels.streetNumber}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={labels.streetNumber} className="border-gray-300 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="areaNumber"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">{labels.areaNumber}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={labels.areaNumber} className="border-gray-300 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="villaNumber"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">{labels.villaNumber}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={labels.villaNumber} className="border-gray-300 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{labels.notes}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder={labels.notes} className="min-h-[90px] border-gray-300 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg rounded-lg shadow-md" 
                disabled={isPending}
              >
                {isPending ? t('common.loading') : labels.submitOrder}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );

  if (inline) return innerContent;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">{labels.submitOrder}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.orderForm}</DialogTitle>
        </DialogHeader>
        {innerContent}
      </DialogContent>
    </Dialog>
  );
}
