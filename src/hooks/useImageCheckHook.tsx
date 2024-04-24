import { useEffect, useState } from "react";
import { checkIfImageExists } from "@/utils/checkImage";
import { baseURL } from "@/service/service.axios";

const useImageCheckHook = (url: string) => {
  const [imageExists, setImageExists] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchImageExists = async () => {
      try {
        const exists = await checkIfImageExists(
          `${baseURL}/uploaded_images/${url}`
        );
        setImageExists(exists);
      } catch (error) {
        console.error("Error checking image existence:", error);
        setImageExists(false);
      }
    };

    fetchImageExists();
  }, [url]);

  return {
    imageUrl: imageExists ? `${baseURL}/uploaded_images/${url}` : url,
  };
};

export default useImageCheckHook;
