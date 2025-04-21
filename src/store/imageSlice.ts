import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllImagesService, deleteImageService } from '../services/uploadService.ts';

// Định nghĩa async thunk để lấy tất cả ảnh
export const fetchImages = createAsyncThunk<string[]>(
  'image/fetchImages', // Tên action
  async () => {
    console.log('Fetching images on slide...'); // Log để kiểm tra
    const images = await getAllImagesService(); // Gọi service để lấy ảnh
    return images; // Trả về danh sách URL ảnh
  }
);

export const removeImage = createAsyncThunk<string, string>(
  'image/removeImage',
  async (imageUrl: string) => {
    console.log('Removing image on slide...'); // Log để kiểm tra
    const fileName = imageUrl.split('/').pop();
    if (!fileName) throw new Error('File name not found');
    await deleteImageService(fileName); // Gọi service để xoá ảnh
    return fileName; // Trả về tên file đã xoá
  }
);

interface ImageState {
  images: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<string>) => {
      state.images.push(action.payload);
    },
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    clearImages: (state) => {
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch images';
      })
      .addCase(removeImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(
          (image) => image.split('/').pop() !== action.payload
        );
      })
      .addCase(removeImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove image';
      });
  },
});

export const { addImage, setImages, clearImages } = imageSlice.actions;
export default imageSlice.reducer;
