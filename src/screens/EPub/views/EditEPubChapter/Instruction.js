import React from 'react';
import { CTParagraph, CTText } from 'layout';
import { EPubInstruction } from '../../components';

function Instruction() {
  return (
    <EPubInstruction title="INSTRUCTIONS">
      <div>
        <h5>Edit text</h5>
        <CTParagraph indent="0">
          You can edit the text blocks using Markdown, 
          easy-to-use markup language you can use to format your content. 
          You can create tables, insert links, 
          or embed mathematical equations with it. Learn more at
          <a target="_blank" rel="noreferrer" href="https://www.markdownguide.org/"> 
            {' '}www.markdownguide.org
          </a>.
        </CTParagraph>
        <h5>Insert images</h5>
        <CTParagraph>
          You are able to insert images between any editable blocks, 
          it supports multiple ways to insert an image: 
        </CTParagraph>
        <ul>
          <li>
            <CTText>Using existing auto-captured screenshots.</CTText>
          </li>
          <li>
            <CTText>Upload image files or use an external image permalink.</CTText>
          </li>
          <li>
            <CTText>Manually capture images in the video.</CTText>
          </li>
        </ul>
      </div>
    </EPubInstruction>
  );
}

export default Instruction;
