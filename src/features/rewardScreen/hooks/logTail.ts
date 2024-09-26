import store from "../../../app/shared/store";
import { log } from "../../../lib/log";
import { setRewards } from "../../../screens/ingame/stores/rewards";

class logTail {
    static FILEPATH = `${overwolf.io.paths.localAppData}\\Warframe\\EE.log`;
    static ACTIVE = false;
    static EVENTS = {
        START: "Sys [Info]: Created /Lotus/Interface/ProjectionsCountdown.swf", // rewards are starting
        READY: "Script [Info]: ProjectionsCountdown.lua: Initialize timer nil", // rewards are displayed
        END: "Script [Info]: ProjectionsCountdown.lua: Countdown timer expired", // ended
    }

    constructor() {}

    start() {
        if (logTail.ACTIVE) return;
        logTail.ACTIVE = true;
        
        log("Log tail started", "src/features/rewardScreen/hooks/logTail.ts", "start");
        overwolf.io.listenOnFile("EE.log", logTail.FILEPATH, {
            skipToEnd: true,
            // @ts-ignore
            encoding: overwolf.io.enums.eEncoding.UTF8,
        }, (data) => {
            if (data.content?.includes(logTail.EVENTS.START)) {
                // as log tailing never always succeeds at dispatching READY event, we need to dispatch it manually
                setTimeout(() => {
                  store.dispatch(setRewards("START"))
                }, 2000);
                setTimeout(() => {
                  store.dispatch(setRewards("START"))
                }, 5400);
            } else if (data.content?.includes(logTail.EVENTS.READY)) {
                store.dispatch(setRewards("READY"))
            } else if (data.content?.includes(logTail.EVENTS.END)) {
                store.dispatch(setRewards("END"))
            }
        })
    }

    stop() {
        overwolf.io.stopFileListener("EE.log");
        log("Log tail stopped", "src/features/rewardScreen/hooks/logTail.ts", "stop");
    }
}

export default new logTail();
