import { fbwWrapper } from './apiAggregator';
import type { 
  exportRelicArcane, 
  exportWeapons, 
  exportWarframes, 
  exportSentinels,
  ExternalApiResponse,
  ExternalRelicData 
} from './types';
import { log } from '../lib/log';
import axios from 'axios';

class ApiCache {
  private static instance: ApiCache;
  private relicData: exportRelicArcane | null = null;
  private weaponsData: exportWeapons | null = null;
  private warframeData: exportWarframes | null = null;
  private sentinelsData: exportSentinels | null = null;
  private externalApiData: ExternalRelicData[] | null = null;
  private isInitialized: boolean = false;
  private lastExternalApiRefresh: number = 0;
  private readonly EXTERNAL_API_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

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
      const [relicData, weaponsData, warframeData, sentinelsData, externalData] = await Promise.all([
        fbwWrapper("RelicArcane"),
        fbwWrapper("Weapons"),
        fbwWrapper("Warframes"),
        fbwWrapper("Sentinels"),
        this.fetchExternalApiData()
      ]);

      this.relicData = relicData;
      this.weaponsData = weaponsData;
      this.warframeData = warframeData;
      this.sentinelsData = sentinelsData;
      this.externalApiData = externalData;
      this.lastExternalApiRefresh = Date.now();
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

  private async fetchExternalApiData(): Promise<ExternalRelicData[]> {
    try {
      const response = await axios.get<ExternalApiResponse>('https://aetools.koyeb.app/api/explorer', {
        timeout: 10000
      });
      return response.data.relics;
    } catch (error) {
      log(
        `Failed to fetch external API data: ${error}`,
        "src/api/apiCache.ts",
        "fetchExternalApiData"
      );
      return [];
    }
  }

  public async getExternalApiData(): Promise<ExternalRelicData[] | null> {
    const now = Date.now();
    if (!this.externalApiData || (now - this.lastExternalApiRefresh) >= this.EXTERNAL_API_REFRESH_INTERVAL) {
      try {
        this.externalApiData = await this.fetchExternalApiData();
        this.lastExternalApiRefresh = now;
      } catch (error) {
        log(
          `Failed to refresh external API data: ${error}`,
          "src/api/apiCache.ts",
          "getExternalApiData"
        );
      }
    }
    return this.externalApiData;
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

  public getSentinelsData(): exportSentinels | null {
    return this.sentinelsData;
  }

  public isDataInitialized(): boolean {
    return this.isInitialized;
  }
}

export const apiCache = ApiCache.getInstance(); 