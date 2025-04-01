import "./overwolf.dev.mock";
import store from "./app/shared/store";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./app/components/App";

const container = document.getElementById("root");
const root = createRoot(container!);

const OverwolfApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

root.render(<OverwolfApp />);
