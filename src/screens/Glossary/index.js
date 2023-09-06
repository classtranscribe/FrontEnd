import React, { useState, useEffect } from 'react';
import { CTLayout } from 'layout';
import { connect } from 'dva';
import { cthttp } from 'utils/cthttp/request.js';
import GlossaryTable from './components/GlossaryTable/index.js';
import GlossaryBar from './components/GlossaryBar/index.js';



// the config header will avoid cors blocked by the chrome
const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  };

/**
 * object for the whole Glossary page
 */
const GolssaryWithRedux = (props) => {
    const layoutProps = CTLayout.createProps({
        transition: true,
        responsive: true,
        footer: true
    });

    const [selectCourse, setSelectCourse] = useState('');
    const [selectOffering, setSelectOffering] = useState('');
    const [data, setData] = useState([]);

    // function used to fetch glossaries from server when user has chose courseId and offeringId
    useEffect(() => {
        const fetchData = async () => {
            // const res = await apiInstance.get(`/api/Glossary/ByCourseOffering?courseId=${selectCourse}&offeringId=${selectOffering}`, config);
            const res = await cthttp.get(`Glossary/ByCourseOffering?courseId=${selectCourse}&offeringId=${selectOffering}`, config);
            setData(res.data);
        }
        if (selectCourse !== '' && selectOffering !== '') {
            fetchData();
        }
    }, [selectCourse, selectOffering]);

    return (
      <CTLayout {...layoutProps}>
        <h1>Glossary</h1>
        <br />
        <GlossaryBar 
          setSelectCourse={setSelectCourse}
          setSelectOffering={setSelectOffering}
        />
        <br />
        <GlossaryTable words={data} offeringId={selectOffering} courseId={selectCourse} />
      </CTLayout>
    )
}

export const Glossary = connect(({ glossarypage, loading }) => ({
    glossarypage
}))(GolssaryWithRedux);