interface rewardProp {
    rewardName: string;
    rarity: "RARE" | "UNCOMMON";
    tier: number;
    itemCount: number
}

interface Item {
    ItemType: string;
    ItemCount: number;
}

interface RelicSchema {
    uniqueName: string;
    name: string;
    description: string;
    codexSecret: boolean;
    relicRewards: rewardProp[];
}

type primePart = "ED" | "RED" | "ORANGE" | "YELLOW" | "GREEN"

interface rewardItemProp {
    name: string;
    color: primePart;
    stock: number;
}

interface TreasuryItem {
    name: string;
    vaulted: boolean;
    tokens: string;
    rewards: rewardItemProp[];
}