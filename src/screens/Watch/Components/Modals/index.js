import React, { useEffect } from 'react'
import {
  connectWithRedux,
  modalControl,
  MODAL_HIDE,
  MODAL_SHARE,
  MODAL_BEFORE_HIDE,
} from '../../Utils'
import ShareModal from './ShareModal'
import './index.css'

function ModalsWithRedux({
  modal=MODAL_HIDE,
  setModal
}) {
   // Register setMenu to menuControl
   useEffect(() => {
    modalControl.register({ setModal })
  }, [])

  const handleClose = () => {
    modalControl.close()
  }

  const hideBefore = modal === MODAL_BEFORE_HIDE

  return  (
    <div className="watch-modal" data-modal-type={modal}>
      {
        (modal === MODAL_SHARE || hideBefore) 
        && 
        <ShareModal onClose={handleClose} />
      }
      <div className="wml-filter" onClick={handleClose}></div>
    </div>
  )
}

export const Modals = connectWithRedux(
  ModalsWithRedux,
  ['modal'],
  ['setModal']
)