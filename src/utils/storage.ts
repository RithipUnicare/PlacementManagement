import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

export const storage = {
    // Token Management
    async setAccessToken(token: string): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    },

    async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    async setRefreshToken(token: string): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    // User Data
    async setUserData(userData: any): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    },

    async getUserData(): Promise<any | null> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    },

    // Clear All
    async clearAll(): Promise<void> {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
        ]);
    },
};
