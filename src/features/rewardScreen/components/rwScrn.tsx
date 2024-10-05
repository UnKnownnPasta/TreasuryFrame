import { useSelector } from "react-redux";
import "./rwScrn.css";
import { RootReducer } from "../../../app/shared/rootReducer";
import { ocr, testForPrimeParts } from "../hooks/ocr";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { log } from "../../../lib/log";
import { classNames } from "../../../lib/utils";

interface rwSrcnProps {
    vsb: Dispatch<SetStateAction<boolean>>;
}

const stockRange = (num: number): string => 
    num >= 0 && num <= 9 ? 'ED'
    : num > 9 && num <= 15 ? 'RED'
    : num > 15 && num <= 31 ? 'ORANGE'
    : num > 31 && num <= 64 ? 'YELLOW'
    : num > 64 ? 'GREEN' : '';

const RwScrn = ({ vsb }: rwSrcnProps) => {
    const [ocrResult, setOcrResult] = useState([""]);
    const { rewards } = useSelector(
        (state: RootReducer) => state.rewards,
    );
    const { parts } = useSelector(
        (state: RootReducer) => state.relic,
    );

    useEffect(() => {
        if (rewards === "READY" || rewards === "START") {
            log(`Rewards: ${rewards}`, "src/features/rewardScreen/components/rwScrn.tsx", "useEffect");
            vsb(true);
            overwolf.media.takeScreenshot(
                async (result) => {
                    if (!result.success) return;
                    if (!result.url) return;
                    
                    const res = await ocr(result.url);
                    const testData = testForPrimeParts(res.join(" | "), parts);
                    setOcrResult(ocrResult => [... new Set([...ocrResult, ...testData])]);
                }
            )
        } else if (rewards === "END") {
            vsb(false);
            setOcrResult([""]);
        }
    }, [rewards]);

    return (
        <div>
            {(rewards === "READY" || rewards === "START") ? ocrResult.filter(line => line !== "").map((line, index) => 
            {
                const lineSplitted = line.split('|');
                const partStockStatus = stockRange(parseInt(lineSplitted[0].slice(0, -1)))
                
                return <div key={index} className="ingame__line">
                    <div className="ingame__line__stock">{lineSplitted[0]}</div>
                    <div className={classNames("ingame__line__status", partStockStatus)}>{partStockStatus}</div>
                    <div className="ingame__line__part">{lineSplitted[1] || "abcdbabcsdffdjhk"}</div>
                </div>
            }
            ) || <div className="ingame__line__part">Awaiting Results...</div> : ""}
        </div>
    );
};

export default RwScrn;
