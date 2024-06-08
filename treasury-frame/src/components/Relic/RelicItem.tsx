interface ReactProp {
    name: string;
    count: string;
}
import './relicitem.css'

const RelicItem = ({ name, count }: ReactProp) => {
    return (
        <div className="relic-item dot-pattern">
            <div className="topinfo">
                <div className="owned">{count}x</div>
                <img src="./img/addicon.png" alt="" />
            </div>
            <div className="bottominfo">
                <img src="./img/relic.webp" alt="" />
                <div className="about">
                    <div className="status-color orange"></div>
                    <span>{name}</span>
                </div>
            </div>
        </div>
    )
}

export default RelicItem