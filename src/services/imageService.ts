/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const IMGBB_API_KEY = "a16fdd9aead1214d64e435c9b83a0c2e";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
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
