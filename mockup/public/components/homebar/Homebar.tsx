import React from 'react';
import './homebar.css';

interface HomebarArgs {
    expanded: boolean,
    setExpansion: React.Dispatch<React.SetStateAction<boolean>>
}

const Homebar: React.FC<HomebarArgs> = ({ expanded, setExpansion }) => {
    
    return (
        <>
            <div className="homebar">
                <div className="logo" id="tflogo">
                    <img src="/img/TreasuryFrame.png" alt="" onClick={() => setExpansion(!expanded)}/>
                </div>
                <div className={expanded ? "text" : "text collapsed"}>TreasuryFrame</div>
                <div className="userinfo">
                    <img src="/img/avatar.png" alt="" />
                    <span>Username</span>
                </div>
                <div className="helper">
                    <img src="/img/info.png" alt="" />
                    <img src="/img/discord.webp" alt="" />
                    <img src="/img/minimize.png" alt="" />
                    <img src="/img/maximize.png" alt="" />
                    <img src="/img/exit.png" alt="" />
                </div>
            </div>
        </>
    )
}

export default Homebar;