// services/uploadService.ts
import { apiImage } from '../config/apiConfig';

interface UploadResponse {
  url: string;
  message: string;
}

interface GetAllResponse {
  files: {
    fileName: string;
    url: string;
    size: number;
    lastModified: string;
  }[];
}

export const uploadImage = async (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64File = reader.result?.toString().split(',')[1];
      if (!base64File) {
        return reject('Không đọc được nội dung file.');
      }

      const requestBody = {
        fileName: file.name,
        fileType: file.type,
        fileContentBase64: base64File,
      };

      try {
        const response = await apiImage.post<UploadResponse>('/upload', requestBody);
        resolve(response.data.url); // Trả về URL file sau khi upload
      } catch (error: any) {
        const message = error.response?.data?.message || 'Tải lên thất bại.';
        reject(message);
      }
    };

    reader.onerror = () => {
      reject('Lỗi khi đọc file.');
    };

    reader.readAsDataURL(file);
  });
};

export const getAllImagesService = async (): Promise<string[]> => {
  try {
    const response = await apiImage.get<GetAllResponse>('/files');
    return response.data.files.map((file) => file.url);
  } catch (error: any) {
    const message = error.response?.data?.message || 'Không thể tải danh sách file.';
    throw new Error(message);
  }
};

export const deleteImageService = async (fileName: string): Promise<void> => {
  try {
    console.log('Deleting file:', fileName);
    await apiImage.delete(`/file`, { params: { fileName } });
  } catch (error: any) {
    const message = error.response?.data?.message || 'Xoá file thất bại.';
    throw new Error(message);
  }
};

// Tuỳ chọn: dùng nếu bạn muốn lấy nội dung file dưới dạng base64 (ví dụ để preview)
export const getFileBase64Service = async (fileName: string): Promise<{ contentType: string; base64: string }> => {
  try {
    const res = await apiImage.get(`/file`, { params: { fileName } });
    return {
      contentType: res.data.contentType,
      base64: res.data.fileContentBase64,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Không thể tải file.';
    throw new Error(message);
  }
};
