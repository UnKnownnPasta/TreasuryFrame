import { log } from "../lib/log";
import axios from "axios";
import store from '../app/shared/store';
import { setTranslatedRelicInfo, setTranslatedPrimeInfo } from '../screens/background/stores/background';
import { apiCache } from './apiCache';
import {
  exportRelicArcane,
  exportWeapons,
  exportSentinels,
  exportWarframes,
  exportManifest,
  fybType,
  LineKey,
  ItemObject,
  RelicData,
  WeaponData,
  WarframeData,
  SentinelData,
  ExternalRelicData,
} from './types';

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
const extractId = (path: string): string => path.split('/').pop() || '';
const splitCamel = (str: string): string[] => str.match(/[A-Z][a-z0-9]*/g) || [str];

// Processing functions
const processRelicData = (relicData: RelicData, externalData?: ExternalRelicData): any => {
  return {
    ...externalData,
    uniqueName: relicData.uniqueName,
    processedName: relicData.name,
    description: relicData.description,
  };
};

const processPrimeData = (data: WeaponData | WarframeData | SentinelData): any => {
  return {
    primeUniqueName: data.uniqueName,
    type: 'prime'
  };
};

function smartJoin(arr1: string[], arr2: string[], arr3: string[]): string | null {
  const sameSeq = arr2.length === arr3.length &&
                  arr2.every((v, i) => v === arr3[i]);

  const fullPrefix = arr2.every((v, i) => arr1[i] === v);
  if (sameSeq && fullPrefix) return arr1.join(' ');

  const arr3Prefix = arr3.every((v, i) => arr1[i] === v);
  if (arr3Prefix) return [...arr3, ...arr1.slice(arr3.length)].join(' ');

  let L = 0;
  while (L < arr1.length && L < arr2.length && arr1[L] === arr2[L]) L++;

  if (L > 1) {
    const suffix = arr1.slice(L);
    const trimmed = suffix.length > 1 ? suffix.slice(1) : suffix;
    return [...arr3, ...trimmed].join(' ');
  }

  const fuzzyIndex = arr1.findIndex(token => token.includes(arr3[0]));
  if (fuzzyIndex !== -1 && fuzzyIndex < arr1.length - 1) {
    return [...arr3, ...arr1.slice(fuzzyIndex + 1)].join(' ');
  }

  return null;
}

// Main processing function
export const processInventoryData = async (inventory: ItemObject[]): Promise<void> => {
  try {
    if (!apiCache.isDataInitialized()) {
      await apiCache.initialize();
    }

    const relicData = apiCache.getRelicData();
    const weaponsData = apiCache.getWeaponsData();
    const warframeData = apiCache.getWarframeData();
    const sentinelData = apiCache.getSentinelsData();
    const externalApiData = await apiCache.getExternalApiData();

    if (!relicData || !weaponsData || !warframeData || !sentinelData) {
      throw new Error('API cache not properly initialized');
    }

    const relics: RelicData[] = relicData.ExportRelicArcane || [];
    const weapons: WeaponData[] = weaponsData.ExportWeapons || [];
    const warframes: WarframeData[] = warframeData.ExportWarframes || [];
    const sentinels: SentinelData[] = sentinelData.ExportSentinels || [];
    const allItems = [...weapons, ...warframes, ...sentinels];

    // Reset store data before processing new items
    store.dispatch(setTranslatedRelicInfo({
      uniqueName: '',
      processedName: '',
      description: '',
      inventoryCount: 0
    }));
    store.dispatch(setTranslatedPrimeInfo({}));

    // Process each inventory item
    for (const item of inventory) {
      const id = extractId(item.ItemType);
      
      const relicMatch = relics.find(r => extractId(r.uniqueName) === id);
      if (relicMatch) {
        const externalMatch = externalApiData?.find(e => `${e.name} Relic` === relicMatch.name);
        const processedRelic = processRelicData(relicMatch, externalMatch);
        store.dispatch(setTranslatedRelicInfo({
          ...processedRelic,
          inventoryCount: item.ItemCount,
        }));
        continue;
      }

      const parts = splitCamel(id);
      
      for (const primeItem of allItems) {
        const nameParts = primeItem.name.split(" ");
        const uniqueNameParts = splitCamel(extractId(primeItem.uniqueName));
        if (!nameParts.includes("Prime") || !uniqueNameParts.includes("Prime") || !parts.includes("Prime")) continue;

        const result = smartJoin(parts, uniqueNameParts, nameParts);
        if (result) {
          const processedPrime = processPrimeData(primeItem);
          store.dispatch(setTranslatedPrimeInfo({
            ...processedPrime,
            ItemInventoryName: id,
            ItemName: result,
            ItemOwnedCount: item.ItemCount
          }));
          break;
        }
      }
    }
  } catch (error) {
    log(
      `Error processing inventory data: ${error}`,
      "src/api/apiAggregator.ts",
      "processInventoryData"
    );
  }
};

// Export the main function
export default processInventoryData;
