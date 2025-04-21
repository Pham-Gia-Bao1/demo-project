import React from "react";
import UploadComponent from "../components/Upload/UploadComponent.tsx";
import { useSelector } from "react-redux";
import ImageFilterComponent from "../components/Upload/ImageFilterComponent.tsx";

const FileManagementPage = () => {
  return (
    <div className="file-management-page">
      <ImageFilterComponent />
      <UploadComponent />
    </div>
  );
};

export default FileManagementPage;
