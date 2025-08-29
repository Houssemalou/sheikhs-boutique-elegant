import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useShop } from '@/contexts/ShopContext';
import { toast } from '@/hooks/use-toast';

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export function OrderForm({ inline = false, onCancel }: { inline?: boolean; onCancel?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, getCartTotal, clearCart, language, t } = useShop();
  const form = useForm<OrderFormData>();

  const onSubmit = (data: OrderFormData) => {
    // Simulation de soumission de commande
    const orderData = {
      ...data,
      items: cartItems,
      total: getCartTotal(),
      orderDate: new Date().toISOString(),
    };

    console.log('Order submitted:', orderData);
    
    // Afficher un message de succès en précisant le paiement en espèces à la livraison
    toast({
      title: language === 'fr' ? 'Commande reçue' : 'تم استلام الطلب',
      description: language === 'fr'
        ? 'Votre commande a été reçue. Paiement: espèces à la livraison. Nous vous contacterons bientôt.'
        : 'تم استلام طلبك. طريقة الدفع: نقدًا عند التسليم. سنتواصل معك قريباً.',
    });

  // Vider le panier et fermer le modal / vue inline
  clearCart();
  setIsOpen(false);
  form.reset();
  if (inline && onCancel) onCancel();
  };

  const formLabels = {
    fr: {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      postalCode: 'Code postal',
      notes: 'Notes (optionnel)',
      submitOrder: 'Envoyer la commande',
      orderForm: 'Formulaire de commande',
      orderSummary: 'Résumé de la commande',
    },
    ar: {
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      city: 'المدينة',
      postalCode: 'الرمز البريدي',
      notes: 'ملاحظات (اختياري)',
      submitOrder: 'إرسال الطلب',
      orderForm: 'نموذج الطلب',
      orderSummary: 'ملخص الطلب',
    },
  };

  const labels = formLabels[language];

  if (cartItems.length === 0) {
    return null;
  }

  // Inner content shared between dialog and inline modes
  const innerContent = (
    <div className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{labels.orderForm}</h2>
        {inline && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {language === 'fr' ? 'Retour' : '\u0627\u0631\u062c\u0639'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Order Summary */}
        <div>
          <h3 className="font-semibold mb-4">{labels.orderSummary}</h3>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor}`} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.product.name[language]}
                  {item.selectedColor && (
                    <span className="text-muted-foreground"> - {item.selectedColor}</span>
                  )}
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.firstName}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.lastName}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email invalide'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.email}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
              name="address"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.address}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.city}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.postalCode}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <FormLabel>{labels.notes}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {labels.submitOrder}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );

  if (inline) {
    return innerContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          {labels.submitOrder}
        </Button>
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