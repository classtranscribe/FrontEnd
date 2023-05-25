import React, { useState, useEffect } from 'react';
import { CTLayout } from 'layout';
import { connect } from 'dva';
import { cthttp } from 'utils/cthttp/request';
import AslTable from './components/AslTable';

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
const AslWithRedux = (props) => {
    const layoutProps = CTLayout.createProps({
        transition: true,
        responsive: true,
        footer: true
    });

    const [data, setData] = useState([]);

    // fetch data at the beginning
    useEffect(() => {
        async function fetchData() {
          const res = await cthttp.get(`ASLVideo/GetAllASLVideos`, config);
          setData(res.data);
        }
        fetchData();
    }, []);

    return (
      <CTLayout {...layoutProps}>
        <h1>ASL Dictionary</h1>
        <br />
        <br />
        <AslTable words={data} />
      </CTLayout>
    )
}

export const Asl = connect(({ aslpage, loading }) => ({
    aslpage
}))(AslWithRedux);