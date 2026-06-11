import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Star, ExternalLink } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface MapAttraction {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category: string;
  latitude: number;
  longitude: number;
  rating: number;
  image_url: string;
}

const SAN_IGNACIO_CENTER: [number, number] = [-5.1375, -79.0083];
const DEFAULT_ZOOM = 13;

const categoryColors: Record<string, string> = {
  laguna: '#3b82f6',
  catarata: '#14b8a6',
  mirador: '#f59e0b',
  arqueologico: '#f43f5e',
  ruta: '#10b981',
  otros: '#64748b',
};

const categoryLabels: Record<string, string> = {
  laguna: 'Laguna',
  catarata: 'Catarata',
  mirador: 'Mirador',
  arqueologico: 'Arqueologico',
  ruta: 'Ruta',
  otros: 'Otro',
};

function createCustomIcon(category: string) {
  const color = categoryColors[category] || categoryColors.otros;

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28C32 7.16 24.84 0 16 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="15" r="8" fill="white" opacity="0.9"/>
      <circle cx="16" cy="15" r="5" fill="${color}"/>
    </svg>`;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44],
  });
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const handler = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handler);
    const timeout = setTimeout(handler, 200);

    return () => {
      window.removeEventListener('resize', handler);
      clearTimeout(timeout);
    };
  }, [map]);

  return null;
}

function FitBoundsHandler({ attractions }: { attractions: MapAttraction[] }) {
  const map = useMap();

  useEffect(() => {
    if (attractions.length > 0) {
      const validAttractions = attractions.filter(
        a => a.latitude !== 0 && a.longitude !== 0
      );
      if (validAttractions.length > 0) {
        const bounds = L.latLngBounds(
          validAttractions.map(a => [a.latitude, a.longitude] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [attractions, map]);

  return null;
}

function openGoogleMaps(lat: number, lng: number, name: string) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
}

export function TouristMap() {
  const [attractions, setAttractions] = useState<MapAttraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    supabase
      .from('attractions')
      .select('id, name, description, short_description, category, latitude, longitude, rating, image_url')
      .then(({ data }) => {
        if (data) {
          const mapped = data.map(a => ({
            ...a,
            latitude: Number(a.latitude),
            longitude: Number(a.longitude),
          }));
          setAttractions(mapped);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const filteredAttractions = selectedCategory
    ? attractions.filter(a => a.category === selectedCategory)
    : attractions;

  const validAttractions = filteredAttractions.filter(
    a => a.latitude !== 0 && a.longitude !== 0
  );

  const categories = [...new Set(attractions.map(a => a.category))];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-stone-50 to-emerald-50/20 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-teal-500/5 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-premium-accent">Ubicaciones</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-premium-dark mb-4 font-display">
            Mapa Turistico
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Explora todos los atractivos en el mapa interactivo y encuentra tu proxima aventura
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white/60 text-stone-700 hover:bg-white border border-stone-200'
            }`}
          >
            Todos ({attractions.filter(a => a.latitude !== 0).length})
          </button>
          {categories.map(cat => {
            const count = attractions.filter(
              a => a.category === cat && a.latitude !== 0 && a.longitude !== 0
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'text-white shadow-lg'
                    : 'bg-white/60 text-stone-700 hover:bg-white border border-stone-200'
                }`}
                style={selectedCategory === cat ? {
                  background: `linear-gradient(135deg, ${categoryColors[cat]}, ${categoryColors[cat]}dd)`,
                } : undefined}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                {categoryLabels[cat] || cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Map container */}
        <div className="relative rounded-2xl overflow-hidden shadow-premium-xl border border-white/50">
          {loading ? (
            <div className="w-full h-[500px] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
                <p className="text-stone-600 font-medium">Cargando mapa...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full h-[400px] md:h-[500px] lg:h-[550px]">
                {mapReady && (
                  <MapContainer
                    center={SAN_IGNACIO_CENTER}
                    zoom={DEFAULT_ZOOM}
                    scrollWheelZoom={true}
                    className="w-full h-full z-0"
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBoundsHandler attractions={validAttractions} />
                    <MapResizer />

                    {validAttractions.map(attraction => (
                      <Marker
                        key={attraction.id}
                        position={[attraction.latitude, attraction.longitude]}
                        icon={createCustomIcon(attraction.category)}
                      >
                        <Popup maxWidth={280} minWidth={220} className="custom-popup">
                          <div className="p-1">
                            {/* Image */}
                            {attraction.image_url && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                                <img
                                  src={attraction.image_url}
                                  alt={attraction.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2">
                                  <span
                                    className="text-white text-xs font-bold px-2 py-1 rounded-md"
                                    style={{ backgroundColor: categoryColors[attraction.category] }}
                                  >
                                    {categoryLabels[attraction.category] || attraction.category}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Name */}
                            <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">
                              {attraction.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(attraction.rating)
                                      ? 'fill-current text-yellow-400'
                                      : 'text-yellow-200'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {attraction.rating}/5
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
                              {attraction.short_description || attraction.description}
                            </p>

                            {/* Direction button */}
                            <button
                              onClick={() =>
                                openGoogleMaps(
                                  attraction.latitude,
                                  attraction.longitude,
                                  attraction.name
                                )
                              }
                              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
                            >
                              <Navigation className="w-4 h-4" />
                              Como llegar
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>

              {/* Map overlay info */}
              <div className="absolute top-4 right-4 z-[1000]">
                <div className="glass-premium rounded-xl px-4 py-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {validAttractions.length} lugares
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Attractions list below map */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {validAttractions.map(attraction => (
            <button
              key={attraction.id}
              onClick={() =>
                openGoogleMaps(attraction.latitude, attraction.longitude, attraction.name)
              }
              className="group bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-left border border-stone-100 hover:border-emerald-200"
            >
              <div className="flex items-start gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: categoryColors[attraction.category] }}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
                    {attraction.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {categoryLabels[attraction.category] || attraction.category}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
