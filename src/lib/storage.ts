import { createClient } from "@supabase/supabase-js";

const UPLOADS_BUCKET = "uploads";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function isStorageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

/** Uploads a photo to Supabase Storage and returns its public URL. */
export async function uploadPhoto(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase Storage belum dikonfigurasi (SUPABASE_URL/SUPABASE_ANON_KEY belum diset).");
  }

  const { error } = await supabase.storage.from(UPLOADS_BUCKET).upload(filename, buffer, {
    contentType,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
