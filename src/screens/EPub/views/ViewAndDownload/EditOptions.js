import React from 'react';
import { connect } from 'dva'
import { CTFragment, CTHeading } from 'layout';
import { FormControlLabel, Checkbox } from '@material-ui/core';

function EditOptions({ setDownloadOptions, downloadOptions }) {
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setDownloadOptions((prevState) => ({
      ...prevState,
      [name]: checked // Update the specific checkbox state
    }));
  };

  return (
    <CTFragment dFlexCol margin={[0, 0, 30, 0]}>
      <CTHeading as="h3" icon="settings">Download Options</CTHeading>
      <FormControlLabel
        control={
          <Checkbox
            checked={downloadOptions.visualTOC}
            onChange={handleCheckboxChange}
            name="visualTOC"
            color="primary"
          />
        }
        label="Include Visual Table of Contents"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={downloadOptions.invertColors}
            onChange={handleCheckboxChange}
            name="invertColors"
            color="primary"
          />
        }
        label="Force Light Image Backgrounds"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={downloadOptions.includeGlossary}
            onChange={handleCheckboxChange}
            name="includeGlossary"
            color="primary"
          />
        }
        label="Include Glossary"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={downloadOptions.includeRawLatex}
            onChange={handleCheckboxChange}
            name="includeRawLatex"
            color="primary"
          />
        }
        label="Include Raw Latex"
      />
    </CTFragment>
  );
}

export default connect(() => ({

}))(EditOptions);
