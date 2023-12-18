import React, { useState} from 'react';
import { CTInput, CTModal, CTForm, CTCheckbox} from 'layout';
import './index.scss';

const GlossaryAddForm = (props) => {
    const {
        setEdit,
        sendAdd,
        offeringId,
        courseId,
    } = props;

    const [term, setTerm] = useState('');
    const [link, setLink] = useState('');
    const [warningMessage,setWarningMessage] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [licenseTag, setLicenseTag] = useState('');
    const [shared, setShared] = useState(true);
    const [editable, setEditable] = useState(true);
    const [domain, setDomain] = useState('');
    const [explanation, setExplanation] = useState('');

    const submitAdd = () => {
        const editdata = {
            term:term.trim(),
            link:link.trim(), 
            description:description.trim(),
            source:source.trim(),
            licenseTag:licenseTag.trim(),
            shared,editable,
            domain:domain.trim(),courseId,
            offeringId,
            "likes": 0,
            "explanation": (explanation !== null && explanation.length > 0) ? explanation.trim() : null,
        }
        // console.log(editdata);
        const termValid = editdata.term.length > 0;
        const descriptionValid = editdata.description.length > 0;
        setWarningMessage();
        if( termValid && descriptionValid) {
          sendAdd(editdata);
          setEdit(false);
        } 
          setWarningMessage( "Please complete the required fields (Term and Description)");
    }

    const clear = () => {
        setTerm('');
        setLink('');
        setDescription('');
        setSource('');
        setLicenseTag('');
        setShared(true);
        setEditable(true);
        setDomain('');
        setExplanation('');
        setWarningMessage('');
    }

    return (
      <CTModal
        open
        size='md'
        fullWidth
        responsive
        onClose={() => setEdit(false)}
        withCloseButton
        container={false}
      >
        <CTForm
          heading='Add Glossary Item'
          onSave={() => submitAdd()}
          onSaveButtonText='Add'
          onCancel={() => clear()}
          onCancelButtonText='clear'
        >
          <div className='editform'>
            <CTInput
              id='term-textbox'
              className='edit-textbox'
              label='Domain Term (required)'
              onChange={(e) => setTerm(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={term} 
            />
            <CTInput
              id='link-textbox'
              className='edit-textbox'
              label='Source Link'
              onChange={(e) => setLink(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={link} 
            />
                            
            <CTInput
              id='description-textbox'
              className='edit-textbox'
              label='Description (required)'
              onChange={(e) => setDescription(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={description} 
            />
            
            <CTInput
              id='source-textbox'
              className='edit-textbox'
              label='Source'
              onChange={(e) => setSource(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={source}
            />

            <CTInput
              id='licenseTag-textbox'
              className='edit-textbox'
              label='License Tag'
              onChange={(e) => setLicenseTag(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={licenseTag}
            />
            <CTInput
              id='domain-textbox'
              className='edit-textbox'
              label='Domain'
              onChange={(e) => setDomain(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={domain}
            />
            <CTInput
              id='explanation-textbox'
              className='edit-textbox'
              label='Explanation'
              onChange={(e) => setExplanation(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={explanation}
            />
            <CTCheckbox
              id='shared-textbox'
              className='edit-textbox'
              label='Shared with other courses'
              onChange={() => setShared(!shared)}
              fullWidth
              margin='normal'
              checked={shared}
            /> 
            <CTCheckbox
              id='editable-textbox'
              className='edit-textbox'
              label='Editable by other instructors'
              onChange={() => setEditable(!editable)}
              fullWidth
              margin='normal'
              checked={editable}
            />  
                               
          </div>
          {warningMessage && <div className='warning'>{warningMessage}</div>}    
        </CTForm>
       
      </CTModal>
    )
}

export default GlossaryAddForm