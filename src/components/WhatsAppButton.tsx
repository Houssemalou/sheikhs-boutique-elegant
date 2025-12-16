import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhatsAppButton() {
  const phoneNumber = '+97470336561'; // Format international sans espaces
  const message = encodeURIComponent('Hello ARDA Store! I would like to inquire about your products.');
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 animate-bounce group"
      size="icon"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse"></span>
    </Button>
  );
}
