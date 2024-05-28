import React from 'react';
import './sidebar.css';
import { getGameInfo } from '../../lib/game-info';

interface SidebarProp {
    expanded: boolean
}

const Sidebar: React.FC<SidebarProp> = ({ expanded }) => {
    const doStuff = async () => {
        await getGameInfo().then((res) => {
            console.log(res);
        })
    }

    return (
        <>
            <button onClick={doStuff}></button>
            <div className={expanded ? "sidebar" : "sidebar collapsed"} id="main-sidebar">
                <div className="item"><img src="/weapon.png" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Parts</span></div>
                <div className="item"><img src="/relic.webp" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Relics</span></div>
                <div className="item"><img src="/resource.webp" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Resources</span></div>
                <div className="item"><img src="/fissures.webp" /><span className={expanded ? "sidebar-item" : "sidebar-item collapsed"}>Fissures</span></div>
            </div>
        </>
    )
}

export default Sidebar;
