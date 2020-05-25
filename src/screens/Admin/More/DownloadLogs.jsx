import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import { Button } from 'semantic-ui-react';
import { api } from 'utils';
import Moment from 'moment';
import { momentToISOString } from '../helpers';

const fileDownload = require('js-file-download');

export default function DownloadLogs() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [startDate, setStartDate] = useState(new Moment());
  const [endDate, setEndDate] = useState(null);

  const onFocusChange = (focusedInput_) => {
    setFocusedInput(focusedInput_);
  };

  const onChange = (value, key) => {
    if (key === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const onDownload = async () => {
    setDownloading(true);
    const from = momentToISOString(startDate);
    const to = momentToISOString(endDate);
    const { data } = await api.adminGetLogs(from, to);
    let filename = `logs (${from.slice(0, 10)} to ${to.slice(0, 10)}).csv`;
    fileDownload(data, filename);
    setDownloading(false);
    setEndDate(null);
    setStartDate(new Moment());
  };

  return (
    <div className="ap-more-section download-logs">
      <h2>Download Logs</h2>
      <label>Select Date Range</label>
      <div>
        <DateRangePicker
          noBorder
          // openDirection='bottom'
          isOutsideRange={() => false}
          startDate={startDate} // momentPropTypes.momentObj or null,
          startDateId="logs-startDate" // PropTypes.string.isRequired,
          endDate={endDate} // momentPropTypes.momentObj or null,
          endDateId="logs-endDate" // PropTypes.string.isRequired,
          onDatesChange={(data) => {
            onChange(data.startDate, 'startDate');
            onChange(data.endDate, 'endDate');
          }} // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={onFocusChange} // PropTypes.func.isRequired,
        />

        <Button secondary onClick={onDownload} loading={downloading} disabled={!endDate}>
          Download
        </Button>
      </div>
    </div>
  );
}
