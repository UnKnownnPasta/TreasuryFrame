import React from 'react';
import './sidebar.css';

interface SidebarProp {
    expanded: boolean
}

const Sidebar: React.FC<SidebarProp> = ({ expanded }) => {
    return (
        <>
            <div className={expanded ? "sidebar" : "sidebar collapsed"} id="main-sidebar">
                <div className="item"><img src="/img/weapon.png" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Parts</span></div>
                <div className="item"><img src="/img/relic.webp" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Relics</span></div>
                <div className="item"><img src="/img/resource.webp" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Resources</span></div>
                <div className="item"><img src="/img/fissures.webp" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Fissures</span></div>
            </div>
        </>
    )
}

export default Sidebar;
