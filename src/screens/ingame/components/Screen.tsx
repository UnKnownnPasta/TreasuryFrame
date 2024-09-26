import "./styles/Screen.css";
import RwScrn from "../../../features/rewardScreen/components/rwScrn";
import { useState } from "react";
import { classNames } from "../../../lib/utils";

const Screen = () => {
    const [visible, setVisibility] = useState(false)

    return (
        <div className={classNames("ingame", visible ? "visible" : "")}>
            <RwScrn vsb={setVisibility}/>
        </div>
    );
};

export default Screen;
