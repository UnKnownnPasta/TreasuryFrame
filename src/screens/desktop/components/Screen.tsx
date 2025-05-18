import { useState } from "react";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { Sidebar } from "../../../features/Sidebar";
import InventoryPage from "../../../features/Inventory/components/Inventory";
import { SoupStore } from "../../../features/SoupStore";

type pageProps = "inventory" | "soupstore"

const Screen = () => {
  const [activePage, setActivePage] = useState<pageProps>('inventory');

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktop__container"}>
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="content">
          {activePage === 'inventory' ? <InventoryPage /> : <SoupStore />}
        </div>
      </div>
    </div>
  );
};

export default Screen;
