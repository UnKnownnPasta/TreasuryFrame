import { log } from "../lib/log";
import axios from "axios";
import store from '../app/shared/store';
import { setTranslatedRelicInfo, setTranslatedPrimeInfo } from '../screens/background/stores/background';
import { apiCache } from './apiCache';

export type relicReward = {
  "rewardName": string,
  "rarity": "RARE" | "UNCOMMON" | "COMMON",
  "tier": number,
  "itemCount": number
}

export type exportRelicArcane =  {
  "ExportRelicArcane": {
    uniqueName: string,
    name: string,
    codexSecret: boolean,
    description: string,
    relicRewards: relicReward[]
  }[]
}

export type exportWeapons = {
  "ExportWeapons": {
    uniqueName: string,
    name: string,
    codexSecret: boolean,
    description: string,
    masteryReq: number,
    productCategory: string,
    slot: number
  }[],
  "ExportRailjackWeapons": {
    uniqueName: string,
    name: string,
    codexSecret: boolean,
    description: string,
    masteryReq: number,
    productCategory: string,
    slot: number
  }[]
}

export type exportSentinels = {
  "ExportSentinels": {
    uniqueName: string,
    name: string,
    codexSecret: boolean,
    description: string,
    masteryReq: number,
    productCategory: string,
    slot: number
  }[]
}

export type Ability = {
  abilityUniqueName: string;
  abilityName: string;
  description: string;
};

export type exportWarframes = {
  "ExportWarframes": {
    uniqueName: string;
    name: string;
    parentName: string;
    description: string;
    health: number;
    shield: number;
    armor: number;
    stamina: number;
    power: number;
    codexSecret: boolean;
    masteryReq: number;
    sprintSpeed: number;
    abilities: Ability[];
    productCategory: string;
  }[];
};

export type exportManifest = string;

export type fybType = exportRelicArcane | exportWeapons | exportSentinels | exportWarframes | exportManifest;

