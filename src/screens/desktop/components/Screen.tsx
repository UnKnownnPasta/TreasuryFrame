import ItemView from "../../../components/itemView/components/ItemView";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {
    return (
        <div className="desktop">
            <DesktopHeader />
            <div className={"desktop__container"}>
                <ItemView />
            </div>
        </div>
    );
};

export default Screen;
