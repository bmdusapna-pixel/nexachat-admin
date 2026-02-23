"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import adminSlice from "./adminSlice";
import dashboardSlice from "./dashboardSlice";
import settingSlice from "./settingSlice";
import notificationSlice from "./notificationSlice";
import dialogSlice from "./dialogSlice";
import hostRequestSlice from "./hostRequestSlice";
import giftSlice from "./giftSlice";
import impressionSlice from "./impressionSlice";
import coinPlanSlice from "./coinPlanSlice";
import vipPlanSlice from "./vipPlanSlice";
import dailyCheckInRewardSlice from "./dailyCheckInRewardSlice";
import userSlice from "./userSlice";
import agencySlice from "./agencySlice";
import hostSlice from "./hostSlice";
import withdrawalSlice from "./withdrawalSlice";
import bannerSlice from "./bannerSlice";

// Create a noop storage for SSR to prevent "redux-persist failed to create sync storage" warning
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage on client, noop storage on server
const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage();


// Add persist config for admin slice
const adminPersistConfig = {
  key: 'admin',
  storage,
  whitelist: ['isAuth'], // only persist isAuth
};

const persistedAdminReducer = persistReducer(adminPersistConfig, adminSlice);

export function makeStore() {
  return configureStore({
    reducer: {
      admin: persistedAdminReducer,
      hostRequest: hostRequestSlice,
      user: userSlice,
      dashboard: dashboardSlice,
      gift: giftSlice,
      setting: settingSlice,
      notification: notificationSlice,
      dialogue: dialogSlice,
      impression: impressionSlice,
      coinPlan: coinPlanSlice,
      vipPlan: vipPlanSlice,
      dailyReward: dailyCheckInRewardSlice,
      agency: agencySlice,
      withdrawal: withdrawalSlice,
      host: hostSlice,
      banner: bannerSlice,

    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
}
export const store = makeStore();
export const persistor = persistStore(store);

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<any> = useSelector;
