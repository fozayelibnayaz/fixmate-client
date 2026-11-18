export async function uploadToImgBB(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
  const json = await res.json();
  if (!json.success) throw new Error("Image upload failed");
  return json.data.url as string;
}
