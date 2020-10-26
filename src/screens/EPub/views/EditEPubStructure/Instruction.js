import React from 'react';
import { EPubInstruction } from '../../components';

function Instruction({ expanded, onToggle }) {
  return (
    <EPubInstruction expanded={expanded} onToggle={onToggle} title="INSTRUCTIONS">
      <div>
        <p>
          To manage your ePub chapters, set <b>splitting points</b> between screenshots to 
          generate an initial layout of your ePub chapters. 
          Each chapter can be further <b>subdivided</b> into sub-chapters.
        </p>
        <p>
          After building the structure of your ePub, 
          proceed to the <b>Chapter Editor</b> to modify the 
          texts and images there.
        </p>

        <h4>Actions</h4>
        <ul>
          <li>
            <b>Split</b> - Split screenshots and transcripts into chapters.
          </li>
          <li>
            <b>Subdivide</b> - Divide a chapter into several sub-chapters.
          </li>
        </ul>
      </div>
    </EPubInstruction>
  );
}

export default Instruction;
