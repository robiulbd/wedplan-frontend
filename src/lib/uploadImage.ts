interface ImgBBResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
  };
}

export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing in environment variables");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const result: ImgBBResponse = await res.json();

  if (!res.ok || !result.success || !result.data?.display_url) {
    throw new Error("Failed to upload profile image to ImgBB");
  }

  return result.data.display_url;
}