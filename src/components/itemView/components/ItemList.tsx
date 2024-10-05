import Item from './Item';
import './styles/itemList.css'

const ItemList = ({ itemsArray, itemType }: { itemsArray: SheetPartData[], itemType: string }) => {
    return (
        <div className='itemList'>
            <div className="itemList__search">
                <input type="text" placeholder={`Search ${itemType}`}/>
            </div>
            <div className="itemList__div">
                {itemsArray.map((item, index) => 
                    <Item key={index} item={item.item} stock={item.stock} color={item.color}/>
                )}
            </div>
        </div>
    )
}

export default ItemList;
