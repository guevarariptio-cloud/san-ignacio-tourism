import { useEffect, useState } from 'react';
import { Mountain } from 'lucide-react';

export function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  const [show, setShow] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
    setShow(true);
  }, [isLoading]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full filter blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl">
            <Mountain className="w-12 h-12 text-white animate-bounce" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 font-display">
            San Ignacio
          </h2>
          <p className="text-white/60 text-sm tracking-widest">
            PREPARANDO TU AVENTURA
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
            style={{
              animation: 'slideRight 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Decorative dots */}
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
