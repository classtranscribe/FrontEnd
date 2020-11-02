import React from 'react';
import { CTParagraph, CTText } from 'layout';
import { EPubInstruction } from '../../components';

function Instruction({ expanded, onToggle }) {
  return (
    <EPubInstruction expanded={expanded} onToggle={onToggle} title="INSTRUCTIONS">
      <div>
        <CTParagraph>
          To manage your ePub chapters, set <b>splitting points</b> between screenshots to 
          generate an initial layout of your ePub chapters. 
          Each chapter can be further <b>subdivided</b> into sub-chapters.
        </CTParagraph>
        <CTParagraph>
          After building the structure of your ePub, 
          proceed to the <b>Chapter Editor</b> to modify the 
          texts and images there.
        </CTParagraph>

        <h4>Actions</h4>
        <ul>
          <li>
            <CTText><b>Split</b> - Split screenshots and transcripts into chapters.</CTText>
          </li>
          <li>
            <CTText><b>Subdivide</b> - Divide a chapter into several sub-chapters.</CTText>
          </li>
        </ul>
      </div>
    </EPubInstruction>
  );
}

export default Instruction;
