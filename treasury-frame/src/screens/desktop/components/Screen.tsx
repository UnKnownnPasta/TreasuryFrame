import { Title } from "../../../components/Title";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {
	return (
		<div className="desktop">
			<DesktopHeader />
			<div className={"desktop__container"}>
				<header className={"desktop__header desktop__fit"}>
					<Title color="white">
						Current Locale: <b>English 🌐</b>
						<br />
					</Title>
				</header>
			</div>
		</div>
	);
};

export default Screen;
