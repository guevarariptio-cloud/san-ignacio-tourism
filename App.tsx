import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Mountain,
  Coffee,
  MapPin,
  Calendar,
  Utensils,
  Building,
  Menu,
  X,
  Home,
  Camera,
  Droplets,
  Landmark,
  Route as RouteIcon,
  Star,
  Phone,
  Clock,
  Sun,
  Shield,
  Heart,
  Plane,
  Car,
  Backpack,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Settings,
  Sparkles,
} from 'lucide-react';
import { OptimizedImage } from './components/OptimizedImage';
import { AdminImageManager } from './components/AdminImageManager';
import { CinematicHero } from './components/CinematicHero';
import { Navbar } from './components/Navbar';
import { ImageCarousel } from './components/ImageCarousel';
import { TouristMap } from './components/TouristMap';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Types
interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
  short_description: string;
  image_url: string;
  location: string;
  activities: string[];
  difficulty: string;
  best_time: string;
  tips: string[];
  featured: boolean;
  rating: number;
}

interface Business {
  id: string;
  name: string;
  type: string;
  description: string;
  image_url: string;
  address: string;
  phone: string;
  services: string[];
  price_range: string;
  rating: number;
  featured: boolean;
}

interface Gastronomy {
  id: string;
  name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  type: string;
}

interface Festival {
  id: string;
  name: string;
  description: string;
  date: string;
  activities: string[];
  image_url: string;
}

interface PracticalInfo {
  id: string;
  category: string;
  title: string;
  content: string;
  icon: string;
}

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  laguna: { icon: Droplets, color: 'from-blue-500 to-cyan-500', label: 'Lagunas' },
  catarata: { icon: Mountain, color: 'from-teal-500 to-green-500', label: 'Cataratas' },
  mirador: { icon: Camera, color: 'from-amber-500 to-orange-500', label: 'Miradores' },
  arqueologico: { icon: Landmark, color: 'from-rose-500 to-pink-500', label: 'Arqueológico' },
  ruta: { icon: RouteIcon, color: 'from-emerald-500 to-teal-500', label: 'Rutas' },
  otros: { icon: MapPin, color: 'from-slate-500 to-gray-500', label: 'Otros' },
};

const businessConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  hospedaje: { icon: Building, color: 'from-indigo-500 to-blue-500', label: 'Hospedaje' },
  restaurante: { icon: Utensils, color: 'from-orange-500 to-red-500', label: 'Restaurantes' },
  cafe: { icon: Coffee, color: 'from-amber-600 to-yellow-500', label: 'Cafeterías' },
  tour: { icon: MapPin, color: 'from-green-500 to-emerald-500', label: 'Tours' },
  artesanía: { icon: Star, color: 'from-purple-500 to-pink-500', label: 'Artesanías' },
};

const iconMap: Record<string, React.ElementType> = {
  Sun,
  Shield,
  Heart,
  Plane,
  Car,
  Backpack,
  Sparkles,
};

// Types and Components
function Hero() {
  return <CinematicHero />;
}

