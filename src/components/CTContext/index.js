import React, { createContext, useContext, useState, useEffect } from 'react'
import GeneralAlert from './Components/GeneralAlert'
import ErrorMesg from './Components/ErrorMesg'
import './index.css'

export const CTContext = createContext()
export const useCTContext = () => useContext(CTContext)

export function CTContextProvider({ children }) {
  const [alertMesg, setAlertMesg] = useState(null)
  const [errorMesg, setErrorMesg] = useState(null)

  const windowAlert = mesg => alert(mesg)

  const generalAlert = (mesg = {header: '', text: '', type: 'success'}, span = 4000) => {
    setAlertMesg(mesg)
    if (span > 0) setTimeout(() => {
      setAlertMesg(null)
    }, span);
  }

  const hasError = (mesg = { header: '', info: '', error: {}}) => setErrorMesg(mesg)


  return (
    <CTContext.Provider
      value={{ 
        windowAlert,
        generalAlert,
        ErrorMesg,
        hasError,
      }}
    >
      <>
        <GeneralAlert mesg={alertMesg} onClose={() => setAlertMesg(null)} />
        <ErrorMesg mesg={errorMesg} />
        {children}
      </>
    </CTContext.Provider>
  )
}