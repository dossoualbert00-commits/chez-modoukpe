import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface FloatingWhatsAppProps {
  currentPath: string;
}

export function FloatingWhatsApp({ currentPath }: FloatingWhatsAppProps) {
  if (currentPath.startsWith('/admin')) return null;

  let contextMessage = 'Bonjour Chez Modoukpè, je souhaite commander ou obtenir un renseignement.';
  if (currentPath.startsWith('/import-export')) {
    contextMessage = 'Bonjour Chez Modoukpè, j’ai une demande Import-Export sur mesure.';
  } else if (currentPath.startsWith('/personnalisation')) {
    contextMessage = 'Bonjour Chez Modoukpè, je souhaite personnaliser des articles (mugs/textiles/goodies).';
  } else if (currentPath.startsWith('/surprise-agency')) {
    contextMessage = 'Bonjour Chez Modoukpè, je souhaite commander un coffret Surprise Agency.';
  }

  return (
    <a
      href={buildWhatsAppUrl(contextMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Chez Modoukpè sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 min-h-[48px] px-4 py-3 rounded-full bg-[#F25C19] hover:bg-[#D9480F] text-white font-semibold text-sm shadow-lg transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2E59]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