function FeaturedSection() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  useEffect(() => {
    supabase
      .from('attractions')
      .select('*')
      .eq('featured', true)
      .order('rating', { ascending: false })
      .then(({ data }) => {
        if (data) setAttractions(data);
      });
  }, []);

  if (attractions.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-stone-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-premium-accent">Destacados</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-premium-dark mb-4 font-display">
            Atractivos que no te puedes perder
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Descubre los lugares más espectaculares que San Ignacio ofrece a los viajeros aventureros
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.slice(0, 3).map((attraction, idx) => (
            <Link
              key={attraction.id}
              to={`/atractivos/${attraction.id}`}
              className="group relative overflow-hidden card-premium hover-lift animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Image container */}
              <div className="aspect-video overflow-hidden relative">
                <OptimizedImage
                  src={attraction.image_url}
                  alt={attraction.name}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality="medium"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Badge and rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 glass-dark text-white text-xs font-semibold rounded-lg">
                    {categoryConfig[attraction.category]?.label || attraction.category}
                  </span>
                  <div className="flex items-center gap-1 glass-dark text-white px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-semibold">{attraction.rating}</span>
                  </div>
                </div>

                {/* Title and description */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {attraction.name}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2 mb-4">
                  {attraction.short_description}
                </p>

                {/* Hover action */}
                <div className="flex items-center gap-2 text-emerald-300 group-hover:text-emerald-200 transition-all">
                  <span className="text-sm font-semibold">Explorar</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link
            to="/atractivos"
            className="inline-flex items-center gap-2 btn-premium-primary shadow-premium-xl hover:shadow-premium-xl"
          >
            Ver todos los atractivos
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Droplets,
      title: 'Lagunas Cristalinas',
      description: 'Laguna Faical y Azul, aguas de colores únicos ideales para camping y fotografía.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mountain,
      title: 'Cataratas Impresionantes',
      description: 'Las Malvinas y La Libertad, caídas de agua rodeadas de naturaleza tropical.',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Camera,
      title: 'Miradores Panorámicos',
      description: 'Cerro Campana con vistas espectaculares del valle del Chinchipe.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Coffee,
      title: 'Ruta del Café',
      description: 'Conoce el proceso del café premiado internacionalmente de San Ignacio.',
      color: 'from-amber-600 to-yellow-500',
    },
    {
      icon: Landmark,
      title: 'Patrimonio Cultural',
      description: 'Pinturas rupestres prehistóricas que cuentan la historia ancestral.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Utensils,
      title: 'Gastronomía Única',
      description: 'Platos cajamarquinos y amazónicos con ingredientes locales.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experiencias Únicas
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre todo lo que San Ignacio tiene para ofrecerte
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('attractions')
      .select('*')
      .order('rating', { ascending: false })
      .then(({ data }) => {
        if (data) setAttractions(data);
        setLoading(false);
      });
  }, []);

  const filteredAttractions = activeCategory
    ? attractions.filter((a) => a.category === activeCategory)
    : attractions;

  const categories = Object.keys(categoryConfig);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-white pt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6">
            <Mountain className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-premium-accent">Explora</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-premium-dark mb-4 font-display">
            Atractivos Turísticos
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Descubre los tesoros naturales y culturales de San Ignacio
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in-up">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeCategory === null
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-premium-lg hover:shadow-premium-xl'
                : 'glass-light text-premium-dark hover:bg-white/70'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const Icon = config.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat
                    ? `bg-gradient-to-r ${config.color} text-white shadow-premium-lg hover:shadow-premium-xl`
                    : 'glass-light text-premium-dark hover:bg-white/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-64 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions.map((attraction, idx) => {
              const config = categoryConfig[attraction.category];
              const Icon = config?.icon || MapPin;
              return (
                <Link
                  key={attraction.id}
                  to={`/atractivos/${attraction.id}`}
                  className="group relative overflow-hidden card-premium hover-lift animate-fade-in-up card-stagger-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <OptimizedImage
                      src={attraction.image_url}
                      alt={attraction.name}
                      className="w-full h-full image-hover-scale"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality="medium"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="glass-dark text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {config?.label || attraction.category}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="glass-dark text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        {attraction.rating}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {attraction.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 mb-3">
                      {attraction.short_description}
                    </p>
                    <div className="flex items-center gap-2 text-emerald-300 group-hover:text-emerald-200 transition-all">
                      <span className="text-sm font-semibold">Explorar</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AttractionDetail() {
  const { id } = useParams();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('attractions')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setAttraction(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Cargando experiencia...</p>
        </div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">Atractivo no encontrado</p>
          <Link to="/atractivos" className="btn-premium-primary mt-6 inline-flex">
            Volver a atractivos
          </Link>
        </div>
      </div>
    );
  }

  const config = categoryConfig[attraction.category];
  const galleryImages = attraction.gallery && attraction.gallery.length > 0
    ? attraction.gallery
    : [attraction.image_url, ...Array(4).fill(attraction.image_url)];

  const openMapsDirection = () => {
    if (attraction.latitude && attraction.longitude) {
      const url = `https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* Back navigation */}
      <div className="fixed top-20 left-4 z-20">
        <Link
          to="/atractivos"
          className="inline-flex items-center gap-2 glass-dark hover:bg-white/20 transition-all rounded-full px-4 py-2"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
          <span className="text-white font-medium text-sm">Atrás</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="pt-24 pb-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Header section */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className={`bg-gradient-to-br ${config?.color} rounded-xl p-3`}>
                {config?.icon && <config.icon className="w-6 h-6 text-white" />}
              </div>
              <span className="text-sm font-bold text-premium-accent uppercase tracking-wide">
                {config?.label || attraction.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-premium-dark mb-4 font-display leading-tight">
              {attraction.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-base md:text-lg text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>{attraction.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(attraction.rating) ? 'fill-current text-yellow-400' : 'text-yellow-200'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{attraction.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Gallery section */}
          <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <ImageCarousel images={galleryImages} title={attraction.name} />
          </div>

          {/* Content grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="glass-premium rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold text-premium-dark mb-4">Descripción</h2>
                <p className="text-lg text-stone-700 leading-relaxed">
                  {attraction.description}
                </p>
              </div>

              {/* Activities */}
              {attraction.activities && attraction.activities.length > 0 && (
                <div className="glass-premium rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <h3 className="text-2xl font-bold text-premium-dark mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                    Actividades turísticas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {attraction.activities.map((activity, i) => (
                      <div key={i} className="glass-light rounded-xl px-4 py-3 text-center font-medium text-premium-dark hover:bg-white/60 transition-all">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {attraction.tips && attraction.tips.length > 0 && (
                <div className="glass-premium rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-2xl font-bold text-premium-dark mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    Consejos útiles
                  </h3>
                  <div className="space-y-4">
                    {attraction.tips.map((tip, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-sm">✓</span>
                        </div>
                        <p className="text-stone-700 pt-0.5">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Info cards */}
            <div className="space-y-8">
              {/* Best time */}
              {attraction.best_time && (
                <div className="glass-premium rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <h4 className="text-lg font-bold text-premium-dark mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Mejor época
                  </h4>
                  <p className="text-stone-700 font-medium">{attraction.best_time}</p>
                </div>
              )}

              {/* Difficulty */}
              {attraction.difficulty && (
                <div className="glass-premium rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <h4 className="text-lg font-bold text-premium-dark mb-3 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-emerald-600" />
                    Dificultad
                  </h4>
                  <div className={`inline-block px-4 py-2 rounded-lg font-bold text-white ${
                    attraction.difficulty === 'facil' ? 'bg-green-500' :
                    attraction.difficulty === 'moderado' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {attraction.difficulty.charAt(0).toUpperCase() + attraction.difficulty.slice(1)}
                  </div>
                </div>
              )}

              {/* CTA - How to get there */}
              <div className="glass-premium rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <button
                  onClick={openMapsDirection}
                  className="w-full btn-premium-primary flex items-center justify-center gap-2 group"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Cómo llegar</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <Link to="/atractivos" className="btn-premium-primary flex items-center justify-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              Ver más atractivos
            </Link>
            <Link to="/hospedajes" className="btn-premium-secondary flex items-center justify-center gap-2">
              <Building className="w-5 h-5" />
              Buscar hospedajes
            </Link>
            <a href="tel:+51" className="btn-premium-secondary flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function GastronomyPage() {
  const [gastronomy, setGastronomy] = useState<Gastronomy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('gastronomy')
      .select('*')
      .then(({ data }) => {
        if (data) setGastronomy(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-white pt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6">
            <Coffee className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-semibold text-amber-900">Sabores Únicos</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-premium-dark mb-4 font-display">
            Gastronomía Local
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Descubre los sabores únicos de Cajamarca y la Amazonía en cada plato
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gradient-to-r from-amber-200 to-amber-300 h-64 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gastronomy.map((item, idx) => {
              const typeConfig = {
                plato_principal: { label: 'Plato Principal', color: 'from-rose-500 to-red-500' },
                bebida: { label: 'Bebida', color: 'from-blue-500 to-cyan-500' },
                entrada: { label: 'Entrada', color: 'from-green-500 to-emerald-500' },
              };
              const type = typeConfig[item.type as keyof typeof typeConfig] || { label: 'Producto', color: 'from-amber-600 to-amber-700' };

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden card-premium hover-lift animate-fade-in-up card-stagger-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <OptimizedImage
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full image-hover-scale"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality="medium"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`bg-gradient-to-r ${type.color} text-white text-xs font-bold px-4 py-2 rounded-lg`}>
                        {type.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    {/* Ingredients preview */}
                    {item.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.ingredients.slice(0, 3).map((ing, i) => (
                          <span key={i} className="glass-dark text-white text-xs px-2 py-1 rounded">
                            {ing}
                          </span>
                        ))}
                        {item.ingredients.length > 3 && (
                          <span className="glass-dark text-white text-xs px-2 py-1 rounded">
                            +{item.ingredients.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-amber-300 group-hover:text-amber-200 transition-all">
                      <span className="text-sm font-semibold">Descubre más</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('businesses')
      .select('*')
      .order('rating', { ascending: false })
      .then(({ data }) => {
        if (data) setBusinesses(data);
        setLoading(false);
      });
  }, []);

  const filteredBusinesses = activeType
    ? businesses.filter((b) => b.type === activeType)
    : businesses;

  const types = Object.keys(businessConfig);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-blue-50/20 to-white pt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Tu Comodidad</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-premium-dark mb-4 font-display">
            Hospedajes y Servicios
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Todo lo que necesitas para una experiencia inolvidable en San Ignacio
          </p>
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in-up">
          <button
            onClick={() => setActiveType(null)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeType === null
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-premium-lg hover:shadow-premium-xl'
                : 'glass-light text-premium-dark hover:bg-white/70'
            }`}
          >
            Todos
          </button>
          {types.map((type) => {
            const config = businessConfig[type];
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeType === type
                    ? `bg-gradient-to-r ${config.color} text-white shadow-premium-lg hover:shadow-premium-xl`
                    : 'glass-light text-premium-dark hover:bg-white/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gradient-to-r from-blue-200 to-indigo-200 h-64 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business, idx) => {
              const config = businessConfig[business.type];
              const Icon = config?.icon || Building;
              return (
                <div
                  key={business.id}
                  className="group relative overflow-hidden card-premium hover-lift animate-fade-in-up card-stagger-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <OptimizedImage
                      src={business.image_url}
                      alt={business.name}
                      className="w-full h-full image-hover-scale"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality="medium"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-4 py-2 bg-gradient-to-r ${config?.color} text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg`}>
                        <Icon className="w-4 h-4" />
                        {config?.label || business.type}
                      </span>
                    </div>

                    {/* Featured badge */}
                    {business.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg">
                          <Star className="w-4 h-4 fill-current" />
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {business.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(business.rating) ? 'fill-current text-yellow-400' : 'text-white/30'}`}
                        />
                      ))}
                      <span className="text-white/80 text-sm ml-2">({business.rating})</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-white/80 text-sm mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                      <span className="line-clamp-1">{business.address}</span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-emerald-300 group-hover:text-emerald-200 transition-all">
                      <span className="text-sm font-semibold">Explorar</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('festivals')
      .select('*')
      .then(({ data }) => {
        if (data) setFestivals(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Festividades
          </h1>
          <p className="text-gray-600 text-lg">
            Celebra con nosotros las tradiciones de San Ignacio
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {festivals.map((festival) => (
              <div
                key={festival.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <div className="relative h-64 md:h-full">
                      <OptimizedImage
                        src={festival.image_url}
                        alt={festival.name}
                        className="w-full h-full absolute inset-0"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        quality="medium"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                          <Calendar className="w-5 h-5 text-rose-500" />
                          <span className="font-bold text-gray-900">{festival.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {festival.name}
                    </h2>
                    <p className="text-gray-600 mb-6">{festival.description}</p>

                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-3">
                        Actividades:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {festival.activities.map((activity, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg font-medium text-sm"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPage() {
  const [info, setInfo] = useState<PracticalInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('practical_info')
      .select('*')
      .then(({ data }) => {
        if (data) setInfo(data);
        setLoading(false);
      });
  }, []);

  const categoryColors: Record<string, string> = {
    clima: 'from-amber-500 to-orange-500',
    transporte: 'from-blue-500 to-cyan-500',
    tips: 'from-emerald-500 to-teal-500',
    seguridad: 'from-rose-500 to-pink-500',
    salud: 'from-red-500 to-rose-500',
  };

  const groupedInfo = info.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PracticalInfo[]>);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Información Práctica
          </h1>
          <p className="text-gray-600 text-lg">
            Todo lo que necesitas saber para tu viaje a San Ignacio
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-24 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedInfo).map(([category, items]) => {
              const color = categoryColors[category] || 'from-gray-500 to-slate-500';
              return (
                <div key={category}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                      {iconMap[items[0]?.icon] && (() => {
                        const Icon = iconMap[items[0].icon];
                        return <Icon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const Icon = iconMap[item.icon] || MapPin;
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-600">{item.content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Administrador de Imágenes
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Actualiza las imágenes de atractivos, negocios y gastronomía
          </p>
        </div>
        <AdminImageManager />
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedSection />
      <FeaturesSection />
      <TouristMap />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/atractivos" element={<AttractionsPage />} />
          <Route path="/atractivos/:id" element={<AttractionDetail />} />
          <Route path="/gastronomia" element={<GastronomyPage />} />
          <Route path="/hospedajes" element={<BusinessesPage />} />
          <Route path="/festividades" element={<FestivalsPage />} />
          <Route path="/informacion" element={<InfoPage />} />
          <Route path="/admin/imagenes" element={<AdminPage />} />
        </Routes>

        {/* Premium Footer */}
        <footer className="relative bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 overflow-hidden">
          {/* Accent lights */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            {/* Main footer content */}
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-premium">
                    <Mountain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gradient-premium">San Ignacio</h3>
                    <p className="text-xs text-white/60">Cajamarca, Perú</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  Descubre los tesoros naturales, culturales y culinarios de San Ignacio. Donde la aventura y la naturaleza se encuentran.
                </p>
              </div>

              {/* Explorar */}
              <div>
                <h4 className="font-bold mb-6 text-gradient-premium">Explorar</h4>
                <ul className="space-y-3 text-white/70 text-sm">
                  <li>
                    <Link to="/atractivos" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
                      ↗ Atractivos
                    </Link>
                  </li>
                  <li>
                    <Link to="/gastronomia" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
                      ↗ Gastronomía
                    </Link>
                  </li>
                  <li>
                    <Link to="/hospedajes" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
                      ↗ Hospedajes
                    </Link>
                  </li>
                  <li>
                    <Link to="/festividades" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
                      ↗ Festividades
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Información */}
              <div>
                <h4 className="font-bold mb-6 text-gradient-premium">Información</h4>
                <ul className="space-y-3 text-white/70 text-sm">
                  <li>
                    <Link to="/informacion" className="hover:text-emerald-400 transition-colors duration-300 font-medium">
                      Guía del Viajero
                    </Link>
                  </li>
                  <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer font-medium">
                    Cómo Llegar
                  </li>
                  <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer font-medium">
                    Clima
                  </li>
                  <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer font-medium">
                    Seguridad
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="font-bold mb-6 text-gradient-premium">Contacto</h4>
                <ul className="space-y-3 text-white/70 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>San Ignacio, Cajamarca, Perú</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sun className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Disponible todo el año</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Turismo sostenible y responsable</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-12" />

            {/* Bottom footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-white/60 text-sm font-light">
                © 2024 San Ignacio Turístico. Promocionando el turismo responsable en Cajamarca.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Privacidad
                </a>
                <a href="#" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Términos
                </a>
                <a href="#" className="text-white/60 hover:text-emerald-400 transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
