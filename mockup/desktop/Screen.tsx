import { useState } from 'react';
import Content from './content/Content';
import './screen.css'
import Sidebar from './sidebar/Sidebar';

const Screen = () => {
  const [currentScreen, setScreen] = useState('')

  return (
    <div className='screen'>
        <Sidebar selected={currentScreen} setSelected={setScreen} />
        <Content screen={currentScreen} />
    </div>
  )
}

export default Screen;
