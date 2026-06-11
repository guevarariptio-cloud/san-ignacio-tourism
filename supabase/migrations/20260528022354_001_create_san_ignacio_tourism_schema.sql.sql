/*
  # San Ignacio Turístico - Database Schema (Corregido)

  Esta migración crea el esquema completo para la aplicación turística de San Ignacio, Cajamarca.

  ## Nuevas Tablas:
  
  1. **attractions** - Atractivos turísticos
     - `id` (uuid, clave primaria)
     - `name` (text) - Nombre del atractivo
     - `category` (text) - Categoría: laguna, catarata, mirador, arqueologico, otros
     - `description` (text) - Descripción detallada
     - `short_description` (text) - Descripción corta
     - `image_url` (text) - URL de imagen principal
     - `gallery` (text[]) - Array de URLs de imágenes
     - `location` (text) - Ubicación/dirección
     - `latitude` (decimal) - Coordenada latitud
     - `longitude` (decimal) - Coordenada longitud
     - `activities` (text[]) - Actividades disponibles
     - `difficulty` (text) - Nivel de dificultad: facil, moderado, dificil
     - `best_time` (text) - Mejor época para visitar
     - `tips` (text[]) - Consejos para visitantes
     - `featured` (boolean) - Si es un atractivo destacado
     - `rating` (decimal) - Calificación promedio
     - `created_at` (timestamp)

  2. **businesses** - Negocios locales (hospedajes, restaurantes, tours)
     - `id` (uuid, clave primaria)
     - `name` (text) - Nombre del negocio
     - `type` (text) - Tipo: hospedaje, restaurante, cafe, tour
     - `description` (text) - Descripción
     - `image_url` (text) - URL de imagen
     - `address` (text) - Dirección
     - `phone` (text) - Teléfono
     - `website` (text) - Sitio web
     - `services` (text[]) - Servicios ofrecidos
     - `price_range` (text) - Rango de precios: $, $$, $$$
     - `rating` (decimal) - Calificación
     - `featured` (boolean) - Si es destacado
     - `created_at` (timestamp)

  3. **gastronomy** - Platos típicos
     - `id` (uuid, clave primaria)
     - `name` (text) - Nombre del plato
     - `description` (text) - Descripción
     - `image_url` (text) - URL de imagen
     - `ingredients` (text[]) - Ingredientes principales
     - `type` (text) - Tipo: plato_principal, bebida, postre, entrada, producto
     - `created_at` (timestamp)

  4. **festivals** - Festividades
     - `id` (uuid, clave primaria)
     - `name` (text) - Nombre de la festividad
     - `description` (text) - Descripción
     - `date` (text) - Fecha o período
     - `activities` (text[]) - Actividades
     - `image_url` (text) - URL de imagen
     - `created_at` (timestamp)

  5. **practical_info** - Información práctica para turistas
     - `id` (uuid, clave primaria)
     - `category` (text) - Categoría: clima, transporte, tips
     - `title` (text) - Título
     - `content` (text) - Contenido
     - `icon` (text) - Nombre del icono
     - `created_at` (timestamp)

  ## Seguridad:
  - RLS habilitado en todas las tablas
  - Políticas de lectura pública para todos los visitantes
  - Sin escritura pública (datos administrativos)
*/

-- Tabla de atractivos turísticos
CREATE TABLE IF NOT EXISTS attractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('laguna', 'catarata', 'mirador', 'arqueologico', 'ruta', 'otros')),
  description text NOT NULL,
  short_description text,
  image_url text,
  gallery text[] DEFAULT '{}',
  location text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  activities text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('facil', 'moderado', 'dificil')),
  best_time text,
  tips text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  rating decimal(3, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabla de negócios locales
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hospedaje', 'restaurante', 'cafe', 'tour', 'artesania')),
  description text NOT NULL,
  image_url text,
  address text,
  phone text,
  website text,
  services text[] DEFAULT '{}',
  price_range text CHECK (price_range IN ('$', '$$', '$$$')),
  rating decimal(3, 2) DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tabla de gastronomía (incluye productos)
CREATE TABLE IF NOT EXISTS gastronomy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  ingredients text[] DEFAULT '{}',
  type text CHECK (type IN ('plato_principal', 'bebida', 'postre', 'entrada', 'producto')),
  created_at timestamptz DEFAULT now()
);

-- Tabla de festividades
CREATE TABLE IF NOT EXISTS festivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  activities text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de información práctica
CREATE TABLE IF NOT EXISTS practical_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('clima', 'transporte', 'tips', 'seguridad', 'salud')),
  title text NOT NULL,
  content text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastronomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_info ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (solo SELECT)
CREATE POLICY "Public can view attractions"
  ON attractions FOR SELECT
  USING (true);

CREATE POLICY "Public can view businesses"
  ON businesses FOR SELECT
  USING (true);

