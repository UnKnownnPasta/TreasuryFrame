import Logs from '../../../components/Logs/Logs';
import Parts from '../../../components/Parts/Parts';
import Relics from '../../../components/Relics/Relics';
import Resources from '../../../components/Resources/Resources';
import './content.css'
type contentProps = { screen: string }

const EmptyPage = () => {
  return (
    <div className="empty">
      <img src="./unloaded.png" alt="" />
    </div>
  )
}

const Content = ({ screen }: contentProps) => {
  return (
    <div className='content'>
        {screen === "" && <EmptyPage />}
        {screen === 'relic' && <Relics screen={screen} />}
        {screen === 'part' && <Parts />}
        {screen === 'resource' && <Resources />}
        {screen === 'log' && <Logs />}
    </div>
  )
}

export default Content;
