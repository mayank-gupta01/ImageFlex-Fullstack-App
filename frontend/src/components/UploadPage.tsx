import UploadImage from "./UploadImage";


const UploadPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center  h-screen">
      <h1 className="text-center text-[40px] font-bold mt-[100px]">
        ImageFlex - Your Ultimate Image Editing Platform
      </h1>
      <p className="text-center text-[18px] px-[300px] my-[10px] text-white">
        ImagePro is a powerful and easy-to-use online platform designed for all
        your image editing needs. Whether you're a professional photographer or
        just someone looking to enhance photos, ImagePro has the tools you need.
      </p>
      <UploadImage />
    </div>
  );
};

export default UploadPage;
