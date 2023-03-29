import React, { useState} from 'react';
import { CTInput, CTModal, CTForm, CTCheckbox} from 'layout';
import './index.scss';

const GlossaryEditForm = (props) => {
    const {
        datadic,
        setEdit,
        sendEdit,
        sendDelete,
    } = props;
    const data = {...datadic};
    const [term, setTerm] = useState(data.term);
    const [link, setLink] = useState(data.link);
    const [description, setDescription] = useState(data.description);
    const [source, setSource] = useState(data.source);
    const [licenseTag, setLicenseTag] = useState(data.licenseTag);
    const [shared, setShared] = useState(data.shared);
    const [domain, setDomain] = useState(data.domain);
    const [explanation, setExplanation] = useState(data.explanation);

    const submitEdit = () => {
        const editdata = {
            "id": data.id,
            "term": term,
            "link": link,
            "description": description,
            "source": source,
            "licenseTag": licenseTag,
            "shared": shared,
            "editable": data.editable,
            "domain": domain,
            "likes": data.likes,
            "explanation": (explanation !== null && explanation.length > 0) ? explanation : null,
            "courseId": data.courseId,
            "offeringId": data.offeringId,
        }
        // console.log(editdata);
        sendEdit(editdata);
    }

    const reset = () => {
        setTerm(data.term);
        setLink(data.link);
        setDescription(data.description);
        setSource(data.source);
        setLicenseTag(data.licenseTag);
        setShared(data.shared);
        setDomain(data.domain);
        setExplanation(data.explanation);
    }

    const deleteTerm = () => {
        // console.log(`delete ${data.id}`);
        sendDelete(data.id);
        setEdit(false)
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
          heading='EDIT GLOSSARY'
          onSave={() => submitEdit()}
          onSaveButtonText='submit'
          onCancel={() => reset()}
          onCancelButtonText='reset'
          onDelete={() => deleteTerm()}
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
              textarea
              fullWidth
              margin='normal'
              checked={shared}
            />                            
          </div>
        </CTForm>
      </CTModal>
    )
}

export default GlossaryEditForm