import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Compass, Mountain, Sparkles } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

export function CinematicHero() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      if (window.scrollY < window.innerHeight) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Cinematic background with parallax */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 will-change-transform transition-transform duration-300"
          style={{
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0002})`,
          }}
        >
          <OptimizedImage
            src="https://images.pexels.com/photos/2400408/pexels-photo-2400408.jpeg"
            alt="San Ignacio Mountains"
            className="w-full h-full"
            priority={true}
            quality="high"
          />
        </div>

        {/* Premium overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

        {/* Accent light elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
        {/* Top badge */}
        <div
          className={`inline-flex items-center gap-2 glass-dark text-white px-6 py-3 rounded-full mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="font-semibold">Destino Premium de Montaña</span>
        </div>

        {/* Main heading */}
        <div
          className={`transition-all duration-700 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight tracking-tighter">
            Descubre{' '}
            <span className="text-gradient-premium">San Ignacio</span>
          </h1>
        </div>

        {/* Subtitle with emphasis */}
        <div
          className={`transition-all duration-700 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Tierra de{' '}
            <span className="font-semibold text-emerald-300">lagunas cristalinas</span>, cataratas
            impresionantes y el{' '}
            <span className="font-semibold text-amber-300">mejor café del mundo</span>. Donde la naturaleza
            abraza la aventura.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 transition-all duration-700 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <Link
            to="/atractivos"
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg overflow-hidden shadow-premium-lg transition-all duration-300 hover:shadow-premium-xl hover:scale-105 flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Mountain className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Explorar Destinos</span>
          </Link>

          <Link
            to="/informacion"
            className="group relative px-8 py-4 glass-premium text-stone-900 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-premium-lg hover:backdrop-blur-2xl flex items-center gap-3"
          >
            <Compass className="w-6 h-6" />
            <span>Planificar Viaje</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-700 transform ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          {[
            { number: '8+', label: 'Atractivos', icon: '🏔️' },
            { number: '1500m', label: 'Altitud', icon: '📍' },
            { number: '15°C', label: 'Clima', icon: '🌡️' },
            { number: '365', label: 'Abierto', icon: '📅' },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-dark text-white rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform"
              style={{
                animationDelay: `${1200 + index * 100}ms`,
              }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">{stat.number}</div>
              <div className="text-white/70 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1400ms' }}
      >
        <div className="flex flex-col items-center gap-2 animate-float">
          <div className="text-white/50 text-sm font-medium">Desliza para explorar</div>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 hover:border-white/50 transition-colors cursor-pointer">
            <ChevronDown className="w-4 h-4 text-white/50 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
