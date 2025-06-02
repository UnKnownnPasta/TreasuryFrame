import { fbwWrapper } from './apiAggregator';
import type { 
  exportRelicArcane, 
  exportWeapons, 
  exportWarframes, 
  exportSentinels,
  ExternalApiResponse,
  ExternalRelicData,
  WeaponData,
  WarframeData,
  SentinelData
} from './types';
import { log } from '../lib/log';
import axios from 'axios';

interface PrimeNameMap {
  [key: string]: {
    uniqueName: string;
    type: 'weapon' | 'warframe' | 'sentinel';
    sourceData: WeaponData | WarframeData | SentinelData | null;
  };
}

class ApiCache {
  private static instance: ApiCache;
  private relicData: exportRelicArcane | null = null;
  private weaponsData: exportWeapons | null = null;
  private warframeData: exportWarframes | null = null;
  private sentinelsData: exportSentinels | null = null;
  private externalApiData: ExternalRelicData[] | null = null;
  private externalApiDataPrimes: any[] | null = null;
  private primeNameMap: PrimeNameMap = {};
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

  private buildPrimeNameMap(): void {
    if (!this.relicData || !this.externalApiData) return;

    const map: PrimeNameMap = {};

    // Process each relic from source API
    this.relicData.ExportRelicArcane.forEach(relic => {
      // Get matching external API relic
      const externalRelic = this.externalApiData?.find(e => 
        `${e.name} Relic` === relic.name
      );

      if (!externalRelic) return;

      // Process each reward in the relic
      relic.relicRewards.forEach((reward, index) => {
        const externalReward = externalRelic.rewards[index];
        if (!externalReward) return;

        // Store the mapping using the external API name as key
        map[externalReward.item] = {
          uniqueName: reward.rewardName,
          type: this.determineItemType(reward.rewardName),
          sourceData: this.findSourceData(reward.rewardName)
        };
      });
    });

    this.primeNameMap = map;
  }

  private determineItemType(uniqueName: string): 'weapon' | 'warframe' | 'sentinel' {
    if (uniqueName.includes('/Weapons/')) return 'weapon';
    if (uniqueName.includes('/Warframes/')) return 'warframe';
    if (uniqueName.includes('/Sentinels/')) return 'sentinel';
    return 'weapon'; // Default to weapon if unknown
  }

  private findSourceData(uniqueName: string): WeaponData | WarframeData | SentinelData | null {
    const type = this.determineItemType(uniqueName);
    const data = {
      weapon: this.weaponsData?.ExportWeapons,
      warframe: this.warframeData?.ExportWarframes,
      sentinel: this.sentinelsData?.ExportSentinels
    }[type];

    return data?.find(item => item.uniqueName === uniqueName) || null;
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
      this.externalApiData = externalData.relics;
      this.externalApiDataPrimes = externalData.primes;
      this.lastExternalApiRefresh = Date.now();
      
      // Build the prime name mapping
      this.buildPrimeNameMap();
      
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

  private async fetchExternalApiData(): Promise<ExternalApiResponse> {
    try {
      const response = await axios.get<ExternalApiResponse>('https://aetools.koyeb.app/api/explorer', {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      log(
        `Failed to fetch external API data: ${error}`,
        "src/api/apiCache.ts",
        "fetchExternalApiData"
      );
      return {
        relics: [],
        primes: []
      };
    }
  }

  public async getExternalApiData(): Promise<ExternalApiResponse | null> {
    const now = Date.now();
    if (!this.externalApiData || (now - this.lastExternalApiRefresh) >= this.EXTERNAL_API_REFRESH_INTERVAL) {
      try {
        const response = await this.fetchExternalApiData();
        this.externalApiData = response.relics;
        this.externalApiDataPrimes = response.primes;
        this.lastExternalApiRefresh = now;
        // Rebuild the prime name mapping when external data is refreshed
        this.buildPrimeNameMap();
      } catch (error) {
        log(
          `Failed to refresh external API data: ${error}`,
          "src/api/apiCache.ts",
          "getExternalApiData"
        );
      }
    }
    return {
      relics: this.externalApiData || [],
      primes: this.externalApiDataPrimes || []
    };
  }

  public getPrimeNameMap(): PrimeNameMap {
    return this.primeNameMap;
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