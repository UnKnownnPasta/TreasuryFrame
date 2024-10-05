import { useState } from "react";
import ItemView from "../../../components/itemView/components/ItemView";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import Settings from "../../../features/settings";
import { Loading } from "../../../components/Loading";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {
    const [currentView, setCurrentView] = useState<windowViewStateType>("SETTINGS")

    return (
        <div className="desktop">
            <DesktopHeader setWindowView={setCurrentView}/>
            {
                currentView === "MAIN" 
                ? <div className={"desktop__container"}>
                      <ItemView />
                  </div>
                : currentView === "SETTINGS"
                ? <Settings setWindowView={setCurrentView} />
                : <Loading />
            }
        </div>
    );
};

export default Screen;
