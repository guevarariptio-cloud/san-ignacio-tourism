import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Menu, X, MapPin, Compass } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Inicio', to: '/', icon: Mountain },
    { label: 'Atractivos', to: '/atractivos', icon: MapPin },
    { label: 'Gastronomía', to: '/gastronomia', icon: '🍴' },
    { label: 'Hospedajes', to: '/hospedajes', icon: '🏨' },
    { label: 'Festividades', to: '/festividades', icon: '🎉' },
    { label: 'Información', to: '/informacion', icon: Compass },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 glass-dark transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Navbar container */}
      <div className="relative max-w-7xl mx-auto px-4 py-4">
        {/* Desktop navbar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-bold text-premium-dark hover:text-premium-accent transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-premium transform group-hover:scale-110 transition-transform">
              <Mountain className="w-7 h-7 text-white" />
            </div>
            <span className="hidden sm:inline text-gradient-premium font-display">
              San Ignacio
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive(link.to)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-stone-600 hover:text-premium-dark hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-premium-dark transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute top-full left-4 right-4 mt-4 glass-premium rounded-2xl p-4 animate-scale-in">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-emerald-100 text-emerald-700 font-semibold'
                      : 'text-stone-600 hover:bg-white/50 hover:text-premium-dark'
                  }`}
                >
                  {typeof link.icon === 'string' ? (
                    <span className="text-xl">{link.icon}</span>
                  ) : (
                    <link.icon className="w-5 h-5" />
                  )}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
