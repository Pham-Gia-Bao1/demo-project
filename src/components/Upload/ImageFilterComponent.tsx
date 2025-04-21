import React, { useEffect, useState, ChangeEvent } from "react";
import { FilterOutlined, FileOutlined, PictureOutlined, RobotOutlined, EditOutlined, SettingOutlined, BookOutlined, PlusOutlined } from '@ant-design/icons';
import './ImageFilterComponent.css';
import { Tabs, Select, Button, Space, Modal } from "antd"; // Thêm Modal
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
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' },
  ];

  const aiGeneratedOptions: SelectOption[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const orientationOptions: SelectOption[] = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'square', label: 'Square' },
  ];

  const fileTypeOptions: SelectOption[] = [
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'svg', label: 'SVG' },
  ];

  const sortByOptions: SelectOption[] = [
    { value: 'most-relevant', label: 'Sort by: Most Relevant' },
    { value: 'newest', label: 'Sort by: Newest' },
    { value: 'oldest', label: 'Sort by: Oldest' },
  ];

  const advancedOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

   const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State để điều khiển modal
  
    const dispatch: AppDispatch = useDispatch();
    const images = useSelector((state: RootState) => state.images.images);
  
    useEffect(() => {
      dispatch(fetchImages());
    }, [dispatch]);
  
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setStatus("");
      }
    };
  
    const handleUpload = async () => {
      if (!file) {
        setStatus("Vui lòng chọn một ảnh để tải lên.");
        return;
      }
  
      try {
        setIsUploading(true);
        setStatus("Đang tải ảnh lên...");
        const url = await uploadImage(file);
        dispatch(addImage(url));
        setStatus("Tải lên thành công!");
        setFile(null);
        setPreviewUrl("");
        setIsModalVisible(false); // Đóng modal sau khi upload thành công
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
  
    // Hàm để mở modal
    const showModal = () => {
      setIsModalVisible(true);
    };
  
    // Hàm để đóng modal
    const handleCancel = () => {
      setIsModalVisible(false);
      setFile(null);
      setPreviewUrl("");
      setStatus("");
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
        <Space className="space-1">
          {/* License Dropdown */}
          <Select<string>
            defaultValue="License"
            style={{ width: 150 }}
            suffixIcon={<BookOutlined />}
          >
            {licenseOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          {/* AI-generated Dropdown */}
          <Select<string>
            defaultValue="AI-generated"
            style={{ width: 150 }}
            suffixIcon={<RobotOutlined />}
          >
            {aiGeneratedOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          {/* Orientation Dropdown */}
          <Select<string>
            defaultValue="Orientation"
            style={{ width: 150 }}
            suffixIcon={<PictureOutlined />}
          >
            {orientationOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          {/* File type Dropdown */}
          <Select<string>
            defaultValue="File type"
            style={{ width: 150 }}
            suffixIcon={<FileOutlined />}
          >
            {fileTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          {/* Edit Online Button */}
          <Button
            type="default"
            icon={<EditOutlined />}
            className="edit-button"
          >
            Edit online
          </Button>

          {/* Advanced Dropdown */}
          <Select<string>
            defaultValue="Advanced"
            style={{ width: 150 }}
            suffixIcon={<SettingOutlined />}
          >
            {advancedOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Space>

        {/* Filter and Sort By */}
        <div className="filter-sort">
        <Button onClick={showModal} icon={<PlusOutlined />}>
            Add
          </Button>
          <Button icon={<FilterOutlined />}>
            Filter
          </Button>
          <Select<string>
            defaultValue="most-relevant"
            style={{ width: 150 }}
          >
            {sortByOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

       {/* Modal chứa phần upload ảnh */}
       <Modal
        title="Tải ảnh lên"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
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
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        {previewUrl && (
          <div className="preview-section">
            <p className="preview-label">Xem trước:</p>
            <img src={previewUrl} alt="Preview" className="preview-image" />
          </div>
        )}

        {status && <p className="status-text">{status}</p>}
      </Modal>
    </div>
  );
};

export default ImageFilterComponent;