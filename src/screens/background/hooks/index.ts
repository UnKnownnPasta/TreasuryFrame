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
  return useSelector((state: RootReducer) => state.background.parsedData.translatedRelicInfo);
};

export const useBackgroundTranslatedPrimes = () => {
  return useSelector((state: RootReducer) => state.background.parsedData.translatedPrimeInfo);
};
