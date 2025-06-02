import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { Explorer } from '../../../features/HomePage'
import { Loading } from '../../../components/Loading';
import { useBackgroundTranslatedRelics, useBackgroundTranslatedPrimes, useBackgroundRawData } from '../../background/hooks';

const Screen = () => {
  const translatedRelics = useBackgroundTranslatedRelics();
  const translatedPrimes = useBackgroundTranslatedPrimes();
  const rawData = useBackgroundRawData();
  
  // Check if we have real data by looking at the actual translated data
  // Only consider it real data if we have both relics and primes, and they're not empty
  const hasRealData = translatedRelics.length > 0 && translatedPrimes.length > 0 && 
                     translatedRelics.some(relic => relic.inventoryCount > 0);
  const isMockData = !hasRealData;

  if (!translatedRelics || !translatedPrimes) {
    return (
      <div className="desktop">
        <Loading showSkeleton>
          <DesktopHeader isMockData={isMockData} lastUpdateTime={rawData.lastUpdateTime} />
        </Loading>
      </div>
    );
  }

  return (
    <div className="desktop">
      <DesktopHeader isMockData={isMockData} lastUpdateTime={rawData.lastUpdateTime} />
      <Explorer />
    </div>
  );
};

export default Screen;