export async function fetchByWeb(line: number): Promise<fybType> {
  try {
    // Fetch LZMA data
    const response = await axios.get(
      'https://origin.warframe.com/PublicExport/index_en.txt.lzma',
      { 
        responseType: "arraybuffer",
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.data) {
      throw new Error('No data received from Warframe API');
    }

    // Decompress LZMA data using worker
    const decompressedData = await new Promise<string>((resolve, reject) => {
      //@ts-ignore
      LZMA.decompress(new Uint8Array(response.data), (result: unknown, err: unknown) => {
        if (err) {
          reject(new Error('Failed to decompress LZMA data'));
          return;
        }

        if (!result || typeof result !== "string") {
          reject(new Error('Failed to decompress LZMA data'));
          return;
          }

          const lines = result.split("\n");
          if (line >= lines.length) {
            reject(new Error(`Line ${line} is out of bounds (total lines: ${lines.length})`));
            return;
          }

          resolve(result);
        })
    });

    if (!decompressedData || typeof decompressedData !== "string") {
      throw new Error('Failed to decompress LZMA data');
    }

    // Extract and validate line data
    const lines = decompressedData.split("\n");
    if (line >= lines.length) {
      throw new Error(`Line ${line} is out of bounds (total lines: ${lines.length})`);
    }

    const extract_en_data = lines[line];
    if (!extract_en_data) {
      throw new Error(`No data found at line ${line}`);
    }

    // Fetch schema data
    const schemaResponse = await axios.get(
      `https://content.warframe.com/PublicExport/Manifest/${extract_en_data}`,
      { timeout: 10000 }
    );

    if (!schemaResponse.data) {
      throw new Error('No schema data received');
    }

    return schemaResponse.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log(
      `LZMA Error: ${errorMessage}`,
      "src/api/apiAggregator.ts",
      "fetchByWeb"
    );
    throw error; // Re-throw to be handled by the caller
  }
}

type LineKey = "RelicArcane" | "Weapons" | "Sentinels" | "Warframes" | "Manifest";
const LineKeyMap = {
  "RelicArcane": 8,
  "Sentinels": 10,
  "Warframes": 13,
  "Weapons": 14,
  "Manifest": 15
}
async function fbwWrapper(line: "RelicArcane"): Promise<exportRelicArcane>;
async function fbwWrapper(line: "Weapons"): Promise<exportWeapons>;
async function fbwWrapper(line: "Sentinels"): Promise<exportSentinels>;
async function fbwWrapper(line: "Warframes"): Promise<exportWarframes>;
async function fbwWrapper(line: "Manifest"): Promise<exportManifest>;
async function fbwWrapper(line: LineKey): Promise<fybType> {
  const request = LineKeyMap[line];
  return new Promise((resolve, reject) => {
    fetchByWeb(request).then((data) => {
      if (data) {
        resolve(data);
      } else {
        reject("Failed to fetch name translations");
      }
    });
  })
}

export { fbwWrapper };

// Utility functions
const extractId = (path: string): string => {
  return path.split('/').pop() || '';
};

const splitCamel = (str: string): string[] => {return str.match(/[A-Z][a-z0-9]*/g) || [str];};

// Type definitions
interface ItemObject {
  ItemType: string;
  ItemCount: number;
}

interface RelicData {
  uniqueName: string;
  name: string;
  codexSecret: boolean;
  description: string;
  relicRewards: Array<{
    rewardName: string;
    rarity: string;
    tier: number;
    itemCount: number;
  }>;
}

interface WeaponData {
  uniqueName: string;
  name: string;
  [key: string]: any;
}

interface WarframeData {
  uniqueName: string;
  name: string;
  [key: string]: any;
}

// Processing functions
const processRelicData = (relicData: RelicData): any => {
  return {
    uniqueName: relicData.uniqueName,
    name: relicData.name,
    description: relicData.description,
    rewards: relicData.relicRewards.map(reward => ({
      name: reward.rewardName,
      rarity: reward.rarity,
      tier: reward.tier,
      count: reward.itemCount
    }))
  };
};

const processPrimeData = (data: WeaponData | WarframeData): any => {
  return {
    uniqueName: data.uniqueName,
    name: data.name,
    type: 'weapon' in data ? 'weapon' : 'warframe',
    // Add any additional processing needed for prime items
  };
};

function smartJoin(arr1: string[], arr2: string[], arr3: string[]): string | null {
  const isPrefix = (pre: string[], full: string[]): boolean =>
    pre.every((v: string, i: number) => full[i] === v);

  // 1) exact same & prefix → full arr1  
  if (
    arr2.length === arr3.length &&
    arr2.every((v: string, i: number) => v === arr3[i]) &&
    isPrefix(arr2, arr1)
  ) {
    return arr1.join(' ');
  }

  // 2) arr3 is prefix → arr3 + (arr1 minus arr3)  
  if (isPrefix(arr3, arr1)) {
    return [...arr3, ...arr1.slice(arr3.length)].join(' ');
  }

  // 3) arr2 is prefix → arr3 + (arr1 minus arr2)  
  if (isPrefix(arr2, arr1)) {
    return [...arr3, ...arr1.slice(arr2.length)].join(' ');
  }

  // 4) no meaningful overlap  
  return null;
}



// Main processing function
export const processInventoryData = async (inventory: ItemObject[]): Promise<void> => {
  try {
    // Initialize cache if not already initialized
    if (!apiCache.isDataInitialized()) {
      await apiCache.initialize();
    }

    // Get data from cache
    const relicData = apiCache.getRelicData();
    const weaponsData = apiCache.getWeaponsData();
    const warframeData = apiCache.getWarframeData();

    if (!relicData || !weaponsData || !warframeData) {
      throw new Error('API cache not properly initialized');
    }

    const relics: RelicData[] = relicData.ExportRelicArcane || [];
    const weapons: WeaponData[] = weaponsData.ExportWeapons || [];
    const warframes: WarframeData[] = warframeData.ExportWarframes || [];

    // Process each inventory item
    for (const item of inventory) {
      const id = extractId(item.ItemType);
      
      // Check for relic match
      const relicMatch = relics.find(r => extractId(r.uniqueName) === id);
      if (relicMatch) {
        const processedRelic = processRelicData(relicMatch);
        store.dispatch(setTranslatedRelicInfo({
          ...processedRelic,
          count: item.ItemCount
        }));
        continue;
      }

      // Check for prime item match
      const parts = splitCamel(id);
      const allItems = [...weapons, ...warframes];
      
      for (const primeItem of allItems) {
        const nameParts = primeItem.name.split(" ");
        const uniqueNameParts = splitCamel(extractId(primeItem.uniqueName));
        if (!nameParts.includes("Prime") || !uniqueNameParts.includes("Prime") || !parts.includes("Prime")) continue;

        const result = smartJoin(parts, uniqueNameParts, nameParts);
        if (result) {
          const processedPrime = processPrimeData(primeItem);
          store.dispatch(setTranslatedPrimeInfo({
            ...processedPrime,
            name: result,
            count: item.ItemCount
          }));
          break;
        }
      }
    }
  } catch (error) {
    console.error('Error processing inventory data:', error);
  }
};

// Export the main function
export default processInventoryData;
