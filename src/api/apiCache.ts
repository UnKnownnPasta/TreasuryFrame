import { fbwWrapper } from './apiAggregator';
import type { exportRelicArcane, exportWeapons, exportWarframes } from './apiAggregator';
import { log } from '../lib/log';

class ApiCache {
  private static instance: ApiCache;
  private relicData: exportRelicArcane | null = null;
  private weaponsData: exportWeapons | null = null;
  private warframeData: exportWarframes | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const [relicData, weaponsData, warframeData] = await Promise.all([
        fbwWrapper("RelicArcane"),
        fbwWrapper("Weapons"),
        fbwWrapper("Warframes")
      ]);

      this.relicData = relicData;
      this.weaponsData = weaponsData;
      this.warframeData = warframeData;
      this.isInitialized = true;
    } catch (error) {
      log(
        "Failed to initialize API cache",
        "src/api/apiCache.ts",
        "initialize"
      );
      throw error;
    }
  }

  public getRelicData(): exportRelicArcane | null {
    return this.relicData;
  }

  public getWeaponsData(): exportWeapons | null {
    return this.weaponsData;
  }

  public getWarframeData(): exportWarframes | null {
    return this.warframeData;
  }

  public isDataInitialized(): boolean {
    return this.isInitialized;
  }
}

export const apiCache = ApiCache.getInstance(); 