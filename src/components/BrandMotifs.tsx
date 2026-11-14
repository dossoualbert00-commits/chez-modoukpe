import { ReactNode } from 'react';
import { Plane } from 'lucide-react';

export function ModoukpeLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 shrink-0 select-none ${
        inverted ? 'bg-white px-3.5 py-2 rounded-xl shadow-xs' : ''
      }`}
    >
      {/* Crisp Vector Reproduction of Chez Modoukpè Logo */}
      <svg
        viewBox="0 0 320 76"
        className="h-10 sm:h-11 w-auto block"
        role="img"
        aria-label="Chez Modoukpè — Import-Export, Dermocosmétique & Surprise Agency"
      >
        {/* Decorative orange dots left */}
        <circle cx="9" cy="16" r="2.8" fill="#F25C19" />
        <circle cx="17" cy="24" r="4.8" fill="#F25C19" />
        <circle cx="9" cy="30" r="2" fill="#FBBF24" />

        {/* Shopping Bag Handles (Deep Navy) */}
        <path
          d="M36 22C33 11 40 6 45 14"
          stroke="#0B2E59"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M47 20C46 8 55 5 59 17"
          stroke="#0B2E59"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Orange Shopping Bag */}
        <path
          d="M30 22L64 16L74 54L36 62L30 22Z"
          fill="#F25C19"
        />
        <path
          d="M64 16L74 54L66 56L58 17.5Z"
          fill="#D9480F"
        />

        {/* White Spark / Burst inside bag */}
        <g stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round">
          <line x1="51" y1="27" x2="51" y2="32" />
          <line x1="44" y1="30" x2="47" y2="34" />
          <line x1="58" y1="30" x2="55" y2="34" />
          <line x1="42" y1="37" x2="46" y2="37" />
        </g>

        {/* Sky-blue Shopper Silhouette with small bag */}
        <circle cx="29" cy="28" r="6.2" fill="#0099E5" />
        <path
          d="M20 44C21 37 26 34 31 35C36 36 40 41 42 47L33 65H26L21 51L14 45L19 41Z"
          fill="#0099E5"
        />
        {/* Small blue bag in hand */}
        <path d="M8 46H19L20 58H7L8 46Z" fill="#0099E5" />
        <path
          d="M11 46C11 42.5 16 42.5 16 46"
          stroke="#0B2E59"
          strokeWidth="1.6"
          fill="none"
        />

        {/* White Click Pointer Hand */}
        <path
          d="M55 37L66 42L62 45L67 51L63 54L58 48L55 52Z"
          fill="#FFFFFF"
          stroke="#0B2E59"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* "Chez" in Bold Italic Mandarine Orange */}
        <text
          x="84"
          y="29"
          fill="#F25C19"
          fontFamily="Montserrat, Plus Jakarta Sans, sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="21"
          letterSpacing="-0.5"
        >
          Chez
        </text>

        {/* 3 Sky-blue Speed Bars next to "Chez" */}
        <rect x="148" y="10" width="38" height="4.2" rx="2.1" fill="#0099E5" />
        <rect x="158" y="17.5" width="44" height="4.2" rx="2.1" fill="#0099E5" />
        <rect x="151" y="25" width="36" height="4.2" rx="2.1" fill="#0099E5" />

        {/* "Modoukpè" in Heavy Italic Sky Blue */}
        <text
          x="82"
          y="55"
          fill="#0099E5"
          fontFamily="Montserrat, Plus Jakarta Sans, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="31"
          letterSpacing="-0.8"
        >
          Modoukpè
        </text>

        {/* Crisp Tagline */}
        <text
          x="84"
          y="69"
          fill="#F25C19"
          fontFamily="Montserrat, Plus Jakarta Sans, sans-serif"
          fontWeight="700"
          fontSize="7.4"
          letterSpacing="0.55"
        >
          IMPORT-EXPORT • DERMOCOSMÉTIQUE • SURPRISE AGENCY
        </text>
      </svg>
    </span>
  );
}

export function LogoSpeedBars({ className = '' }: { className?: string }) {
  return (
    <svg
      width="44"
      height="18"
      viewBox="0 0 44 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect x="0" y="1" width="32" height="3.5" rx="1.75" fill="#0099E5" />
      <rect x="6" y="7.2" width="38" height="3.5" rx="1.75" fill="#0099E5" />
      <rect x="2" y="13.4" width="28" height="3.5" rx="1.75" fill="#F25C19" />
    </svg>
  );
}

export function BrushStrokeUnderline({
  color = 'orange',
  className = '',
}: {
  color?: 'orange' | 'blue';
  className?: string;
}) {
  const strokeColor = color === 'orange' ? '#F25C19' : '#0099E5';
  return (
    <svg
      viewBox="0 0 240 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`w-full h-3.5 ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M3 10.5C58 4.2 146 2.8 237 8.5"
        stroke={strokeColor}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.92"
      />
      <path
        d="M16 13.5C78 9.2 152 8.8 214 12.2"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function BrushTitle({
  children,
  accent = 'orange',
  className = '',
}: {
  children: ReactNode;
  accent?: 'orange' | 'blue';
  className?: string;
}) {
  const fill = accent === 'orange' ? '#F25C19' : '#0099E5';
  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 280 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="absolute -bottom-1 left-0 w-full h-4 pointer-events-none"
        preserveAspectRatio="none"
      >
        <path
          d="M4 21C78 12 192 10 276 19"
          stroke={fill}
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.22"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export function RoundBrandIcon({ children }: { children: ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-full bg-[#0099E5] text-white border-2 border-[#F25C19] flex items-center justify-center shrink-0">
      {children}
    </div>
  );
}

export function WaveDivider({
  fill = '#0B2E59',
  flip = false,
}: {
  fill?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${
        flip ? 'rotate-180' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 32C240 68 480 68 720 34C960 0 1200 2 1440 36V70H0V32Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function ImportExportGlobe() {
  return (
    <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
      <div
        className="absolute inset-2 rounded-full border border-dashed border-white/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="animate-orbit-plane">
          <div className="w-9 h-9 rounded-full bg-[#F25C19] text-white flex items-center justify-center shadow-md border-2 border-white">
            <Plane className="w-4 h-4" />
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 180 180"
        className="w-40 h-40 sm:w-44 sm:h-44 drop-shadow-lg"
        role="img"
        aria-label="Globe terrestre illustrant l'import-export entre le Bénin, le Niger et le monde"
      >
        <defs>
          <radialGradient id="globeGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#0099E5" />
            <stop offset="100%" stopColor="#0B2E59" />
          </radialGradient>
        </defs>
        <circle
          cx="90"
          cy="90"
          r="76"
          fill="url(#globeGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeOpacity="0.5"
        />
        <ellipse
          cx="90"
          cy="90"
          rx="40"
          ry="76"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <ellipse
          cx="90"
          cy="90"
          rx="76"
          ry="28"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <line
          x1="14"
          y1="90"
          x2="166"
          y2="90"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <line
          x1="90"
          y1="14"
          x2="90"
          y2="166"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <path
          d="M68 78C84 62 108 64 118 82"
          stroke="#F25C19"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          fill="none"
        />
        <circle cx="72" cy="82" r="5" fill="#F25C19" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="112" cy="76" r="5" fill="#F25C19" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    </div>
  );
}
