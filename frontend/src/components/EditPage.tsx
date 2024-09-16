import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const EditPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imagePath, fullFilePath } = location.state || {};
  const [brightnessValue, setBrightnessValue] = useState(50);
  const [saturationValue, setSaturationValue] = useState(50);
  const [rotationValue, setRotationValue] = useState(0);
  const [imageFormat, setImageFormat] = useState("jpg");
  const [newImage, setNewImage] = useState<string>(imagePath);
  const [isConfirmBrightness, setIsConfirmBrightness] = useState(false);
  const [isConfirmSaturation, setIsConfirmSaturation] = useState(false);
  const [isConfirmRotation, setIsConfirmRotation] = useState(false);

  const isScrolling = useRef(false); // Track whether user is still scrolling
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Track the timeout for debounce

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/image/download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: fullFilePath,
            format: imageFormat,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download the image");
      }

      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-image.${imageFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log('Frontend: Download API executed....')
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("An unexpected error occurred while downloading the image.");
    }
  };
  // Handle the confirm button click for brightness
  const handleConfirmBrightness = () => {
    setIsConfirmBrightness(true);
    adjustBrightness(brightnessValue);
  };

  // Handle the confirm button click for saturation
  const handleConfirmSaturation = () => {
    setIsConfirmSaturation(true);
    adjustSaturation(saturationValue);
  };

  // Handle the confirm button click for rotation
  const handleConfirmRotation = () => {
    setIsConfirmRotation(true);
    adjustRotation(rotationValue); // Send the confirmed rotation adjustment
  };

  // API request to adjust brightness
  const adjustBrightness = async (brightnessValue: number) => {
    console.log(`Sending brightness value: ${brightnessValue}`);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/image/brightness`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: fullFilePath,
            isConfirm: isConfirmBrightness,
            lightness: brightnessValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to adjust brightness");
      }
      
      const blob = await response.blob();
      const newImageUrl = URL.createObjectURL(blob);
      setNewImage(newImageUrl);
      console.log('Frontend: Brightness API executed....')
    } catch (error) {
      console.error("Error adjusting brightness:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  // API request to adjust saturation
  const adjustSaturation = async (saturationValue: number) => {
    console.log(`Sending saturation value: ${saturationValue}`);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/image/saturation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: fullFilePath,
            isConfirm: isConfirmSaturation,
            saturation: saturationValue,
          }),
        }
      );

      
      if (!response.ok) {
        throw new Error("Failed to adjust saturation");
      }
      
      const blob = await response.blob();
      const newImageUrl = URL.createObjectURL(blob);
      setNewImage(newImageUrl);
      console.log('Frontend: Saturation API executed....')
    } catch (error) {
      console.error("Error adjusting saturation:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  // API request to adjust rotation
  const adjustRotation = async (rotationValue: number) => {
    console.log(`Sending rotation value: ${rotationValue}`);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/image/rotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: fullFilePath,
            isConfirm: isConfirmRotation,
            rotation: rotationValue,
          }),
        }
      );

      
      if (!response.ok) {
        throw new Error("Failed to adjust rotation");
      }
      
      const blob = await response.blob();
      const newImageUrl = URL.createObjectURL(blob);
      setNewImage(newImageUrl);
      console.log('Frontend: Rotation API executed....')
    } catch (error) {
      console.error("Error adjusting rotation:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const debounceAdjustBrightness = debounce(adjustBrightness, 1000);
  const debounceAdjustSaturation = debounce(adjustSaturation, 1000);
  const debounceAdjustRotation = debounce(adjustRotation, 1000); // Debounced rotation adjustment

  // Handle slider changes and debounce the API call for brightness
  const handleBrightnessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newBrightnessValue = Number(event.target.value);
    setBrightnessValue(newBrightnessValue);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    isScrolling.current = true;

    timeoutId.current = setTimeout(() => {
      isScrolling.current = false;
      debounceAdjustBrightness(newBrightnessValue);
    }, 1000);
  };

  // Handle slider changes and debounce the API call for saturation
  const handleSaturationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSaturationValue = Number(event.target.value);
    setSaturationValue(newSaturationValue);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    isScrolling.current = true;

    timeoutId.current = setTimeout(() => {
      isScrolling.current = false;
      debounceAdjustSaturation(newSaturationValue);
    }, 1000);
  };

  // Handle slider changes and debounce the API call for rotation
  const handleRotationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRotationValue = Number(event.target.value);
    setRotationValue(newRotationValue);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    isScrolling.current = true;

    timeoutId.current = setTimeout(() => {
      isScrolling.current = false;
      debounceAdjustRotation(newRotationValue);
    }, 1000);
  };

  // Redirect to home page if imagePath is missing
  useEffect(() => {
    if (!imagePath) {
      navigate("/"); // Redirect to the home page
    }
  }, [imagePath, navigate]);

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="flex items-center justify-center">
        <img
          src={newImage}
          alt="Uploaded"
          style={{
            maxWidth: "610px",
            maxHeight: "500px",
            width: "auto",
            height: "auto",
          }}
        />
      </div>

      {/* Brightness control */}
      <div className="flex items-center justify-center mt-4">
        <p className="mr-2">Brightness</p>
        <input
          type="range"
          min="0"
          max="100"
          value={brightnessValue}
          onChange={handleBrightnessChange}
          className="slider"
        />
        <button
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded"
          onClick={handleConfirmBrightness}
        >
          Confirm
        </button>
      </div>

      {/* Saturation control */}
      <div className="flex items-center justify-center mt-4">
        <p className="mr-2">Saturation</p>
        <input
          type="range"
          min="0"
          max="100"
          value={saturationValue}
          onChange={handleSaturationChange}
          className="slider"
        />
        <button
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded"
          onClick={handleConfirmSaturation}
        >
          Confirm
        </button>
      </div>

      {/* Rotation control */}
      <div className="flex items-center justify-center mt-4">
        <p className="mr-2">Rotation</p>
        <input
          type="range"
          min="-180"
          max="180"
          value={rotationValue}
          onChange={handleRotationChange}
          className="slider"
        />
        <button
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded"
          onClick={handleConfirmRotation}
        >
          Confirm
        </button>
      </div>

      {/* Image Format Selection */}
      <div className="flex items-center justify-center mt-4">
        <label className="mr-2">Format:</label>
        <select
          value={imageFormat}
          onChange={(e) => setImageFormat(e.target.value)}
          className="mr-2 border p-1"
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={handleDownload}
        >
          <FaDownload className="mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default EditPage;
