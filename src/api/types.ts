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

export type fybType = exportRelicArcane | exportWeapons | exportSentinels | exportWarframes | exportManifest | exportSentinels;

export type LineKey = "RelicArcane" | "Weapons" | "Sentinels" | "Warframes" | "Manifest";

export interface ItemObject {
  ItemType: string;
  ItemCount: number;
}

export interface RelicData {
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

export interface WeaponData {
  uniqueName: string;
  name: string;
  [key: string]: any;
}

export interface WarframeData {
  uniqueName: string;
  name: string;
  [key: string]: any;
}

export interface SentinelData {
  uniqueName: string;
  name: string;
  [key: string]: any;
}

/**
 *         {
            "name": "Axi A1",
            "rewards": [
                {
                    "item": "Trinity Systems",
                    "x2": false,
                    "stock": 40,
                    "color": "YELLOW",
                    "rarity": 25.33,
                    "relicFrom": "Axi A1"
                },
 */
export interface ExternalRelicData {
  name: string;
  rewards: {
    item: string;
    x2: boolean;
    stock: number;
    color: string;
    rarity: number;
    relicFrom: string;
  }[];
}

export interface ExternalApiResponse {
  relics: ExternalRelicData[];
  // Add other fields from your external API as needed
} 