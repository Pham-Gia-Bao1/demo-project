import React, { useEffect, useState, ChangeEvent } from "react";
import {
  FilterOutlined,
  FileOutlined,
  PictureOutlined,
  RobotOutlined,
  EditOutlined,
  SettingOutlined,
  BookOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./ImageFilterComponent.css";
import { Tabs, Select, Button, Space, Modal } from "antd";
import { RootState } from "../../store/store";
import { AppDispatch } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { addImage, removeImage, fetchImages } from "../../store/imageSlice.ts";
import { uploadImage } from "../../services/uploadService.ts";

const { TabPane } = Tabs;
const { Option } = Select;

interface SelectOption {
  value: string;
  label: string;
}

const ImageFilterComponent: React.FC = () => {
  const licenseOptions: SelectOption[] = [
    { value: "free", label: "Free" },
    { value: "premium", label: "Premium" },
  ];

  const aiGeneratedOptions: SelectOption[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const orientationOptions: SelectOption[] = [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
    { value: "square", label: "Square" },
  ];

  const fileTypeOptions: SelectOption[] = [
    { value: "jpg", label: "JPG" },
    { value: "png", label: "PNG" },
    { value: "svg", label: "SVG" },
  ];

  const sortByOptions: SelectOption[] = [
    { value: "most-relevant", label: "Sort by: Most Relevant" },
    { value: "newest", label: "Sort by: Newest" },
    { value: "oldest", label: "Sort by: Oldest" },
  ];

  const advancedOptions: SelectOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const images = useSelector((state: RootState) => state.images.images);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      const urls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
      setStatus(`Đã chọn ${fileArray.length} ảnh`);
    } else {
      setStatus("Không có ảnh nào được chọn. Vui lòng thử lại.");
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setStatus("Vui lòng chọn ít nhất một ảnh để tải lên.");
      return;
    }

    try {
      setIsUploading(true);
      setStatus("Đang tải ảnh lên...");

      for (const file of files) {
        const url = await uploadImage(file);
        dispatch(addImage(url));
      }

      setStatus("Tải lên thành công!");
      setFiles([]);
      setPreviewUrls([]);
      setIsModalVisible(false);
    } catch (error: any) {
      setStatus(`Lỗi: ${error.toString()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string) => {
    const fileName = imageUrl.split("/").pop();
    if (!fileName) return;

    try {
      await dispatch(removeImage(imageUrl));
      setStatus("Đã xoá ảnh thành công");
    } catch (error: any) {
      setStatus(`Lỗi khi xoá ảnh: ${error.toString()}`);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFiles([]);
    setPreviewUrls([]);
    setStatus("");
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  };

  return (
    <div className="image-filter-container">
      {/* Tabs */}
      <Tabs defaultActiveKey="1" type="line" className="custom-tabs">
        <TabPane tab="ALL IMAGES" key="1" />
        <TabPane tab="VECTORS" key="2" />
        <TabPane tab="ILLUSTRATIONS" key="3" />
        <TabPane tab="PHOTOS" key="4" />
        <TabPane tab="ICONS" key="5" />
        <TabPane tab="VIDEOS" key="6" />
        <TabPane tab="PSD" key="7" />
        <TabPane tab="TEMPLATES" key="8" />
      </Tabs>

      {/* Filter Section */}
      <div className="filter-section">
        <h2 className="title-gallery">Website Management Images</h2>
        {/* Filter and Sort By */}
        <div className="filter-sort">
          <Button
            onClick={showModal}
            icon={<PlusOutlined />}
            className="action-button"
          >
            Add
          </Button>
          <Button icon={<FilterOutlined />} className="action-button">
            Filter
          </Button>
          <Select<string>
            defaultValue="most-relevant"
            className="filter-select"
          >
            {sortByOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Modal
        title="Tải ảnh lên"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{ marginRight: 8 }} // Add spacing between buttons
          >
            Hủy
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            loading={isUploading}
            icon={<PlusOutlined />}
          >
            Tải lên
          </Button>,
        ]}
        className="upload-modal"
      >
        <div className="upload-modal-body">
          <label className="file-input-label">
            <span>Chọn nhiều ảnh từ thư viện:</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="file-input"
            //   style={{ width: "100%", marginTop: 8 }} // Ensure input takes full width
            />
          </label>

          {previewUrls.length > 0 && (
            <div className="preview-section" style={{ marginTop: 16 }}>
              <p className="preview-label">
                Xem trước ({previewUrls.length} ảnh):
              </p>
              <div
                className="preview-grid"
                style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between" }}
              >
                {previewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {status && (
            <p
              style={{
                marginTop: 16,
                color: status.includes("Lỗi") ? "red" : "green",
              }}
            >
              {status}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImageFilterComponent;
