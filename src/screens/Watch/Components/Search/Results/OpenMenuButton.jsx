import React from 'react';
import { connect } from 'dva';
    
const OpenMenuButton = (props)=> {
  const { show, menu, name, dispatch } = props;
  const openMenu = () => dispatch({ type: 'watch/menu_open', payload: { type: menu } });

  return show ? (
    <div className="w-100 d-flex px-3">
      <button
        className="plain-btn watch-search-btn page-btn"
        aria-label={`See all ${name}`}
        aria-haspopup="true"
        onClick={() => openMenu(menu)}
      >
        <span className="py-2 px-4 my-1 fsize-1-3" tabIndex="-1">
          See all {name}
        </span>
      </button>
    </div>
  ) : null;
}

export default connect(() => ({

}))(OpenMenuButton);