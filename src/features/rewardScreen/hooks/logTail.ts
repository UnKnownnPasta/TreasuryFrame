import store from "../../../app/shared/store";
import { log } from "../../../lib/log";
import { fetchByWeb } from "../../../screens/background/components/Decipher";
import { setPrimeData, setRelicArcanes } from "../../../screens/background/stores/data";
import { setRewards } from "../../../screens/ingame/stores/rewards";

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
        
        console.log(relicData);
        
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

                    const findNameInWarframeData = warframeData.find(item => item.uniqueName === reward.rewardName);
                    if (findNameInWarframeData) {
                        PrimeData.push({
                            ItemInternal: reward.rewardName,
                            ItemPlayer: findNameInWarframeData.name
                        })
                    } else {
                        const findNameInWeaponData = weaponData.find(item => item.uniqueName === reward.rewardName);
                        if (findNameInWeaponData) {
                            PrimeData.push({
                                ItemInternal: reward.rewardName,
                                ItemPlayer: findNameInWeaponData.name
                            })
                        }
                    }
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
