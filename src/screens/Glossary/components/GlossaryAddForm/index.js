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
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [licenseTag, setLicenseTag] = useState('');
    const [shared, setShared] = useState(true);
    const [editable, setEditable] = useState(true);
    const [domain, setDomain] = useState('');
    const [explanation, setExplanation] = useState('');

    const submitAdd = () => {
        const editdata = {
            "term": term,
            "link": link,
            "description": description,
            "source": source,
            "licenseTag": licenseTag,
            "shared": shared,
            "editable": editable,
            "domain": domain,
            "likes": 0,
            "explanation": (explanation !== null && explanation.length > 0) ? explanation : null,
            "courseId": courseId,
            "offeringId": offeringId,
        }
        // console.log(editdata);
        sendAdd(editdata);
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
          heading='ADD GLOSSARY'
          onSave={() => submitAdd()}
          onSaveButtonText='submit'
          onCancel={() => clear()}
          onCancelButtonText='clear'
        >
          <div className='editform'>
            <CTInput
              id='term-textbox'
              className='edit-textbox'
              label='TERM'
              onChange={(e) => setTerm(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={term} 
            />
            <CTInput
              id='link-textbox'
              className='edit-textbox'
              label='LINK'
              onChange={(e) => setLink(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={link} 
            />
                            
            <CTInput
              id='description-textbox'
              className='edit-textbox'
              label='DESCRIPTION'
              onChange={(e) => setDescription(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={description} 
            />
            
            <CTInput
              id='source-textbox'
              className='edit-textbox'
              label='SOURCE'
              onChange={(e) => setSource(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={source}
            />

            <CTInput
              id='licenseTag-textbox'
              className='edit-textbox'
              label='LICENSETAG'
              onChange={(e) => setLicenseTag(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={licenseTag}
            />
            <CTInput
              id='domain-textbox'
              className='edit-textbox'
              label='DOMAIN'
              onChange={(e) => setDomain(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={domain}
            />
            <CTInput
              id='explanation-textbox'
              className='edit-textbox'
              label='EXPLANATION'
              onChange={(e) => setExplanation(e.target.value)}
              textarea
              fullWidth
              margin='normal'
              value={explanation}
            />
            <CTCheckbox
              id='shared-textbox'
              className='edit-textbox'
              label='SHARED'
              onChange={() => setShared(!shared)}
              fullWidth
              margin='normal'
              checked={shared}
            /> 
            <CTCheckbox
              id='editable-textbox'
              className='edit-textbox'
              label='EDITABLE'
              onChange={() => setEditable(!editable)}
              fullWidth
              margin='normal'
              checked={editable}
            />                         
          </div>
        </CTForm>
      </CTModal>
    )
}

export default GlossaryAddForm