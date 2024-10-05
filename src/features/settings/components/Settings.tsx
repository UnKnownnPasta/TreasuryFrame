import { Dispatch, SetStateAction, useState } from 'react';
import './styles/settings.css'
import { classNames } from '../../../lib/utils';
type windowViewStateType = "MAIN" | "SETTINGS"

const Settings = ({ setWindowView }: { setWindowView: Dispatch<SetStateAction<windowViewStateType>> }) => {
    const [checkedButton, setCheckedButton] = useState<boolean>(false)
    const optionsObjectORJson = {
        "overlay.enabled": true,
        "overlay.crop.shift": "123.125",
        "overlay.crop.divide": "0.5",
    }

    return (
        <div className='settings'>
            <div className="settings__top">
                <h2>Settings</h2>
                <button className={classNames("settings__buttonmain")} onClick={() => setWindowView("MAIN")}>
                    <svg fill="#ffffff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.707 47.707" xmlSpace="preserve">
    <path d="M45.146,45.707h-24c-9.925,0-18-8.075-18-18s8.075-18,18-18h21.586L36.439,16l1.414,1.414l7.999-7.999
    c0.001-0.001,0.001-0.001,0.002-0.002l0.706-0.706l-0.706-0.706C45.854,8,45.853,8,45.853,7.999L37.854,0l-1.414,1.414l6.293,6.293
    H21.146c-11.028,0-20,8.972-20,20s8.972,20,20,20h24c0.552,0,1-0.447,1-1S45.699,45.707,45.146,45.707z"/>
                    </svg>
                    <span className="settings__buttonmain__text">RETURN</span>
                </button>
            </div>
            <div className="settings__info">
                <hr className='settings__hr'></hr>
                {Object.entries(optionsObjectORJson).map(([key, value], i) => {
                    return (
                        <div className="settings__option" key={i}>
                            <h3 className="settings__option__title">{`⚙ ${key}`}</h3>
                            <button className="settings__option__button" onClick={() => {
                                setCheckedButton(!checkedButton);

                            }}>
                                {`${value}`}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Settings;
