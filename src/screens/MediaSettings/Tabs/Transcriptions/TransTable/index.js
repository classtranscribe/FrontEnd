import React, { useState, useEffect } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment } from 'layout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



function TransTable(media = undefined) {
  const [language, setLanguage] = useState('en-US')
  const [captions, setCaptions] = useState([])


  useEffect(() => {
    if (!media.media.isUnavailable) {
      media.media.transcriptions.forEach(
        (val) => {
          if (val.language === language) {
            // console.log(val.id)
            api.getCaptionsByTranscriptionId(val.id).then((res) => {
              if (res && res.status === 200)
                // res.data is the captions array
                setCaptions(res.data)
              // console.log(res.data)
            })
          }
        }
      )
    }
  }, [media])


  return (
    <CTFragment id="msp-t-table-con" data-scroll>
      <Table />
    </CTFragment>
  );
}

export default TransTable;
