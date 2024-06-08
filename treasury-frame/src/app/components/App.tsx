import { useEffect, useState, Suspense } from "react";
import { CurrentScreen } from "./CurrentScreen";
import { Loading } from "../../components/Loading";
import { getCurrentWindow } from "../../lib/overwolf-essentials";
import "../shared/root.css";
import { log } from "../../lib/log";
import { fetchWFSchema } from "../../features/relicRecords";
import { openDatabase } from "../../lib/db";

//This is the main component of the app, it is the root of the app
//each Page component is rendered in a different window
//if NODE_ENV is set to development, the app will render in a window named 'dev'
export const App = () => {
  const [screenName, setScreenName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async function preLoad() {
			try {
				const [currentWindow] = await Promise.all([
					getCurrentWindow(),
					// fetchWFSchema(),
				]);

				// const db = await openDatabase()

				setScreenName(currentWindow);
				log(
					`Request screen: ${currentWindow}`,
					"src/app/components/App.tsx",
					"useEffect"
				);
			} catch (error) {
				console.error("Error occurred during data fetching:", error);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return <CurrentScreen name={screenName} />;
};
