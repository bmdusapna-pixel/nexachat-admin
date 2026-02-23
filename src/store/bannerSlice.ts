import { DangerRight, Success } from "@/api/toastServices";
import { apiInstanceFetch } from "@/utils/ApiInstance";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface BannerState {
    banners: any[];
    total: number;
    isLoading: boolean;
    isSkeleton: boolean;
}

const initialState: BannerState = {
    banners: [],
    total: 0,
    isLoading: false,
    isSkeleton: false,
};

// GET all banners (paginated, admin)
export const getBanners: any = createAsyncThunk(
    "banner/getBanners",
    async (payload: { start: number; limit: number } | undefined) => {
        return apiInstanceFetch.get(
            `api/client/banner/listBanner?start=${payload?.start}&limit=${payload?.limit}`
        );
    }
);

// CREATE banner (FormData with optional image)
export const createBanner: any = createAsyncThunk(
    "banner/createBanner",
    async (payload: FormData) => {
        return apiInstanceFetch.post(`api/client/banner/createBanner`, payload);
    }
);

// UPDATE banner (FormData)
export const updateBanner: any = createAsyncThunk(
    "banner/updateBanner",
    async (payload: FormData) => {
        return apiInstanceFetch.patch(`api/client/banner/modifyBanner`, payload);
    }
);

// TOGGLE isActive
export const updateBannerStatus: any = createAsyncThunk(
    "banner/updateBannerStatus",
    async (bannerId: string) => {
        return apiInstanceFetch.patch(
            `api/client/banner/updateBannerStatus?bannerId=${bannerId}`,
            {}
        );
    }
);

// DELETE banner
export const deleteBanner: any = createAsyncThunk(
    "banner/deleteBanner",
    async (bannerId: string) => {
        return apiInstanceFetch.delete(
            `api/client/banner/deleteBanner?bannerId=${bannerId}`
        );
    }
);

const bannerSlice = createSlice({
    name: "banner",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // GET banners
        builder.addCase(getBanners.pending, (state) => {
            state.isSkeleton = true;
        });
        builder.addCase(getBanners.fulfilled, (state, action: PayloadAction<any>) => {
            state.isSkeleton = false;
            state.banners = action.payload.data;
            state.total = action.payload.total;
        });
        builder.addCase(getBanners.rejected, (state) => {
            state.isSkeleton = false;
        });

        // CREATE banner
        builder.addCase(createBanner.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createBanner.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            if (action.payload.status) {
                state.banners.unshift(action.payload.data);
                Success("Banner Created Successfully");
            } else {
                DangerRight(action.payload.message);
            }
        });
        builder.addCase(createBanner.rejected, (state) => {
            state.isLoading = false;
        });

        // UPDATE banner
        builder.addCase(updateBanner.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateBanner.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            if (action.payload.status) {
                const idx = state.banners.findIndex(
                    (b) => b._id === action.payload.data?._id
                );
                if (idx !== -1) {
                    state.banners[idx] = { ...state.banners[idx], ...action.payload.data };
                }
                Success("Banner Updated Successfully");
            } else {
                DangerRight(action.payload.message);
            }
        });
        builder.addCase(updateBanner.rejected, (state) => {
            state.isLoading = false;
        });

        // TOGGLE STATUS
        builder.addCase(updateBannerStatus.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateBannerStatus.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            if (action.payload.status) {
                const idx = state.banners.findIndex(
                    (b) => b._id === action.payload.data?._id
                );
                if (idx !== -1) {
                    state.banners[idx].isActive = action.payload.data.isActive;
                }
                action.payload.data.isActive
                    ? Success("Banner Activated Successfully")
                    : Success("Banner Deactivated Successfully");
            } else {
                DangerRight(action.payload.message);
            }
        });
        builder.addCase(updateBannerStatus.rejected, (state) => {
            state.isLoading = false;
        });

        // DELETE banner
        builder.addCase(deleteBanner.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteBanner.fulfilled, (state, action: any) => {
            state.isLoading = false;
            if (action.payload.status) {
                state.banners = state.banners.filter(
                    (b) => b._id !== action.meta.arg
                );
                Success("Banner Deleted Successfully");
            } else {
                DangerRight(action.payload.message);
            }
        });
        builder.addCase(deleteBanner.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default bannerSlice.reducer;