CREATE POLICY "Public can view gastronomy"
  ON gastronomy FOR SELECT
  USING (true);

CREATE POLICY "Public can view festivals"
  ON festivals FOR SELECT
  USING (true);

CREATE POLICY "Public can view practical info"
  ON practical_info FOR SELECT
  USING (true);

-- Insertar datos de atractivos turísticos
INSERT INTO attractions (name, category, description, short_description, image_url, location, activities, difficulty, best_time, tips, featured, rating) VALUES
('Mirador Cerro Campana', 'mirador', 'El Mirador Cerro Campana ofrece una vista panorámica espectacular de toda la ciudad de San Ignacio y el hermoso valle del río Chinchipe. Es el lugar perfecto para la fotografía, caminatas moderadas y observar atardeceres inolvidables sobre las montañas de Cajamarca.', 'Vista panorámica de San Ignacio y el valle del Chinchipe', 'https://images.pexels.com/photos/1764788/pexels-photo-1764788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A 3 km del centro de San Ignacio', ARRAY['Fotografía', 'Caminatas', 'Observación de atardeceres', 'Pícnic'], 'moderado', 'Mayo a Septiembre', ARRAY['Llevar agua y protector solar', 'Zapatos cómodos para caminar', 'Visitar al atardecer para mejores fotos', 'Llevar chompa por la tarde'], true, 4.8),

