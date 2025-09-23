import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useShop } from '@/contexts/ShopContext';
import { CustomerInfo } from '@/models/types';

interface OrderFormData {
  name: string;
  phone: string;
  streetNumber: string; // رقم الشارع (Street Number)
  areaNumber: string;   // رقم المنطقة (Area Number)
  villaNumber: string;  // رقم الفيلا (Villa Number)
  notes?: string;
}

export function OrderForm({
  inline = false,
  onCancel,
  onSubmit,
}: {
  inline?: boolean;
  onCancel?: () => void;
  onSubmit?: (customerInfo: CustomerInfo) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, getCartTotal, t } = useShop();
  const form = useForm<OrderFormData>();

  const handleFormSubmit = (data: OrderFormData) => {
    // Compose the address string from the three new fields to stay compatible with CustomerInfo
    const composedAddress = `رقم الشارع (Street No.): ${data.streetNumber}، رقم المنطقة (Area No.): ${data.areaNumber}، رقم الفيلا (Villa No.): ${data.villaNumber}`;

    const customerInfo: CustomerInfo = {
      name: data.name,
      phone: data.phone,
      address: composedAddress
    };

    if (onSubmit) onSubmit(customerInfo);

    form.reset();
    setIsOpen(false);
    if (inline && onCancel) onCancel();
  };

  const labels = {
    name: 'الاسم الكامل (Full Name)',
    phone: 'الهاتف (Phone)',
    streetNumber: 'رقم الشارع (Street Number)',
    areaNumber: 'رقم المنطقة (Area Number)',
    villaNumber: 'رقم الفيلا (Villa Number)',
    notes: 'ملاحظات (اختياري) (Notes - optional)',
    submitOrder: 'إرسال الطلب (Submit Order)',
    orderForm: 'نموذج الطلب (Order Form)',
    orderSummary: 'ملخص الطلب (Order Summary)',
    return: 'ارجع (Back)',
  };

  if (cartItems.length === 0) return null;

  const innerContent = (
    <div className="max-w-2xl">
      <div className="grid grid-cols-1 gap-6">
        {/* Order Summary */}
        <div>
          <h3 className="font-semibold mb-4">{labels.orderSummary}</h3>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor}`} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.product.name}
                  {item.selectedColor && <span className="text-muted-foreground"> - {item.selectedColor}</span>}
                  <span className="text-muted-foreground"> x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  {(item.product.price * item.quantity).toLocaleString()} {t('currency')}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>{t('total')}</span>
              <span>{getCartTotal().toLocaleString()} {t('currency')}</span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              handleFormSubmit(data);
            })}
            className="flex flex-col"
            style={{ maxHeight: '60vh' }}
          >
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.name}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{labels.phone}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetNumber"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.streetNumber}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{labels.areaNumber}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{labels.villaNumber}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.notes}</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[90px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sticky bottom-0 bg-white pt-4 pb-2 z-10 border-t shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.08)]">
              <Button type="submit" className="w-full">{labels.submitOrder}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );

  if (inline) return innerContent;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
