# Guía: Cómo Editar Imágenes en San Ignacio Turismo

## 📋 Resumen Rápido

Tienes 3 formas de cambiar las imágenes en tu aplicación:

---

## Opción 1: Panel de Administración (LA MÁS FÁCIL)

### Acceso:
1. Abre tu aplicación
2. Ve a: `http://localhost:5173/admin/imagenes` (en desarrollo)
   - En producción: `https://tudominio.com/admin/imagenes`

### Cómo usar:
1. Verás todas las categorías:
   - ✨ Atractivos Turísticos
   - 🏨 Hospedajes y Servicios
   - 🍽️ Gastronomía

2. Haz clic en el botón **✏️ Editar** sobre la imagen que quieres cambiar

3. Sube tu nueva imagen:
   - Arrastra el archivo o haz clic
   - Formatos: PNG, JPG, GIF
   - Tamaño máximo: 5MB

4. ¡Listo! La imagen se actualiza automáticamente

---

## Opción 2: Editar Directamente en Supabase Dashboard

### Paso 1: Accede a Supabase
1. Ve a [Supabase Dashboard](https://supabase.com)
2. Selecciona tu proyecto
3. Abre "SQL Editor" o "Table Editor"

### Paso 2: Obtén URLs de tus imágenes
Tienes 2 formas:

**A. Usar Pexels (Imágenes de internet)**
- Ve a [pexels.com](https://pexels.com)
- Busca una foto
- Copia el URL de la foto

Ejemplo: `https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg`

**B. Subir a Supabase Storage**
1. En Supabase → Storage → "tourism-images" (o crea un nuevo bucket)
2. Sube tu imagen
3. Copia el URL público

Ejemplo: `https://gzwyfrgiyfuomlxpcidw.supabase.co/storage/v1/object/public/tourism-images/mi-foto.jpg`

### Paso 3: Actualizar la tabla

En **Table Editor**, abre la tabla y edita el campo `image_url`:

**Para Atractivos:**
1. Abre tabla `attractions`
2. Encuentra la atracción (ej: "Laguna Faical")
3. Edita el campo `image_url`
4. Pega tu nuevo URL
5. Guarda

**Para Negocios:**
1. Abre tabla `businesses`
2. Edita el campo `image_url`
3. Pega tu nuevo URL
4. Guarda

**Para Gastronomía:**
1. Abre tabla `gastronomy`
2. Edita el campo `image_url`
3. Pega tu nuevo URL
4. Guarda

---

## Opción 3: Usar la Función JavaScript (Para Programadores)

Si quieres usar código para actualizar imágenes:

```javascript
import { updateAttractionImage } from './lib/imageUpload';

// Obtener el archivo
const file = new File([blob], 'mi-foto.jpg', { type: 'image/jpeg' });

// Actualizar una atracción
const attractionId = 'abc123...'; // ID de la atracción
await updateAttractionImage(attractionId, file);
```

---

## 🎯 Mejores Prácticas

### Tamaño de imágenes:
- **Óptimo**: 1200-1600px de ancho
- **Mínimo**: 800px de ancho
- **Máximo**: 10MB (aunque 2-5MB es mejor)

### Formatos:
- ✅ JPG (fotos)
- ✅ PNG (logos, gráficos)
- ✅ WebP (mejor compresión)
- ❌ BMP (muy pesado)
- ❌ GIF animado (lento)

### Nombres de archivos:
```
✅ laguna-faical.jpg
✅ cafe-especial.jpg
✅ hotel-san-ignacio.jpg

❌ Foto123.jpg
❌ IMG_1234.jpg
❌ sin nombre.jpg
```

---

## 📱 Características de la Aplicación

La aplicación **automáticamente**:

✅ Comprime las imágenes  
✅ Adapta tamaños para móvil  
✅ Carga imágenes lentamente (lazy loading)  
✅ Mejora el rendimiento  
✅ Optimiza para dispositivos lentos  

---

## 🆘 Solucionar Problemas

### "La imagen no se ve"
→ Verifica que el URL sea correcto y accesible

### "Dice 'archivo muy grande'"
→ La imagen debe ser menor a 5MB. Comprime o redimensiona

### "Se sigue viendo la imagen vieja"
→ Limpia el caché del navegador (Ctrl+Shift+R en Windows/Linux, Cmd+Shift+R en Mac)

### "Error al subir"
→ Verifica que tengas acceso a Supabase Storage

---

## 📧 Contacto

Si tienes problemas, revisa:
1. La consola del navegador (F12 → Console)
2. Los errores en Supabase Dashboard
3. Que el archivo no supere 5MB

¡Listo para editar tus imágenes! 🎉
