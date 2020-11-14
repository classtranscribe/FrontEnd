import React from 'react';
import { CTNavHeader, CTBrand, makeEl } from 'layout';
import EPubTitle from './EPubTitle';
import EPubRightActions from './EPubRightActions';
import EPubToolbar from './EPubToolbar';
import './index.scss';

function EPubHeader() {
  const brandElement = makeEl(CTBrand, { logo: true, medium: true });
  const titleElement = makeEl(EPubTitle);
  const rightActionElement = makeEl(EPubRightActions);
  const toolbarElement = makeEl(EPubToolbar);

  return (
    <CTNavHeader
      fixed
      bordered
      // shadowed
      className="ct-epb-header"
      brandElem={brandElement}
      leftElem={titleElement}
      rightElem={rightActionElement}
      toolbarElem={toolbarElement}
    />
  );
}

export default EPubHeader;
