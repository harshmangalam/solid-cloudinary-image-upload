import axios from "axios";
import shortid from "shortid";
import { createStore } from "solid-js/store";

const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;

export default function useCloudinary() {
  const [store, setStore] = createStore({
    image: null,
    imagePreview: "",
    uploadProgress: 0,
    alert: null,
    abortToken: null,
  });

  function handleImageChange(e) {
    const image = e.target.files[0];
    // create blob url of selected image for preview
    const imagePreview = URL.createObjectURL(image);
    // create axios cancellation token to abort request in future
    const abortToken = axios.CancelToken.source();

    setStore("image", image);
    setStore("imagePreview", imagePreview);
    setStore("abortToken", abortToken);
    setStore("alert", {
      severity: "success",
      text: "Image loaded successfully",
    });
  }
  function handleImageRemove() {
    // cleanup blob  metadata
    URL.revokeObjectURL(store.imagePreview);
    window.location.reload();
  }
  async function handleImageUpload() {
    try {
      const formData = new FormData();
      formData.append("file", store.image);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("public_id", shortid.generate());

      const response = await axios.post(url, formData, {
        onUploadProgress: handleUploadProgess,
        cancelToken: store.abortToken.token,
      });
      setStore("alert", {
        severity: "success",
        text: "Image uploaded to cloudinary successfully",
      });

      // revoke preview blob url
      URL.revokeObjectURL(store.imagePreview);
      setStore("imagePreview", response.data.url);
    } catch (error) {
      console.log(error);
    }
  }

  function handleUploadProgess(progressEv) {
    const progress = Math.floor((progressEv.loaded / store.image.size) * 100);
    console.log(progress);
    setStore("uploadProgress", progress);
  }

  function handleCancelUpload() {
    store.abortToken.cancel();
    setStore("alert", {
      severity: "error",
      text: "Image upload aborted",
    });
  }
  return {
    store,
    handleImageChange,
    handleImageRemove,
    handleImageUpload,
    handleCancelUpload,
  };
}
