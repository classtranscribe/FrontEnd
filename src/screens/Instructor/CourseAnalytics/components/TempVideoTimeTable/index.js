import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader, Segment } from 'semantic-ui-react';
import { Button } from 'pico-ui';
import _ from 'lodash';
import './index.css';
import { CTHeading, CTFragment, CTText, CTSelect } from 'layout';
import { vtime } from './vtime';

function TempVideoTimeTable({ offeringId }) {
  const [selectedVideos, setSelectVideos] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [playListVideoMap, setPlaylistVideoMap] = useState({});
  const [videoIDNameMap, setVideoIDNameMap] = useState({});
  const [videoList, setVideoList] = useState([]);
  const [total, setTotal] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [userData, setUserData] = useState([]);
  const [editTrans, setEditTrans] = useState(null);
  const [column, setColumn] = useState(null);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    if (offeringId) {
      vtime.init({
        offeringId,
        setTotal,
        setAllLogs,
        setPlaylistData,
        setEditTransCount: setEditTrans,
      });
      vtime.setup();
    }
  }, [offeringId]);
  useEffect(() => {
    setUserData(parseUserData());
  }, [allLogs]);
  useEffect(() => {
    setupVideoListData();
  }, [playlistData]);


  useEffect(() => {
    setUserData(parseUserData());
  }, [selectedVideos]);

  const handleSort = (clickedColumn) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      const sortedData = _.sortBy(userData, [clickedColumn]);
      setUserData(sortedData);
      setDirection('ascending');
    } else {
      setUserData(userData.reverse());
      setColumn(clickedColumn);
      setDirection(direction === 'ascending' ? 'descending' : 'ascending');
    }
  };
  const handleSelect = ({ target: { value } }) => {
    setSelectVideos(value);
  };
  const setupVideoListData = () => {
    var video_list = [];
    var video_id_map = {};
    var playlist_map = {};
    for (var i = 0; i < playlistData.length; i++) {
      playlist_map[playlistData[i].id] = [];
      for (var j = 0; j < playlistData[i].media.length; j++) {
        video_id_map[playlistData[i].media[j].id] = playlistData[i].media[j].name;
        video_list.push({
          value: playlistData[i].media[j].id,
          text: playlistData[i].media[j].name,
        });
        playlist_map[playlistData[i].id].push({
          value: playlistData[i].media[j].id,
          text: playlistData[i].media[j].name,
        });
      }
    }
    setPlaylistVideoMap(playlist_map);
    setVideoIDNameMap(video_id_map);
    setVideoList(video_list);
  };

  const addVideo = (id) => {
    setSelectVideos(selectedVideos.concat(id));
  };
  const removeVideo = (id) => {
    setSelectVideos(selectedVideos.filter((item) => item != id));
  };

  const addPlayList = (id) => {
    for (var i = 0; i < playListVideoMap[id].length; i++) {
      if (!(playListVideoMap[id][i] in selectedVideos)) {
        addVideo(playListVideoMap[id][i]);
      }
    }
  };
  const removePlaylist = (id) => {
    for (var i = 0; i < playListVideoMap[id].length; i++) {
      if (playListVideoMap[id][i] in selectedVideos) {
        removeVideo(playListVideoMap[id][i]);
      }
    }
  };
  const parseUserData = () => {
    var user_array = [];
    for (var i = 0; i < allLogs.length; i++) {
      var user = allLogs[i];
      var user_map = {
        email: user.email,
        count: 0,
        editTransCount: user.editTransCount,
        last3days: 0,
        lastHr: 0,
        lastMonth: 0,
        lastWeek: 0,
      };
      for (var j = 0; j < user.media.length; j++) {
        if (selectedVideos.includes(user.media[j].mediaId)) {
          user_map.count += user.media[j].count;
          user_map.last3days += user.media[j].last3days;
          user_map.lastHr += user.media[j].lastHr;
          user_map.lastMonth += user.media[j].lastMonth;
          user_map.lastWeek += user.media[j].lastWeek;
        }
      }
      user_array.push(user_map);
    }
    return user_array;
  };
  const onDownload = () => vtime.download();
  const onDownloadEditTrans = () => vtime.downloadEditTransCount(editTrans);

  return (
    <CTFragment className="analytic_table" loading={userData.length === 0}>
      <CTHeading as="h3" highlight padding={[0, 10]} uppercase>
        Transcription Editing
      </CTHeading>
      <hr />

      <CTFragment justConBetween>
        <CTText className="pl-3">
          <b>
            There are {Array.isArray(editTrans) ? editTrans.length + 1 : 0} students edited
            transcriptions for this course.
          </b>{' '}
          <br />
          <br />
          The editing history for each student is shown below in the last column{' '}
          <i>Captions Revised</i> of the Video Time Table. <br />
          For more details, please use the button on the right to download the csv file.
        </CTText>

        <Button
          uppercase
          text="Download CSV file"
          color="teal"
          onClick={onDownloadEditTrans}
          disabled={!Array.isArray(editTrans)}
        />
      </CTFragment>

      <CTHeading as="h3" highlight padding={[0, 10]} uppercase>
        Video Time
      </CTHeading>
      <hr />

      <CTFragment justConBetween>
        <CTText className="pl-3">
          <b>{userData.length + 1} students have watched the lectures for this course.</b>
          <br />
          <br />
          The table below shows the approximate watch time for each student, you can click on the
          column header to sort the table. <br />
          For more details, please use the button on the right to download the csv file.
        </CTText>

        <Button
          uppercase
          text="Download CSV file"
          color="teal"
          onClick={onDownload}
          loading={userData.length === 0}
        />
      </CTFragment>
      <CTSelect
        id="home-departs-filter"
        placeholder="Filter by videos"
        label="Filter by videos"
        noItemsHolder="No videos selected"
        value={selectedVideos}
        options={videoList}
        onChange={handleSelect}
        underlined
        multiple
      />

      {userData.length === 0 ? (
        <div>
          <Segment className="table_loader">
            <Dimmer active inverted>
              <Loader inverted content="Loading" />
            </Dimmer>
          </Segment>
        </div>
      ) : (
        <Table sortable celled fixed unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'email' ? direction : null}
                onClick={() => handleSort('email')}
              >
                Email
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'lastHr' ? direction : null}
                onClick={() => handleSort('lastHr')}
              >
                Last 1 Hour (mins)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'last3days' ? direction : null}
                onClick={() => handleSort('last3days')}
              >
                Last 3 Days (mins)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'lastWeek' ? direction : null}
                onClick={() => handleSort('lastWeek')}
              >
                Last Week (mins)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'lastMonth' ? direction : null}
                onClick={() => handleSort('lastMonth')}
              >
                Last Month (mins)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'count' ? direction : null}
                onClick={() => handleSort('count')}
              >
                Total Video Time (mins)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'editTransCount' ? direction : null}
                onClick={() => handleSort('editTransCount')}
              >
                Captions Revised
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {userData.map((elem, index) => (
              <Table.Row key={elem.email}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{elem.email}</Table.Cell>
                <Table.Cell>{Math.round(elem.lastHr)}</Table.Cell>
                <Table.Cell>{Math.round(elem.last3days)}</Table.Cell>
                <Table.Cell>{Math.round(elem.lastWeek)}</Table.Cell>
                <Table.Cell>{Math.round(elem.lastMonth)}</Table.Cell>
                <Table.Cell>{Math.round(elem.count)}</Table.Cell>
                <Table.Cell>{elem.editTransCount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </CTFragment>
  );
}

export default TempVideoTimeTable;
