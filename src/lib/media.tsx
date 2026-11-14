import { useState } from 'react';
import { Package } from 'lucide-react';
import heroBoutique from '../assets/images/hero_modoukpe_boutique_1794692984434.jpg';
import imgDermo from '../assets/images/cat_dermocosmetique_1794692986284.jpg';
import imgElectro from '../assets/images/cat_electromenager_1794692986498.jpg';
import imgCustom from '../assets/images/cat_personnalises_1794692985725.jpg';
import imgImport from '../assets/images/cat_import_export_1794692986150.jpg';
import imgHomme from '../assets/images/cat_homme_1794692986287.jpg';
import imgFemme from '../assets/images/cat_femme_1794692986190.jpg';
import imgSurprise from '../assets/images/cat_surprise_agency_1794692986471.jpg';

export const HERO_IMAGE = heroBoutique;

export const ASSET_MAP: Record<string, string> = {
  'asset:hero': heroBoutique,
  'asset:dermocosmetique': imgDermo,
  'asset:electromenager': imgElectro,
  'asset:personnalises': imgCustom,
  'asset:importes': imgImport,
  'asset:homme': imgHomme,
  'asset:femme': imgFemme,
  'asset:cadeaux': imgSurprise,
};

export function resolveMediaUrl(imageUrl: string): string {
  if (!imageUrl) return imgImport;
  return ASSET_MAP[imageUrl] ?? imageUrl;
}

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, className = '', priority = false }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(src);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#F0F9FF] text-[#0B2E59] p-4 text-center ${className}`}
      >
        <Package className="w-8 h-8 text-[#0099E5] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
