import { useSelector } from 'react-redux';
import { RootReducer } from '../../../app/shared/rootReducer';

export const useBackgroundRawData = () => {
  return useSelector((state: RootReducer) => state.background.rawData);
};

export const useBackgroundParsedData = () => {
  return useSelector((state: RootReducer) => state.background.parsedData);
};

export const useBackgroundInventory = () => {
  return useSelector((state: RootReducer) => state.background.parsedData.infos);
};

export const useBackgroundTranslatedRelics = () => {
  const relics = useSelector((state: RootReducer) => state.background.parsedData.translatedRelicInfo);
  
  if (!relics || Object.keys(relics).length === 0) {
    return [{
      uniqueName: "/Lotus/Types/Game/Projections/T1VoidProjectionRevenantPrimeEBronze",
      processedName: "Lith P6 Relic",
      description: "An artifact containing Orokin secrets. It can only be opened through the power of the Void.",
      inventoryCount: 6,
      name: "Lith P6",
      rewards: [
        {
          item: "Burston Receiver",
          x2: false,
          stock: 42,
          color: "YELLOW",
          rarity: 25.33,
          relicFrom: "Lith P6"
        },
        {
          item: "Revenant Prime Neuroptics",
          x2: false,
          stock: 15,
          color: "BLUE",
          rarity: 11.11,
          relicFrom: "Lith P6"
        }
      ],
      tokens: 8,
      vaulted: true
    }];
  }

  return relics;
};

export const useBackgroundTranslatedPrimes = () => {
  return useSelector((state: RootReducer) => state.background.parsedData.translatedPrimeInfo);
};
