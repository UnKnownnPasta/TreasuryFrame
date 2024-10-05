import './styles/item.css';

const item = ({ item, stock }: SheetPartData) => {
    return (
        <div className='item'>
            <div className="item__header">
                <span>{item}</span>
            </div>
            <div className="item__footer">
                <span>{stock}x Owned</span>
                <span>Extreme Danger</span>
            </div>
        </div>
    )
}

export default item;
