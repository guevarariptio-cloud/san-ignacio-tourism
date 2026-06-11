/*
  # Update Attractions with Complete Galleries

  Updates the attractions table to populate the gallery field with multiple high-quality images
  for each attraction, enabling a carousel display on the detail pages.

  Changes:
  - Populates gallery field for all attractions with 4-6 related images each
  - Images sourced from Pexels for variety and quality
  - Ensures each gallery showcases different aspects of the location
*/

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/1764788/pexels-photo-1764788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1506386/pexels-photo-1506386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2449517/pexels-photo-2449517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1470161/pexels-photo-1470161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2245877/pexels-photo-2245877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Mirador Cerro Campana';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2708221/pexels-photo-2708221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2559827/pexels-photo-2559827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Laguna Faical';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/2400408/pexels-photo-2400408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1619338/pexels-photo-1619338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2551793/pexels-photo-2551793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Laguna Azul';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/1618995/pexels-photo-1618995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1695944/pexels-photo-1695944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1809143/pexels-photo-1809143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1809148/pexels-photo-1809148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Pinturas Rupestres de Faical';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/2161481/pexels-photo-2161481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2281969/pexels-photo-2281969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2333712/pexels-photo-2333712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2335866/pexels-photo-2335866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2559830/pexels-photo-2559830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1370174/pexels-photo-1370174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Catarata Las Malvinas';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2281966/pexels-photo-2281966.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1619337/pexels-photo-1619337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2625282/pexels-photo-2625282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Catarata La Libertad (Calabozo)';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1695690/pexels-photo-1695690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1905323/pexels-photo-1905323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Ruta del Café';

UPDATE attractions
SET gallery = ARRAY[
  'https://images.pexels.com/photos/2087020/pexels-photo-2087020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2062440/pexels-photo-2062440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1901324/pexels-photo-1901324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]
WHERE name = 'Plaza de Armas de San Ignacio';
