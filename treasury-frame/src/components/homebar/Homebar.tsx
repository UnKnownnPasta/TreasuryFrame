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
                    <img src="/TreasuryFrame.png" alt="" onClick={() => setExpansion(!expanded)}/>
                </div>
                <div className={expanded ? "text" : "text collapsed"}>TreasuryFrame</div>
                <div className="userinfo">
                    <img src="/avatar.png" alt="" />
                    <span>Username</span>
                </div>
                <div className="helper">
                    <img src="/info.png" alt="" />
                    <img src="/discord.webp" alt="" />
                    <img src="/minimize.png" alt="" />
                    <img src="/maximize.png" alt="" />
                    <img src="/exit.png" alt="" />
                </div>
            </div>
        </>
    )
}

export default Homebar;