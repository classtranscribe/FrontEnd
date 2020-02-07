import React from 'react'
import { 
  mspTabs, 
  setup,
  TAB_DEFAULT,
} from '../../Utils'

function Tabs({
  currTab=TAB_DEFAULT
}) {

  const changeTab = tabHash => () => {
    setup.tab(tabHash)
  }

  return (
    <div className="msp-h-tabs-con">
      {mspTabs.map( tab => (
        <button 
          id={tab.id} 
          key={tab.id}  
          className="plain-btn msp-h-tab"
          data-current={Boolean(currTab === tab.hash)}
          onClick={changeTab(tab.hash)}
        >
          <span tabIndex="-1">
            {tab.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export default Tabs