('Laguna Faical', 'laguna', 'La Laguna Faical es un cuerpo de agua natural rodeado de exuberante vegetación y rica fauna silvestre. Es un paraíso para los amantes de la naturaleza donde se pueden realizar activities como pesca deportiva, paseos en bote y observación de aves endémicas de la región.', 'Laguna natural con vegetación y fauna silvestre', 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A 12 km de San Ignacio', ARRAY['Pesca', 'Paseos en bote', 'Observación de aves', 'Camping', 'Fotografía'], 'facil', 'Mayo a Septiembre', ARRAY['Llevar repelente de insectos', 'Contratar guía local', 'No tirar basura', 'Respetar la fauna local'], true, 4.7),

('Laguna Azul', 'laguna', 'Hermosa laguna de aguas cristalinas de color azul intenso, rodeada de pajonales y naturaleza virgen. Es un lugar mágico ideal para descanso, camping bajo las estrellas y fotografía de paisaje. El color único del agua se debe a los minerales naturales del fondo.', 'Aguas azuladas rodeadas de naturaleza ideal para camping', 'https://images.pexels.com/photos/2400408/pexels-photo-2400408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A 18 km de San Ignacio', ARRAY['Camping', 'Descanso', 'Fotografía', 'Natación', 'Paseos'], 'moderado', 'Mayo a Septiembre', ARRAY['Llevar tienda de campaña', 'Protección solar', 'Llevar agua potable', 'Evitar visitar en temporada de lluvias'], true, 4.6),

('Pinturas Rupestres de Faical', 'arqueologico', 'Zona arqueológica de gran importancia histórica con arte rupestre prehistórico que data de miles de años. Las pinturas muestran escenas de caza, animales y símbolos ancestrales que revelan la rica historia de los primeros habitantes de la región de San Ignacio.', 'Arte rupestre prehistórico de gran valor histórico', 'https://images.pexels.com/photos/1618995/pexels-photo-1618995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Cerca a Laguna Faical', ARRAY['Turismo histórico', 'Fotografía', 'Investigación', 'Caminatas'], 'moderado', 'Todo el año', ARRAY['No tocar las pinturas', 'Respetar el sitio', 'Ir con guía autorizado', 'Llevar linterna'], true, 4.5),

('Catarata Las Malvinas', 'catarata', 'Impresionante catarata rodeada de vegetación tropical exuberante. El agua cae desde más de 30 metros de altura formando una piscina natural en su base. El camino hacia la catarata atraviesa bosques nublados, making it ideal para senderismo y turismo de aventura.', 'Catarata de 30m rodeada de vegetación tropical', 'https://images.pexels.com/photos/2161481/pexels-photo-2161481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A 15 km de San Ignacio', ARRAY['Senderismo', 'Turismo de aventura', 'Natación', 'Fotografía', 'Observación de flora'], 'dificil', 'Mayo a Agosto', ARRAY['Llevar ropa para cambiarse', 'Zapatos antideslizantes', 'Guía recomendado', 'Llevar snacks y agua'], true, 4.9),

('Catarata La Libertad (Calabozo)', 'catarata', 'Hermosa caída de agua natural en medio del bosque, ideal para caminatas ecológicas y conexión con la naturaleza. El sonido del agua y la vegetación circundante crean un ambiente de paz y tranquilidad perfecto para escapar de la ciudad.', 'Caída de agua natural para caminatas ecológicas', 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'A 10 km de San Ignacio', ARRAY['Caminatas ecológicas', 'Naturaleza', 'Meditación', 'Fotografía'], 'moderado', 'Mayo a Septiembre', ARRAY['Llevar agua', 'Usar repelente', 'No visitar solo', 'Respetar la naturaleza'], false, 4.4),

('Ruta del Café', 'ruta', 'Recorrido turístico único por las principales fincas cafetaleras de San Ignacio, donde los visitantes pueden conocer el proceso completo de producción del café desde la cosecha hasta la taza, incluyendo degustación de café de alta calidad reconocido internacionalmente.', 'Recorrido por fincas cafetaleras con degustación', 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Varios puntos en San Ignacio', ARRAY['Degustación de café', 'Tour por fincas', 'Compras de café', 'Fotografía', 'Talleres'], 'facil', 'Mayo a Septiembre', ARRAY['Reservar con anticipación', 'Llevar dinero para compras', 'Alergias: informar antes', 'Disfrutar responsablemente'], true, 4.8),

('Plaza de Armas de San Ignacio', 'otros', 'El corazón de la ciudad, rodeado de restaurantes típicos, comercios locales y escenario de actividades culturales y festividades. La plaza combina arquitectura colonial con ambiente moderno, siendo el punto de encuentro principal de locales y turistas.', 'Centro principal con restaurantes y actividades culturales', 'https://images.pexels.com/photos/2087020/pexels-photo-2087020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Centro de San Ignacio', ARRAY['Paseos', 'Gastronomía', 'Compras', 'Eventos culturales', 'Descanso'], 'facil', 'Todo el año', ARRAY['Visitar en ferias', 'Probar comida local', 'Mercado artesanal', 'Eventos gratuitos'], false, 4.3);

-- Insertar negocios locales
INSERT INTO businesses (name, type, description, image_url, address, phone, services, price_range, featured, rating) VALUES
('Gran Hotel San Ignacio', 'hospedaje', 'Hotel de primera categoría con habitaciones confortables, restaurante, estacionamiento y atención personalizada. Ideal para turistas nacionales e internacionales que buscan comodidad y buena ubicación en el centro de San Ignacio.', 'https://images.pexels.com/photos/2611813/pexels-photo-2611813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Jr. Comercio 123, Plaza de Armas', '+51 76 558123', ARRAY['Habitaciones', 'Restaurante', 'Estacionamiento', 'WiFi', 'Desayuno'], '$$', true, 4.6),

('Hostal El Conquistador', 'hospedaje', 'Hostal acogedor con habitaciones sencillas y limpias a precios accesibles. Perfecto para viajeros que buscan hospedaje económico sin sacrificar comodidad y ubicación estratégica.', 'https://images.pexels.com/photos/1645954/pexels-photo-1645954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Jr. Grau 456', '+51 76 558234', ARRAY['Habitaciones', 'WiFi', 'TV por cable'], '$', false, 4.2),

('Restaurant El Sabor de San Ignacio', 'restaurante', 'Restaurante especializado en gastronomía cajamarquina y amazónica. Destaca por sus platos tradicionales preparados con ingredientes locales de alta calidad y atención familiar.', 'https://images.pexels.com/photos/674913/pexels-photo-674913.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Plaza de Armas 789', '+51 76 558345', ARRAY['Comida típica', 'Almuerzos', 'Cenas', 'Pedidos para llevar'], '$$', true, 4.7),

('Café San Ignacio', 'cafe', 'Cafetería especializada en café de origen de las fincas locales de San Ignacio. Ofrece variedades de café de especialidad, postres artesanales y ambiente acogedor para disfrutar de la mejor experiencia cafetera.', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Jr. Amazonas 101', '+51 76 558456', ARRAY['Café especialidad', 'Postres', 'WiFi', 'Ambiente tranquilo'], '$', true, 4.8),

('Tour Aventura San Ignacio', 'tour', 'Operadora turística local con años de experiencia ofreciendo tours a las cataratas, lagunas y rutas del café. Guías bilingües, equipos de seguridad y grupos pequeños para una experiencia personalizada.', 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Plaza de Armas 234', '+51 76 558567', ARRAY['Tours guiados', 'Transporte', 'Guías bilingües', 'Equipos de seguridad'], '$$', true, 4.9);

-- Insertar gastronomía
INSERT INTO gastronomy (name, description, image_url, ingredients, type) VALUES
('Cuy Frito', 'Plato tradicional cajamarquino, el cuy se fríe hasta quedar crujiente por fuera y tierno por dentro, servido con papas doradas y ensalada fresca. Un manjar de la gastronomía andina.', 'https://images.pexels.com/photos/762920/pexels-photo-762920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Cuy', 'Papas', 'Ajo', 'Comino', 'Sal', 'Ají'], 'plato_principal'),

('Café Especial de San Ignacio', 'Café de alta calidad cultivado en las montañas de San Ignacio a más de 1500 msnm. Sabor suave con notas frutales y chocolate, reconocido internacionalmente por su calidad.', 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Granos de café arábica', 'Agua de manantial'], 'bebida'),

('Trucha Frita', 'Trucha fresca de las lagunas de San Ignacio, frita con ajo y servida con ensalada y papas. Pescado jugoso con piel crujiente, un plato delicioso y saludable.', 'https://images.pexels.com/photos/762920/pexels-photo-762920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Trucha', 'Ajo', 'Limón', 'Perejil', 'Papas'], 'plato_principal'),

('Chicha de Jora', 'Bebida ancestral fermentada de maíz, refrescante y con sabor único. Tradición que se mantiene viva en las fiestas populares de San Ignacio.', 'https://images.pexels.com/photos/1283221/pexels-photo-1283221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Maíz jora', 'Agua', 'Panela'], 'bebida'),

('Yuca Frita', 'Yuca local frita hasta quedar dorada y crujiente, servida con salsa de ají casera. Acompañamiento perfecto para cualquier plato o como snack.', 'https://images.pexels.com/photos/1580466/pexels-photo-1580466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Yuca', 'Aceite', 'Sal', 'Ají'], 'entrada'),

('Miel de Abeja Local', 'Miel pura de abejas nativas de los bosques de San Ignacio. Dulce natural con propiedades medicinales, perfecta para el desayuno o remedios naturales.', 'https://images.pexels.com/photos/1580466/pexels-photo-1580466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Miel de abeja nativa', 'Polen'], 'producto');

