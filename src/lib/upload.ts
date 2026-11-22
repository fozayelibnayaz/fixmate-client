import { apiFetch } from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected image"));
    reader.readAsDataURL(file);
  });
  const result = await apiFetch<{ url: string }>("/api/uploads/image", {
    method: "POST",
    body: JSON.stringify({ image: dataUrl }),
  });
  return result.url;
};
