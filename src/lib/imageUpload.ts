import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type ItemType = 'attraction' | 'business' | 'gastronomy';

const CONFIG: Record<ItemType, { table: string; folder: string }> = {
  attraction: { table: 'attractions', folder: 'attractions' },
  business: { table: 'businesses', folder: 'businesses' },
  gastronomy: { table: 'gastronomy', folder: 'gastronomy' },
};

const BUCKET = 'tourism-images';

export async function uploadImage(
  file: File,
  folderPath: string = 'uploads'
): Promise<string> {
  try {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${random}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function updateItemImage(
  itemType: ItemType,
  itemId: string,
  file: File
): Promise<string> {
  try {
    const config = CONFIG[itemType];
    const imageUrl = await uploadImage(file, config.folder);

    const { error } = await supabase
      .from(config.table)
      .update({ image_url: imageUrl })
      .eq('id', itemId);

    if (error) throw error;

    return imageUrl;
  } catch (error) {
    console.error(`Error updating ${itemType} image:`, error);
    throw error;
  }
}

export async function updateItemGallery(
  itemType: ItemType,
  itemId: string,
  files: File[]
): Promise<string[]> {
  try {
    const config = CONFIG[itemType];

    const uploadPromises = files.map(file =>
      uploadImage(file, `${config.folder}/gallery`)
    );

    const imageUrls = await Promise.all(uploadPromises);

    if (itemType === 'attraction') {
      const { data: item, error: fetchError } = await supabase
        .from(config.table)
        .select('gallery')
        .eq('id', itemId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const existingGallery = item?.gallery || [];
      const updatedGallery = [...existingGallery, ...imageUrls];

      const { error: updateError } = await supabase
        .from(config.table)
        .update({ gallery: updatedGallery })
        .eq('id', itemId);

      if (updateError) throw updateError;
    }

    return imageUrls;
  } catch (error) {
    console.error(`Error updating ${itemType} gallery:`, error);
    throw error;
  }
}

export async function removeFromItemGallery(
  itemType: ItemType,
  itemId: string,
  imageUrl: string
): Promise<void> {
  try {
    if (itemType !== 'attraction') {
      throw new Error('Gallery removal only supported for attractions');
    }

    const config = CONFIG[itemType];
    const { data: item, error: fetchError } = await supabase
      .from(config.table)
      .select('gallery')
      .eq('id', itemId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const updatedGallery = (item?.gallery || []).filter(
      (url: string) => url !== imageUrl
    );

    const { error: updateError } = await supabase
      .from(config.table)
      .update({ gallery: updatedGallery })
      .eq('id', itemId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error(`Error removing from ${itemType} gallery:`, error);
    throw error;
  }
}

// Backward compatibility exports
export async function updateAttractionImage(
  attractionId: string,
  file: File
): Promise<void> {
  await updateItemImage('attraction', attractionId, file);
}

export async function updateBusinessImage(
  businessId: string,
  file: File
): Promise<void> {
  await updateItemImage('business', businessId, file);
}

export async function updateGastronomyImage(
  gastronomyId: string,
  file: File
): Promise<void> {
  await updateItemImage('gastronomy', gastronomyId, file);
}

export async function updateAttractionGallery(
  attractionId: string,
  files: File[]
): Promise<string[]> {
  return updateItemGallery('attraction', attractionId, files);
}

export async function removeFromGallery(
  attractionId: string,
  imageUrl: string
): Promise<void> {
  return removeFromItemGallery('attraction', attractionId, imageUrl);
}

export async function createAttractionWithImage(
  attractionData: any,
  file: File
): Promise<string> {
  try {
    const imageUrl = await uploadImage(file, 'attractions');

    const { data, error } = await supabase
      .from('attractions')
      .insert([{ ...attractionData, image_url: imageUrl }])
      .select('id');

    if (error) throw error;

    return data[0].id;
  } catch (error) {
    console.error('Error creating attraction:', error);
    throw error;
  }
}

