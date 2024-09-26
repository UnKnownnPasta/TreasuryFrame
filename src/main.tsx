import "./overwolf.dev.mock";
import store from "./app/shared/store";
import i18next from "i18next";
import { resources } from "./locales";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { App } from "./app/components/App";

const container = document.getElementById("root");
const root = createRoot(container!);

const OverwolfApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

declare global {
  interface Window {
    cv: typeof import('mirada/dist/src/types/opencv/_types');
  }
}

/*
 * before render app, get overwolf language
 * then load resources, default to en if not detected
 * @see  https://overwolf.github.io/docs/api/overwolf-settings-language
 */
overwolf.settings.language.get(({ language }) => {
    i18next.use(initReactI18next).init(
        {
            resources,
            lng: language,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false,
            },
        },
        () => {
            root.render(<OverwolfApp />);
        }
    );
});

// detect change overwolf language and set i18next language
// then load resources
const changeLanguage = ({
    language,
}: overwolf.settings.language.LanguageChangedEvent) =>
    i18next.changeLanguage(language);

overwolf.settings.language.onLanguageChanged.removeListener(changeLanguage);
overwolf.settings.language.onLanguageChanged.addListener(changeLanguage);
