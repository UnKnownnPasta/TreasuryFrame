interface ItemData {
    ItemInternal: string;
    ItemPlayer: string;
}

interface ItemType2 {
    ItemType: string;
    ItemCount: number;
    ProductCategory?: string;
}

interface rewards {
    rewardName: string;
    rarity: "RARE" | "UNCOMMON" | "COMMON";
    tier: number;
    itemCount: number;
}

interface RelicData {
    uniqueName: string;
    name: string;
    relicRewards: rewards[];
    description: string;
    codexSecret: boolean;
}

interface RecipesData {
    uniqueName: string;
    resultType: string;
    buildPrice: number;
    buildTime: number;
    skipBuildTimePrice: number;
    consumeOnUse: boolean;
    num: number;
    codexSecret: boolean;
    ingredients: ItemType2[];
    secretIngredients: ItemType2[];
}

interface Ability {
    abilityUniqueName: string;
    abilityName: string;
    description: string;
}

interface WarframeData {
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
    passiveDescription: string;
    exalted: string[];
    abilities: Ability[];
    productCategory: string;
}

interface Weapon {
    name: string;
    uniqueName: string;
    codexSecret: boolean;
    damagePerShot: number[];
    totalDamage: number;
    description: string;
    criticalChance: number;
    criticalMultiplier: number;
    procChance: number;
    fireRate: number;
    masteryReq: number;
    productCategory: string;
    slot: number;
    omegaAttenuation: number;
}

interface MeleeWeapon extends Weapon {
    blockingAngle: number;
    comboDuration: number;
    followThrough: number;
    range: number;
    slamAttack: number;
    slamRadialDamage: number;
    slamRadius: number;
    slideAttack: number;
    heavyAttackDamage: number;
    heavySlamAttack: number;
    heavySlamRadialDamage: number;
    heavySlamRadius: number;
    windUp: number;
}

interface PistolWeapon extends Weapon {
    accuracy: number;
    noise: string;
    trigger: string;
    magazineSize: number;
    reloadTime: number;
    multishot: number;
}

type WeaponData = MeleeWeapon | PistolWeapon;

type windowViewStateType = "MAIN" | "SETTINGS"
