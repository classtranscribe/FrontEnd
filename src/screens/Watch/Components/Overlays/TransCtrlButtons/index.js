/**
 * Overlay Button Group used in Transcription box
 */

import React from 'react';
import { isMobile } from 'react-device-detect';
import { STUDENT, INSTRUCTOR } from 'utils/constants';
import { connect } from 'dva'
import {
  transControl,
  LINE_VIEW,
  TRANSCRIPT_VIEW,
  MENU_SETTING,
  SMTAB_TRANS,
  HIDE_TRANS,
} from '../../../Utils';
import './index.scss';

function TransCtrlButtonsWithRedux({
  transView = LINE_VIEW,
  userRole = STUDENT,
  bulkEditing = false,
  isFullscreen = false,
  dispatch
}) {
  const switchTranView = () => {
    const view = transView;
    let toSet = null;
    if (view === HIDE_TRANS) {
      if (isMobile) {
        toSet = TRANSCRIPT_VIEW;
      } else {
        toSet = LINE_VIEW;
      }
    } else if (view === TRANSCRIPT_VIEW) {
      toSet = HIDE_TRANS;
    } else {
      toSet = TRANSCRIPT_VIEW;
    }
    if (toSet) {
      dispatch({ type: 'playerpref/setTransView', payload: { view: toSet } });
    }
  };

  const handleSearch = () => {
    dispatch({ type: 'watch/search_open' });
  };

  const openTransSettingMenu = () => {
    dispatch({ type: 'watch/menu_open', payload: { type: MENU_SETTING, option: 'a', tab: SMTAB_TRANS } });
  };

  const openBulkEdit = () => {
    transControl.bulkEdit(true);
  };

  const isLineView = transView === LINE_VIEW;
  const isHide = transView === HIDE_TRANS;

  const switchBthName = isMobile
    ? isHide
      ? TRANSCRIPT_VIEW
      : HIDE_TRANS
    : isLineView
      ? TRANSCRIPT_VIEW
      : isHide
        ? LINE_VIEW
        : HIDE_TRANS;

  const switchBtnIcon = isMobile
    ? isHide
      ? 'subject'
      : 'close'
    : isLineView
      ? 'menu_book'
      : isHide
        ? 'subject'
        : 'close';

  const buttonGroup = [
    userRole === INSTRUCTOR && !isMobile
      ? {
        id: 'trans-bulk-edit-btn',
        name: 'Bulk Edit',
        icon: <i className="material-icons">edit</i>,
        click: openBulkEdit,
        ariaTags: {},
      }
      : null,
    isMobile
      ? null
      : {
        id: 'trans-setting-btn',
        name: 'Transcription Settings',
        icon: <i className="fas fa-cogs" />, // settings
        click: openTransSettingMenu,
        ariaTags: {
          'aria-controls': 'watch-setting-menu',
          'aria-haspopup': 'true',
        },
      },
    {
      id: 'trans-view-switch-btn',
      name: switchBthName,
      icon: <i className="material-icons">{switchBtnIcon}</i>,
      click: switchTranView,
      ariaTags: {},
    },
    {
      id: 'watch-search-btn',
      name: 'Search Transcriptions',
      icon: <i className="material-icons">search</i>,
      click: handleSearch,
      ariaTags: {
        'aria-controls': 'watch-search-container',
        'aria-haspopup': 'true',
      },
    },
  ];

  return bulkEditing || isFullscreen ? null : (
    <>
      {buttonGroup.map((btn) =>
        btn ? (
          <button
            className="plain-btn trans-ctrl-btn"
            onClick={btn.click}
            id={btn.id}
            key={btn.id}
            aria-label={btn.name}
            {...btn.ariaTags}
          >
            <span className="trans-ctrl-btn-content" tabIndex="-1">
              {btn.icon}
              <span className="trans-ctrl-btn-text">{btn.name}</span>
            </span>
          </button>
        ) : null,
      )}
    </>
  );
}

export const TransCtrlButtons = connect(({ playerpref: { transView },
  watch: { userRole, bulkEditing, isFullscreen }, loading }) => ({
    transView, userRole, bulkEditing, isFullscreen
  }))(TransCtrlButtonsWithRedux);
