import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';
import { uurl, api, prompt, links } from 'utils';
import { courseStore, connectWithRedux, setup, plControl } from './controllers';
import { NewPlaylistForm } from './Components';

export class NewPlaylistWithRedux extends Component {
  constructor(props) {
    super(props);
    this.offeringId = this.props.match.params.id;

    setup.init(props);
  }

  componentDidMount() {
    setup.setupCourseSettingsPage(this.offeringId);
  }

  render() {
    const { offering } = this.props;
    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Playlist',
        icon: 'add',
        sticky: true,
        gradient: true,
        offsetTop: 30,
      },
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      }
    }));

    const onSave = (newPlaylist) => {
      plControl.updatePlaylist(
        this.offeringId, 
        newPlaylist, 
        this.props.history
      );
    };

    return (
      <CTLayout {...layoutProps}>
        <NewPlaylistForm 
          onSave={onSave} 
          isValidIdURL={plControl.isValidIdURL} 
        />
      </CTLayout>
    );
  }
}

export const NewPlaylist = withReduxProvider(
  NewPlaylistWithRedux,
  courseStore,
  connectWithRedux,
  ['offering'],
  ['all']
);