import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
import { courseStore, connectWithRedux, setup, plControl } from './controllers';
import { NewPlaylistForm } from './components';

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
        heading: `Create New Playlist for ${offering ? offering.fullNumber : '...'}`,
        icon: 'add',
        sticky: true,
        gradient: true,
        offsetTop: 30,
      },
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      },
      metaTagsProps: {
        title: offering ? `New Playlist | ${offering.fullNumber}` : `New Playlist`
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
        <CTFragment padding={[0, 30]}>
          <NewPlaylistForm 
            onSave={onSave} 
            isValidIdURL={plControl.isValidIdURL} 
          />
        </CTFragment>
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