/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const uploadImage = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) throw new Error("VITE_IMGBB_API_KEY is not configured");

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to ImgBB");
    }

    const result = await response.json();
    return result.data.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};