-- Insertar festividades
INSERT INTO festivals (name, description, date, activities, image_url) VALUES
('Fiesta Patronal de San Ignacio de Loyola', 'La festividad más importante del año en honor al santo patrono San Ignacio de Loyola. Incluye ferias gastronómicas con platos típicos, concursos de danzas folklóricas, misas solemnes, procesiones, fuegos artificiales y actividades culturales que atraen visitantes de toda la región.', '31 de Julio', ARRAY['Feria gastronómica', 'Danzas folklóricas', 'Misa y procesión', 'Fuegos artificiales', 'Conciertos', 'Feria artesanal'], 'https://images.pexels.com/photos/1194258/pexels-photo-1194258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Aniversario de San Ignacio', 'Celebración del aniversario de creación de la provincia de San Ignacio con desfiles cívicos, paradas militares, concursos escolares, verbena popular y actividades deportivas que integran a toda la comunidad.', '12 de Mayo', ARRAY['Desfiles cívicos', 'Paradas militares', 'Concursos', 'Verbena popular', 'Eventos deportivos'], 'https://images.pexels.com/photos/1194258/pexels-photo-1194258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),

('Festival del Café', 'Evento dedicado a celebrar y promocionar el café de San Ignacio, reconocido internacionalmente. Incluye degustaciones, concursos de mejor café, muestras de producción, venta de café directo de productores y catas abiertas al público.', 'Agosto (fecha variable)', ARRAY['Degustación de café', 'Concursos', 'Muestras de producción', 'Ventas directas', 'Catas'], 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

-- Insertar información práctica
INSERT INTO practical_info (category, title, content, icon) VALUES
('clima', 'Mejor época para visitar', 'La temporada ideal es de mayo a septiembre, durante la temporada seca. El clima es agradable con días soleados y noches frescas. De octubre a abril es temporada de lluvias, aunque la naturaleza está más verde.', 'Sun'),

('transporte', 'Cómo llegar', 'Desde Lima: 18 horas en bus directo. Desde Cajamarca: 4 horas en carro o bus. Hay buses diarios desde las principales ciudades del norte del Perú. El aeropuerto más cercano está en Cajamarca.', 'Plane'),

('transporte', 'Transporte local', 'Mototaxis y taxis son el transporte más común dentro de San Ignacio. Para tours a las cataratas y lagunas, se recomienda contratar servicios de tours que incluyen transporte.', 'Car'),

('tips', 'Qué llevar', 'Ropa cómoda para climas variados, zapatos para caminatas, protector solar, repelente de insectos, cámara fotográfica, dinero en efectivo (pocos cajeros), ropa de baño para las cataratas.', 'Backpack'),

('seguridad', 'Seguridad', 'San Ignacio es un destino seguro. Sin embargo, se recomienda ir en grupos a las zonas remotas, contratar guías locales autorizados, informar su ruta antes de salir, y llevar documentos de identidad.', 'Shield'),

('salud', 'Salud', 'Hay posta de salud en la ciudad. Llevar medicamentos personales básicos. En zonas rurales puede no haber señal de celular. Beber solo agua embotellada o tratada.', 'Heart');

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_attractions_category ON attractions(category);
CREATE INDEX idx_attractions_featured ON attractions(featured);
CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_featured ON businesses(featured);