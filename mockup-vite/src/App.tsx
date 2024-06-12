import "./App.css";
import ActionBar from "./components/actionbar/ActionBar";
import Content from "./components/content/Content";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
    return <div className="container">
        <ActionBar />
        <Sidebar />
        <Content />
    </div>;
}

export default App;
