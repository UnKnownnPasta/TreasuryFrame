import store from "../../../app/shared/store";
import { log } from "../../../lib/log";
import { fetchByWeb } from "../../../screens/background/components/Decipher";
import { setPrimeData, setRelicArcanes } from "../../../screens/background/stores/data";
import { setRewards } from "../../../screens/ingame/stores/rewards";

interface ItemData {
    ItemInternal: string;
    ItemPlayer: string;
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

class logTail {
    static FILEPATH = `${overwolf.io.paths.localAppData}\\Warframe\\EE.log`;
    static ACTIVE = false;
    static EVENTS = {
        START: "Sys [Info]: Created /Lotus/Interface/ProjectionsCountdown.swf", // rewards are starting
        READY: "Script [Info]: ProjectionsCountdown.lua: Initialize timer nil", // rewards are displayed
        END: "Script [Info]: ProjectionsCountdown.lua: Countdown timer expired", // ended
    }
    static lastEnd = 0;

    constructor() {}

    async start() {
        if (logTail.ACTIVE) return;
        logTail.ACTIVE = true;
        
        log("Log tail started", "src/features/rewardScreen/hooks/logTail.ts", "start");

        log("Fetching Warframe ItemData.", "src/features/rewardScreen/hooks/logTail.ts >> background/components/Decipher.ts", "start");
        const relicData = await fetchByWeb(8) as RelicData[];
        const warframeData = await fetchByWeb(13) as WarframeData[];
        const weaponData = await fetchByWeb(14) as WeaponData[];

        if (relicData) {
            const RelicArcanes: ItemData[] = [];
            const PrimeData: ItemData[] = [];

            for (const relic of relicData) {
                if (RelicArcanes.find(item => item.ItemInternal === relic.uniqueName)) {
                    continue;
                }
                RelicArcanes.push({
                    ItemInternal: relic.uniqueName,
                    ItemPlayer: relic.name,
                });

                relic.relicRewards?.map((reward) => {
                    if (PrimeData.find(item => item.ItemInternal === reward.rewardName)) {
                        return;
                    }
                    PrimeData.push({
                        ItemInternal: reward.rewardName,
                        ItemPlayer: (warframeData.find(wf => wf.uniqueName === reward.rewardName)?.name ?? weaponData.find(wp => wp.uniqueName === reward.rewardName)?.name) ?? "#NF",
                    })
                })
            }

            store.dispatch(setRelicArcanes(RelicArcanes));
            store.dispatch(setPrimeData(PrimeData));
            log("Fetching Warframe ItemData done.", "src/features/rewardScreen/hooks/logTail.ts >> background/components/Decipher.ts", "start");
        } else {
            log("Fetching Warframe ItemData failed.", "src/features/rewardScreen/hooks/logTail.ts >> background/components/Decipher.ts", "start");
        }


        overwolf.io.listenOnFile("EE.log", logTail.FILEPATH, {
            skipToEnd: true,
            // @ts-ignore
            encoding: overwolf.io.enums.eEncoding.UTF8,
        }, (data) => {
            if (data.content?.includes(logTail.EVENTS.START)) {
                // as log tailing never always succeeds at dispatching READY event, we need to dispatch it manually
                log("Log tail: Rewards started", "src/features/rewardScreen/hooks/logTail.ts", "start");
                setTimeout(() => {
                    if (new Date().getTime() - logTail.lastEnd > 12000) {
                        store.dispatch(setRewards("START"))
                    }
                }, 2000);
                setTimeout(() => {
                    if (new Date().getTime() - logTail.lastEnd > 12000) {
                        store.dispatch(setRewards("START"))                        
                    }
                }, 5400);
            } else if (data.content?.includes(logTail.EVENTS.READY)) {
                log("Log tail: Rewards ready", "src/features/rewardScreen/hooks/logTail.ts", "start");
                if (new Date().getTime() - logTail.lastEnd > 12000) {
                    store.dispatch(setRewards("READY"))
                }
            } else if (data.content?.includes(logTail.EVENTS.END)) {
                log("Log tail: Rewards ended", "src/features/rewardScreen/hooks/logTail.ts", "start");
                store.dispatch(setRewards("END"))
                logTail.lastEnd = new Date().getTime();
            }
        })
    }

    stop() {
        overwolf.io.stopFileListener("EE.log");
        log("Log tail stopped", "src/features/rewardScreen/hooks/logTail.ts", "stop");
    }
}

export default new logTail();
