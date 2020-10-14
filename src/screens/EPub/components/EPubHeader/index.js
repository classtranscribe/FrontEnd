import React from 'react';
import { CTNavHeader, CTBrand, makeEl } from 'layout';
import EPubTitle from './EPubTitle';
import EPubToolbar from './EPubToolbar';
import './index.scss';

function EPubHeader() {
  const brandElement = makeEl(CTBrand, { logo: true, medium: true });
  const titleElement = makeEl(EPubTitle);
  const toolbarElement = makeEl(EPubToolbar);

  return (
    <CTNavHeader
      fixed
      bordered
      className="ct-epb-header"
      brandElem={brandElement}
      leftElem={titleElement}
      toolbarElem={toolbarElement}
    />
  );
}

export default EPubHeader;
