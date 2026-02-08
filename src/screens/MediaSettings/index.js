import React from 'react';
import { Outlet, useLocation,/* useNavigate, */ useParams } from 'react-router-dom';
import { links } from 'utils';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { CTErrorWrapper, CTLayout } from 'layout';
import { TAB_EPUB /* , TAB_EDIT_TRANS */ } from './controllers/constants';
import { MSPHeaderTabTitle } from './Components';
import './index.scss';


export function MediaSettings() {
  const { id: mediaId } = useParams();
  const location = useLocation();
  const mediasetting = useSelector(state => state.mediasetting);

  const epubPath = links.instMediaSettings(mediaId, TAB_EPUB);

  const layoutProps = {
    ...CTLayout.createProps({
      fill: true,
      transition: true,
      sidebarProps: {
        float: true,
      },
      headerProps: {
        shadowed: true,
        subtitle: 'Media Settings',
        tabTitleElem: <MSPHeaderTabTitle mediasetting={mediasetting} mediaId={mediaId} />,
        tabs: [
          // {
          //   text: 'Transcriptions',
          //   active: location.pathname === transPath,
          //   href: transPath
          // },
          {
            text: 'I-Note',
            active: location.pathname === epubPath,
            href: epubPath
          }
        ]
      }
    })
  };

  if (isMobile) {
    return (
      <div className="msp-bg">
        <CTErrorWrapper
          show
          navbar
          retry={false}
          signInButton={false}
          code={<i className="material-icons">laptop_mac</i>}
          header="Please open this page in a computer/laptop browser."
        />
      </div>
    );
  }

  return (
    <CTLayout {...layoutProps}>
      <div className="msp-bg">
        <div className="msp-content">
          <Outlet />
        </div>
      </div>
    </CTLayout>
  );
}