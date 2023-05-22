import React, { useState, useEffect } from 'react';
import { connect } from 'dva'
import WatchCtrlButton from '../../WatchCtrlButton';
import { MENU_GLOSSARY } from '../../../Utils';

export function GlossaryButtonWithRedux({menu = MENU_GLOSSARY, dispatch}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_GLOSSARY) {
      dispatch({type: 'watch/menu_open', payload: { type: MENU_GLOSSARY } });
    } else {
      dispatch({type: 'watch/menu_close'});
    }
  };

  return (
    <WatchCtrlButton

      onClick={handleMenuTrigger}
      active={menu === MENU_GLOSSARY}
      label={"Glossary"}
      id={MENU_GLOSSARY}

      ariaTags={{
        'aria-label': 'Glossary'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="fas fa-book" />
      </span>

    </WatchCtrlButton>
  );
}

export const GlossaryButton = connect(({ watch : { menu}, loading }) => ({menu
}))(GlossaryButtonWithRedux)

