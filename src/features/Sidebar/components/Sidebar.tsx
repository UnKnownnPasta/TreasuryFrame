import './sidebar.css'
type pageProps = "inventory" | "soupstore"

interface SidebarProps {
  activePage: string;
  setActivePage: (page: pageProps) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <div className="sidebar">
      <div 
        className={`sidebar-item ${activePage === 'inventory' ? 'active' : ''}`}
        onClick={() => setActivePage('inventory')}
      >
        <span className="icon">
          <img src="https://placehold.co/45x45" alt="" />
        </span>
        <span className="name">Relic Inventory</span>
      </div>
      <div 
        className={`sidebar-item ${activePage === 'soupstore' ? 'active' : ''}`}
        onClick={() => setActivePage('soupstore')}
      >
        <span className="icon">
          <img src="https://placehold.co/45x45" alt="" />
        </span>
        <span className="name">Soup Store</span>
      </div>
    </div>
  );
}

export default Sidebar;
