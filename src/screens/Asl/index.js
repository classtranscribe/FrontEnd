import React, { useState, useEffect } from 'react';
import { CTLayout } from 'layout';
import { connect } from 'dva';
import axios from 'axios';
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
    const apiInstance = axios.create({
        baseURL: 'https://ct-dev.ncsa.illinois.edu',
        timeout: 1000,
    });

    // const fetchData = async () => {
      
    // }

    // fetch data at the beginning
    useEffect(async() => {
        const res = await apiInstance.get(`/api/ASLVideo/GetAllASLVideos`, config);
        setData(res.data);
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