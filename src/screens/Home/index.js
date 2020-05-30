/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React from 'react';
import _ from 'lodash';
import { CTLayout } from 'components';
import { api, user } from 'utils';
import './transition.css';
import './index.css';

import { Feed } from './Components';


export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = user.isLoggedIn;

    this.state = {
      offerings: ['Unloaded'],
      watchHistory: this.isLoggedIn ? ['unloaded'] : [],
      watchHistoryJSON: {},
      starredOfferings: this.isLoggedIn ? ['unloaded'] : [],
      starredOfferingsJSON: {},

      onboarded: true,
    };
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    this.getOfferingsByStudent();
    this.getUserMetadata();
  }

  getOfferingsByStudent = () => {
    this.setState({ offerings: ['Unloaded'] });
    api
      .getOfferingsByStudent()
      .then(({ data }) => {
        this.completeOfferings((data || []).slice().reverse());
        api.contentLoaded();
      })
      .catch((error) => {
        this.setState({ offerings: ['retry'] });
        api.contentLoaded();
      });
  };

  componentDidUpdate(prevProps, prevState) {
    const { watchHistoryJSON, watchHistory } = this.state;
    if (watchHistory !== prevState.watchHistory) {
      if (watchHistory.length && watchHistory.length > 30) {
        for (let i = 30; i < watchHistory.length; i += 1) {
          const { mediaId } = watchHistory[i];
          if (watchHistoryJSON[mediaId]) delete watchHistoryJSON[mediaId];
        }
        this.setState(
          {
            watchHistoryJSON,
            watchHistory: watchHistory.slice(0, 30),
          },
          () => this.updateUserMetadata(),
        );
      }
    }
  }

  getUserMetadata = () => {
    if (!this.isLoggedIn) return;
    api.storeUserMetadata({
      setWatchHistory: (watchHistoryJSON) => this.setState({ watchHistoryJSON }),
      setStarredOfferings: (starredOfferingsJSON) => this.setState({ starredOfferingsJSON }),
      setWatchHistoryArray: (watchHistory) => this.setState({ watchHistory }),
      setStarredOfferingsArray: (starredOfferings) => this.setState({ starredOfferings }),
      // setOnboarded: onboarded => this.setState({ onboarded: Boolean(onboarded['home']) }),
    });
  };

  updateUserMetadata = () => {
    const { starredOfferingsJSON } = this.state;
    api.postUserMetaData({
      starredOfferings: JSON.stringify(starredOfferingsJSON),
    });
    // console.log(watchHistoryJSON, starredOfferingsJSON)
  };

  completeOfferings = async (rawOfferings) => {
    const offerings = await api.parseOfferings(rawOfferings);
    this.setState({ offerings });
  };

  starOffering = (offeringId) => {
    const { starredOfferings, starredOfferingsJSON } = this.state;
    starredOfferings.push(offeringId);
    starredOfferingsJSON[offeringId] = 'starred';
    this.setState({ starredOfferings, starredOfferingsJSON }, () => this.updateUserMetadata());
  };

  unstarOffering = (offeringId) => {
    const { starredOfferings, starredOfferingsJSON } = this.state;
    _.remove(starredOfferings, (id) => id === offeringId);
    if (starredOfferingsJSON[offeringId]) delete starredOfferingsJSON[offeringId];
    this.setState({ starredOfferings, starredOfferingsJSON }, () => this.updateUserMetadata());
  };

  getLayoutProps() {
    return CTLayout.createProps({
      transition: true,
      responsive: true,
      defaultOpenSidebar: true,
    });
  }

  render() {
    return (
      <CTLayout {...this.getLayoutProps()}>
        <Feed {...this} />
      </CTLayout>
    );
  }
}
