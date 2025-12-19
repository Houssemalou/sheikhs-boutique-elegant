import { FileText, Download, Shield, RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';

export function PoliciesSection() {
  const { t, i18n } = useTranslation();

  const handleDownloadPolicy = () => {
    const doc = new jsPDF();
    
    // Configuration
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    const lineHeight = 7;
    let yPosition = 20;

    // Helper function pour ajouter du texte avec gestion de position
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        const textWidth = doc.getTextWidth(line);
        let xPosition = margin;
        
        if (align === 'center') {
          xPosition = (pageWidth - textWidth) / 2;
        } else if (align === 'right') {
          xPosition = pageWidth - margin - textWidth;
        }
        
        doc.text(line, xPosition, yPosition);
        yPosition += lineHeight;
      });
    };

    const addSection = (title: string, content: string[]) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }
      yPosition += 5;
      addText(title, 14, true);
      yPosition += 2;
      content.forEach(line => {
        if (line.trim()) {
          addText(line, 10);
        } else {
          yPosition += 3;
        }
      });
    };

    // En-tête avec logo (texte)
    addText('ARDA STORE', 24, true, 'center');
    yPosition += 2;
    
    // Informations de l'entreprise
    addText('Commercial Registration (CR): 24441', 11, false, 'center');
    addText('Applicable in the State of Qatar', 10, false, 'center');
    yPosition += 5;

    // Date
    const currentDate = new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    addText(`Date: ${currentDate}`, 9, false, 'right');
    yPosition += 5;

    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Termes et Conditions
    addSection(
      'TERMS & CONDITIONS',
      [
        'By using Arda Store\'s website or completing a purchase, you agree to these Terms & Conditions.',
        '',
        'Users must provide accurate information and use the website lawfully. Arda Store reserves the right to modify these terms or discontinue products at any time without prior notice.',
        '',
        'These terms are governed by the laws of the State of Qatar. Users are responsible for ensuring lawful use of the website and compliance with all applicable regulations.'
      ]
    );

    // Politique de confidentialité
    addSection(
      'PRIVACY POLICY',
      [
        'Arda Store is committed to protecting customer privacy and handling personal data with the utmost care.',
        '',
        'Personal data is collected solely for order processing and service improvement purposes. We do not share your personal information with third parties except as required by law or for shipping purposes within Qatar.',
        '',
        'All customer data is stored securely and protected against unauthorized access. We comply with all applicable data protection regulations in the State of Qatar.'
      ]
    );

    // Politique de retour et d'échange
    addSection(
      'RETURN & EXCHANGE POLICY',
      [
        'Customer satisfaction is our priority. We offer a fair and transparent return and exchange policy.',
        '',
        'Customers may request a return or exchange within 24 hours of delivery, provided the item is unused, undamaged, and in its original packaging with all tags attached.',
        '',
        'To initiate a return or exchange, please contact our customer service team. Products damaged due to misuse, normal wear and tear, or improper handling are not covered by this policy.',
        '',
        'Refunds will be processed within 3-5 business days after the returned item is received and inspected.'
      ]
    );

    // Section Contact
    addSection(
      'CONTACT INFORMATION',
      [
        'For any questions, concerns, or support regarding our policies, please contact us:',
        '',
        'Email: ardastore598@gmail.com',
        'Phone: +974 7033 6561',
        'WhatsApp: +974 7033 6561',
        'Address: Doha, Qatar',
        '',
        'Customer Service Hours: Available 24/7'
      ]
    );

    // Pied de page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footerY = pageHeight - 20;
      
      doc.setLineWidth(0.3);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('ARDA Store - Your trusted destination for quality products', pageWidth / 2, footerY, { align: 'center' });
      
      doc.setFontSize(7);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY + 5, { align: 'right' });
      doc.text('© 2025 ARDA Store. All rights reserved.', margin, footerY + 5);
    }

    // Télécharger le PDF
    doc.save('Arda_Store_Policies.pdf');
  };

  const policies = [
    {
      icon: Shield,
      title: t('policies.terms_title'),
      description: t('policies.terms_desc'),
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      icon: Lock,
      title: t('policies.privacy_title'),
      description: t('policies.privacy_desc'),
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600'
    },
    {
      icon: RefreshCw,
      title: t('policies.return_title'),
      description: t('policies.return_desc'),
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-6 animate-bounce">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('policies.main_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('policies.subtitle')}
          </p>
        </div>

        {/* Policies Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {policies.map((policy, index) => {
            const Icon = policy.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${policy.color} flex items-center justify-center mb-4 animate-pulse`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{policy.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {policy.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Commercial Registration Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 mb-8 border-2 border-blue-200 dark:border-blue-800 animate-in fade-in zoom-in duration-700 delay-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Arda Store – أردا متجر</h3>
              <p className="text-muted-foreground mb-1">
                <strong>Commercial Registration (CR):</strong> 24441 <br />
                <strong>Commercial Registration (CR):</strong> 13647
              </p>
              <p className="text-sm text-muted-foreground">
                Applicable in the State of Qatar – فقط قطر – لن يكون للبيع
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="/arda-logo.svg" 
                alt="Arda Store Logo" 
                className="h-20 w-auto opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center animate-in fade-in zoom-in duration-700 delay-700">
          <Button
            onClick={handleDownloadPolicy}
            size="lg"
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <Download className="h-5 w-5 mr-3 group-hover:animate-bounce" />
            {t('policies.download_button')}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            {t('policies.download_info')}
          </p>
        </div>
      </div>
    </section>
  );
}
