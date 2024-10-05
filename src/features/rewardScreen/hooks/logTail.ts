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
        ALTEND: "Game successfully connected to: /Lotus/Levels/Proc/PlayerShip/", // ended
    }
    static lastEnd = 0;

    constructor() {}

    async start() {
        if (logTail.ACTIVE) return;
        logTail.ACTIVE = true;
        
        log("Log tail started", "src/features/rewardScreen/hooks/logTail.ts", "logstart");

        log("Fetching Warframe ItemData.", "src/features/rewardScreen/hooks/logTail.ts >> background/components/Decipher.ts", "logstart");
        const relicData = await fetchByWeb(8) as RelicData[];
        const warframeData = await fetchByWeb(13) as WarframeData[];
        const weaponData = await fetchByWeb(14) as WeaponData[];
        
        console.log(relicData);
        console.log(weaponData);
        console.log(warframeData);

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
            }

            for (const item of warframeData) {
                if (PrimeData.find(prime => prime.ItemInternal === item.uniqueName.replace("/StoreItems/", "/"))) {
                    continue;
                }
                PrimeData.push({
                    ItemInternal: item.uniqueName.replace("/StoreItems/", "/"),
                    ItemPlayer: item.name
                });
            }

            for (const item of weaponData) {
                if (PrimeData.find(prime => prime.ItemInternal === item.uniqueName.replace("/StoreItems/", "/"))) {
                    continue;
                }
                PrimeData.push({
                    ItemInternal: item.uniqueName.replace("/StoreItems/", "/"),
                    ItemPlayer: item.name
                });
            }

            store.dispatch(setRelicArcanes(RelicArcanes));
            store.dispatch(setPrimeData(PrimeData));
            log("Fetching Warframe ItemData done.", "src/features/rewardScreen/hooks/logTail.ts >> background/components/Decipher.ts", "logstart");
        } else {
            log("Fetching Warframe ItemData failed.", "src/features/rewardScreen/hooks/logTail.ts >> background/components/Decipher.ts", "logstart");
        }


        overwolf.io.listenOnFile("EE.log", logTail.FILEPATH, {
            skipToEnd: true,
            // @ts-ignore
            encoding: overwolf.io.enums.eEncoding.UTF8,
        }, (data) => {
            if (data.content?.includes(logTail.EVENTS.START)) {
                // as log tailing never always succeeds at dispatching READY event, we need to dispatch it manually
                log("Log tail: Rewards started", "src/features/rewardScreen/hooks/logTail.ts", "logstart");
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
                log("Log tail: Rewards ready", "src/features/rewardScreen/hooks/logTail.ts", "logstart");
                if (new Date().getTime() - logTail.lastEnd > 12000) {
                    store.dispatch(setRewards("READY"))
                }
            } else if (data.content?.includes(logTail.EVENTS.END) || data.content?.includes(logTail.EVENTS.ALTEND)) {
                log("Log tail: Rewards ended", "src/features/rewardScreen/hooks/logTail.ts", "logstart");
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
