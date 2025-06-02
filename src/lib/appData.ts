import { log } from './log';

const APP_DATA_KEY = 'treasury_frame_data';

class AppDataManager {
  private static instance: AppDataManager;

  private constructor() {}

  public static getInstance(): AppDataManager {
    if (!AppDataManager.instance) {
      AppDataManager.instance = new AppDataManager();
    }
    return AppDataManager.instance;
  }

  public get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`${APP_DATA_KEY}_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      log(
        `Failed to get data for key ${key}: ${error}`,
        "src/lib/appData.ts",
        "get"
      );
      return null;
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${APP_DATA_KEY}_${key}`, JSON.stringify(value));
    } catch (error) {
      log(
        `Failed to set data for key ${key}: ${error}`,
        "src/lib/appData.ts",
        "set"
      );
    }
  }

  public delete(key: string): void {
    try {
      localStorage.removeItem(`${APP_DATA_KEY}_${key}`);
    } catch (error) {
      log(
        `Failed to delete data for key ${key}: ${error}`,
        "src/lib/appData.ts",
        "delete"
      );
    }
  }

  public clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(APP_DATA_KEY))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      log(
        `Failed to clear app data: ${error}`,
        "src/lib/appData.ts",
        "clear"
      );
    }
  }
}

// Export a singleton instance
export const appDataManager = AppDataManager.getInstance(); 