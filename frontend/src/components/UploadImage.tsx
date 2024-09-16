import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("handle Submit called");
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("userImage", image);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Image uploaded successfully!");
      const filePath = response.data.filePath;
      const fullFilePath = response.data.fullFilePath;
      navigate("/edit", {
        state: { imagePath: filePath, fullFilePath: fullFilePath },
      });
      console.log(response.data);
    } catch (error) {
      // Check if error is an instance of AxiosError
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
        alert(errorMessage);
      } else {
        // Handle other types of errors (e.g., network errors)
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="mt-[40px] flex flex-col items-center justify-center">
      <h1 className="text-[30px] font-semibold">Upload an Image</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center"
      >
        <label className="bg-blue-500 text-white px-[16px] py-[8px] rounded-lg cursor-pointer hover:bg-blue-600 transition">
          Choose File
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {preview && (
          <img
            src={preview}
            alt="preview"
            width="300"
            height="200"
            className="mt-[10px]"
          />
        )}
        <button
          type="submit"
          className="bg-rose-500 text-white rounded-[6px] px-[12px] py-[6px] mt-[14px] hover:bg-rose-600 transition"
        >
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default UploadImage;
