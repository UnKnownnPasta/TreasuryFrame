import { useSelector } from 'react-redux';
import ItemList from './ItemList';
import './styles/itemView.css'
import { RootReducer } from '../../../app/shared/rootReducer';

const ItemView = () => {
    const { inventory } = useSelector(
        (state: RootReducer) => state.inventory,
    );
    const { parts, relics } = useSelector(
        (state: RootReducer) => state.relic,
    )

    const stockRange = (num: number): string => 
        num >= 0 && num <= 9 ? 'ED'
        : num > 9 && num <= 15 ? 'RED'
        : num > 15 && num <= 31 ? 'ORANGE'
        : num > 31 && num <= 64 ? 'YELLOW'
        : num > 64 ? 'GREEN' : '';

    const itemsArray = inventory.map((data) => {
        const relic = relics.find((relic) => relic.name === data.ItemType);
        const part = parts.find((part) => part.item === data.ItemType);
        
        if (relic) {
            return {
                item: relic.name,
                stock: stockRange(data.ItemCount),
                color: relic.tokens
            }
        } else if (part) {
            return {
                item: part.item,
                stock: stockRange(data.ItemCount),
            }
        } else {
            return {
                item: data.ItemType,
                stock: stockRange(data.ItemCount),
            }
        }
    });

    return (
        <div className='itemView'>
            <ItemList itemsArray={itemsArray} itemType='Items'/>
            <ItemList itemsArray={itemsArray} itemType='Monsters'/>
            <ItemList itemsArray={itemsArray} itemType='Spells'/>
        </div>
    )
}

export default ItemView;
