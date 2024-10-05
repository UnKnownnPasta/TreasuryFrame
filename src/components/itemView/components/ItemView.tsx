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
    const { PrimeData, RelicArcanes, ResourceData } = useSelector(
        (state: RootReducer) => state.itemData,
    )

    const stockRange = (num: number): string => 
        num >= 0 && num <= 9 ? 'ED'
        : num > 9 && num <= 15 ? 'RED'
        : num > 15 && num <= 31 ? 'ORANGE'
        : num > 31 && num <= 64 ? 'YELLOW'
        : num > 64 ? 'GREEN' : '';

    const isRelicType = (item: string) => item.startsWith("/Lotus/Types/Game/Projections/");
    const isPrimeType = (item: string) => item.startsWith("/Lotus/Types/Recipes");
    const isResourceType = (item: string) => item.startsWith("/Lotus/Types/Items/MiscItems/");

    const RelicItemArray = [];
    const PrimeItemArray = [];
    const ResourceArray = [];

    for (const entry of inventory) {
        if (isRelicType(entry.ItemType)) {
            const relicItself = RelicArcanes.find((r) => r.ItemInternal === entry.ItemType);
            if (!relicItself) continue;

            const relicEntry = relics.find((r) => r.name === relicItself.ItemPlayer.replace(" Relic", ""));
            if (!relicEntry) continue;
            const lowestStock = Math.min(...relicEntry.rewards.map(rw => parseInt(rw.stock ?? "999")));
            RelicItemArray.push({
                item: relicItself?.ItemPlayer ?? "#NF",
                color: stockRange(lowestStock),
                stock: `${entry.ItemCount}`
            })
        } else if (isPrimeType(entry.ItemType)) {
            const primeItself = PrimeData.find((p) => p.ItemPlayer === entry.ItemType);
            if (!primeItself) continue;

            const primeEntry = parts.find((p) => p.item === primeItself.ItemPlayer);
            PrimeItemArray.push({
                item: primeItself?.ItemPlayer ?? "#NF",
                color: stockRange(parseInt(primeEntry?.stock ?? "0")),
                stock: `${entry.ItemCount}`
            })
        } else if (isResourceType(entry.ItemType)) {
            ResourceArray.push({
                item: ResourceData.find((p) => p.ItemInternal === entry.ItemType)?.ItemPlayer ?? "#NF",
                color: stockRange(entry.ItemCount),
                stock: `${entry.ItemCount}`
            })
        }
    }

    const rankOfStock = ['ED', 'RED', 'ORANGE', 'YELLOW', 'GREEN'];

    return (
        <div className='itemView'>
            <ItemList itemsArray={RelicItemArray.sort((a, b) => {
                const aRank = rankOfStock.indexOf(a.color);
                const bRank = rankOfStock.indexOf(b.color);
                if (aRank === bRank) {
                    return a.stock < b.stock ? -1 : 1;
                } else {
                    return aRank < bRank ? -1 : 1;
                }
            })} itemType='Relics'/>
            <ItemList itemsArray={PrimeItemArray} itemType='Primes'/>
            <ItemList itemsArray={ResourceArray} itemType='Resources'/>
        </div>
    )
}

export default ItemView;
