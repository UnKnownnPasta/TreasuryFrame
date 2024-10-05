import {
    REQUIRED_FEATURES,
    WINDOW_NAMES,
    RETRY_TIMES,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "../../../app/shared/constants";
import { useGameEventProvider, useWindow } from "overwolf-hooks";
import { useCallback, useEffect } from "react";
import { WARFRAME_CLASS_ID, getWarframeGame } from "../../../lib/games";
import { setInventory } from "../stores/inventory";
import store from "../../../app/shared/store";
import { log } from "../../../lib/log";
import { sanitizeJsonString } from "../../../lib/utils";
import logTail from "../../../features/rewardScreen/hooks/logTail";
import { updateRelicInfo } from "./GSFetch";
import { setPart, setRelic } from "../stores/prime";

const { DESKTOP, INGAME } = WINDOW_NAMES;

const BackgroundWindow = () => {
    const [desktop] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
    const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);
    
    const { start, stop } = useGameEventProvider(
        {
            onInfoUpdates: (info) => {
                try {
                    // @ts-ignore
                    const jsonData = sanitizeJsonString(info.info.match_info?.inventory ?? "{}");
                    if (jsonData) store.dispatch(setInventory(jsonData));
                } catch (error) {}
            },
            onNewEvents: () => null, //warframe has no event-based updates
        },
        REQUIRED_FEATURES,
        RETRY_TIMES,
        DISPLAY_OVERWOLF_HOOKS_LOGS
    );
    const startApp = useCallback(
        async (reason: string) => {
            //if the desktop or ingame window is not ready we don't want to start the app
            if (!desktop || !ingame) return;
            log(
                reason,
                "src/screens/background/components/Screen.tsx",
                "startApp"
            );
            const warframe = await getWarframeGame();
            if (warframe) {
                const [relicData, partData] = await updateRelicInfo();

                store.dispatch(setRelic(relicData));
                store.dispatch(setPart(partData));
                await logTail.start();

                await Promise.all([
                    start(),
                    ingame?.restore(),
                    desktop?.minimize(),
                ]);
            } else {
                logTail.stop();
                log("Log tail stopped", "src/screens/background/components/Screen.tsx", "startApp");
                await Promise.all([stop(), desktop?.restore()]);
            }
        },
        [desktop, ingame, start, stop]
    );

    useEffect(() => {
        startApp("on initial load");
        overwolf.games.onGameInfoUpdated.addListener(async (event) => {
            if (
                event.runningChanged &&
                event.gameInfo?.classId === WARFRAME_CLASS_ID
            ) {
                startApp("onGameInfoUpdated");
            }
        });
        overwolf.extensions.onAppLaunchTriggered.addListener(() => {
            startApp("onAppLaunchTriggered");
        });
        return () => {
            overwolf.games.onGameInfoUpdated.removeListener(() => {});
            overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
        };
    }, [startApp]);

    return null;
};

export default BackgroundWindow;
