import React from "react";
import "./sidebar.css";

type sidebarProps = {
  selected: string,
  setSelected: React.Dispatch<React.SetStateAction<string>>
}

const Sidebar = ({ selected, setSelected }: sidebarProps) => {
    const getClassSettings = (setting: string) => {
      return setting === selected ? `option selected` : 'option';
    }
    const setClassSettings = (e: React.MouseEvent, setting: string) => {
      setSelected(setting)
    }

    return (
        <div className="sidebar">
            <div className="user-info" onClick={(e) => setClassSettings(e, '')}>
                <div className="spans">
                    <img src="./avatar.png" alt=""/>
                    <span className="mastery">MR 22</span>
                </div>
                <span className="username">UsernameNormal</span>
            </div>
            <div className="options-list">
                <div className={getClassSettings('relic')} onClick={(e) => setClassSettings(e, 'relic')}>
                    <img src="./relic.svg" alt="" />
                    <span>Relic</span>
                </div>
                <div className={getClassSettings('resource')} onClick={(e) => setClassSettings(e, 'resource')} >
                    <img src="./resource.svg" alt="" />
                    <span>Resource</span>
                </div>
                <div className={getClassSettings('part')} onClick={(e) => setClassSettings(e, 'part')}>
                    <img src="./weapon.svg" alt="" />
                    <span>Part</span>
                </div>
                <div className={getClassSettings('log')} onClick={(e) => setClassSettings(e, 'log')}>
                    <img src="./log.svg" alt="" />
                    <span>Logs</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
