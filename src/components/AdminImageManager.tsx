import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Mountain,
  Building,
  Utensils,
  ChevronDown,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { GalleryManager } from './GalleryManager';
import { ImageUpload } from './ImageUpload';
import { updateAttractionImage, updateBusinessImage, updateGastronomyImage } from '../lib/imageUpload';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AttractionItem {
  id: string;
  name: string;
  image_url: string;
  gallery: string[];
  description?: string;
  category?: string;
}

interface BusinessItem {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  type?: string;
}

interface GastronomyItem {
  id: string;
  name: string;
  image_url: string;
  description?: string;
}

type Item = AttractionItem | BusinessItem | GastronomyItem;

export function AdminImageManager() {
  const [attractions, setAttractions] = useState<AttractionItem[]>([]);
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [gastronomy, setGastronomy] = useState<GastronomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<'attraction' | 'business' | 'gastronomy' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'attraction' | 'business' | 'gastronomy'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'attraction' | 'business' | 'gastronomy' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [attractionsData, businessesData, gastronomyData] = await Promise.all([
        supabase.from('attractions').select('id, name, image_url, gallery, description, category'),
        supabase.from('businesses').select('id, name, image_url, description, type'),
        supabase.from('gastronomy').select('id, name, image_url, description'),
      ]);

      if (attractionsData.data) setAttractions(attractionsData.data);
      if (businessesData.data) setBusinesses(businessesData.data);
      if (gastronomyData.data) setGastronomy(gastronomyData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpdate(type: 'attraction' | 'business' | 'gastronomy', itemId: string, file: File) {
    try {
      if (type === 'attraction') {
        await updateAttractionImage(itemId, file);
        setAttractions(attractions.map(a =>
          a.id === itemId ? { ...a, image_url: URL.createObjectURL(file) } : a
        ));
      } else if (type === 'business') {
        await updateBusinessImage(itemId, file);
        setBusinesses(businesses.map(b =>
          b.id === itemId ? { ...b, image_url: URL.createObjectURL(file) } : b
        ));
      } else if (type === 'gastronomy') {
        await updateGastronomyImage(itemId, file);
        setGastronomy(gastronomy.map(g =>
          g.id === itemId ? { ...g, image_url: URL.createObjectURL(file) } : g
        ));
      }

      setEditingId(null);
      setEditingType(null);
      setMessage({ type: 'success', text: 'Imagen actualizada correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating image:', error);
      setMessage({ type: 'error', text: 'Error al actualizar imagen' });
    }
  }

  const handleGalleryUpdate = (type: 'attraction' | 'business' | 'gastronomy', itemId: string, newGallery: string[]) => {
    if (type === 'attraction') {
      setAttractions(attractions.map(a =>
        a.id === itemId ? { ...a, gallery: newGallery } : a
      ));
    }
    setMessage(null);
  };

  const filterItems = (items: Item[]): Item[] => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredAttractions = filterItems(attractions);
  const filteredBusinesses = filterItems(businesses);
  const filteredGastronomy = filterItems(gastronomy);

  const AttractionCard = ({ item }: { item: AttractionItem }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:border-emerald-200">
      {/* Header image */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {editingId === item.id && editingType === 'attraction' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <h4 className="font-bold text-gray-900 mb-4">Cambiar imagen principal</h4>
              <ImageUpload
                onUpload={(file) => handleImageUpdate('attraction', item.id, file)}
                label="Subir imagen"
              />
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditingType(null);
                }}
                className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and category */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
            {item.category && (
              <p className="text-xs font-medium text-emerald-600 mt-1">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-xs font-bold text-blue-700">{item.gallery?.length || 0}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setEditingId(item.id);
              setEditingType('attraction');
            }}
            className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-sm rounded-lg transition-colors"
          >
            Cambiar principal
          </button>
          <button
            onClick={() => {
              if (expandedId === item.id && expandedType === 'attraction') {
                setExpandedId(null);
                setExpandedType(null);
              } else {
                setExpandedId(item.id);
                setExpandedType('attraction');
              }
            }}
            className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Galería
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === item.id && expandedType === 'attraction' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Gallery manager - expandable */}
        {expandedId === item.id && expandedType === 'attraction' && (
          <div className="pt-4 border-t border-gray-200">
            <GalleryManager
              attractionId={item.id}
              attractionName={item.name}
              currentGallery={item.gallery || []}
              onGalleryUpdate={(newGallery) => handleGalleryUpdate('attraction', item.id, newGallery)}
            />
          </div>
        )}
      </div>
    </div>
  );

  const BusinessCard = ({ item }: { item: BusinessItem }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:border-blue-200">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {editingId === item.id && editingType === 'business' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <h4 className="font-bold text-gray-900 mb-4">Cambiar imagen</h4>
              <ImageUpload
                onUpload={(file) => handleImageUpdate('business', item.id, file)}
                label="Subir imagen"
              />
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditingType(null);
                }}
                className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
        {item.type && (
          <p className="text-xs font-medium text-blue-600 mb-3">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </p>
        )}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
        <button
          onClick={() => {
            setEditingId(item.id);
            setEditingType('business');
          }}
          className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-lg transition-colors"
        >
          Cambiar imagen
        </button>
      </div>
    </div>
  );

  const GastronomyCard = ({ item }: { item: GastronomyItem }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:border-amber-200">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {editingId === item.id && editingType === 'gastronomy' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <h4 className="font-bold text-gray-900 mb-4">Cambiar imagen</h4>
              <ImageUpload
                onUpload={(file) => handleImageUpdate('gastronomy', item.id, file)}
                label="Subir imagen"
              />
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditingType(null);
                }}
                className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-3">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
        <button
          onClick={() => {
            setEditingId(item.id);
            setEditingType('gastronomy');
          }}
          className="w-full px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium text-sm rounded-lg transition-colors"
        >
          Cambiar imagen
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Messages */}
      {message && (
        <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg flex items-center gap-3 animate-fade-in-up ${
          message.type === 'success'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-700 font-medium"
            >
              <option value="all">Todos</option>
              <option value="attraction">Atractivos</option>
              <option value="business">Negocios</option>
              <option value="gastronomy">Gastronomía</option>
            </select>
          </div>
        </div>
      </div>

      {/* Atractivos */}
      {(filterType === 'all' || filterType === 'attraction') && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Mountain className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Atractivos Turísticos</h2>
              <p className="text-sm text-gray-600">{filteredAttractions.length} atractivos</p>
            </div>
          </div>
          {filteredAttractions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-gray-500 font-medium">No hay atractivos que coincidan</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map(item => (
                <AttractionCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Negocios */}
      {(filterType === 'all' || filterType === 'business') && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hospedajes y Servicios</h2>
              <p className="text-sm text-gray-600">{filteredBusinesses.length} negocios</p>
            </div>
          </div>
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-gray-500 font-medium">No hay negocios que coincidan</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map(item => (
                <BusinessCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gastronomía */}
      {(filterType === 'all' || filterType === 'gastronomy') && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gastronomía</h2>
              <p className="text-sm text-gray-600">{filteredGastronomy.length} platos</p>
            </div>
          </div>
          {filteredGastronomy.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-gray-500 font-medium">No hay platos que coincidan</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGastronomy.map(item => (
                <GastronomyCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
