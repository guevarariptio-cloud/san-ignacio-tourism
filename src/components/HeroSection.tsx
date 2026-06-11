import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin, ChevronDown } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '8+', label: 'Atractivos', icon: Mountain },
    { value: '1500msnm', label: 'Altitud', icon: MapPin },
    { value: '15°C', label: 'Promedio', icon: '🌡️' },
    { value: '365', label: 'Días de visita', icon: '📅' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background with parallax */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-transform duration-300 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <OptimizedImage
            src="https://images.pexels.com/photos/2400408/pexels-photo-2400408.jpeg"
            alt="San Ignacio"
            className="w-full h-full"
            priority={true}
            quality="high"
          />
        </div>

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.7) 100%)',
            opacity: isLoaded ? 1 : 0.8,
          }}
        />

        {/* Accent lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
        {/* Location badge with animation */}
        <div
          className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{
            transitionDelay: '200ms',
          }}
        >
          <MapPin className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-white/90 font-semibold">
            Cajamarca, Perú
          </span>
        </div>

        {/* Main heading with staggered animation */}
        <div
          className={`transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: '400ms',
          }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
            Descubre{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 animate-pulse">
                San Ignacio
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full scale-x-0 animate-expand" />
            </span>
          </h1>
        </div>

        {/* Subtitle with fade-in */}
        <div
          className={`transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: '600ms',
          }}
        >
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Tierra de{' '}
            <span className="font-semibold text-emerald-300">
              lagunas cristalinas
            </span>
            , cataratas impresionantes y el{' '}
            <span className="font-semibold text-emerald-300">
              mejor café del mundo
            </span>
            . Tu aventura comienza aquí.
          </p>
        </div>

        {/* CTA Buttons with staggered animation */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: '800ms',
          }}
        >
          <Link
            to="/atractivos"
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Mountain className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Explorar Atractivos</span>
          </Link>

          <Link
            to="/informacion"
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Planifica tu Viaje</span>
          </Link>
        </div>

        {/* Stats with staggered animation */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDelay: '1000ms',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 group transition-all duration-500 hover:bg-white/10 hover:border-white/20 transform hover:scale-105 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${1200 + index * 100}ms`,
              }}
            >
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-2">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionDelay: '1400ms',
        }}
      >
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="text-white/50 text-sm font-medium group-hover:text-white/70 transition-colors">
            Desliza para más
          </div>
          <div className="relative w-6 h-10 border-2 border-white/30 rounded-full group-hover:border-white/50 transition-colors overflow-hidden">
            <ChevronDown
              className="w-4 h-4 text-white/50 absolute top-1 left-1/2 transform -translate-x-1/2 animate-bounce"
              style={{
                animationDuration: '2s',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
