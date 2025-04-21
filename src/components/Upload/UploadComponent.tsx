import React, { useEffect } from "react";
import "./ImageUpload.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchImages } from "../../store/imageSlice.ts";
import { AppDispatch } from "../../store/store.ts";

import { BiTrash } from "react-icons/bi";

const ImageUpload: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const images = useSelector((state: RootState) => state.images.images);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  return (
    <div className="upload-container">
      <div className="image-gallery">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img
              src={image}
              alt={`Uploaded ${index}`}
              className="gallery-image"
            />
            <button
              className="delete-button"
              
            >
              <BiTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
