/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'pico-ui';
import { PlaceHolder } from 'components';
import { api, util, user, prompt } from 'utils';
import './index.css';

import Playlists from './Playlists';

export function OfferingDetail({ state, starOffering, unstarOffering }) {
  const history = useHistory();
  const { id } = useParams();

  const { starredOfferingsJSON } = state;
  const [offering, setOffering] = useState({});
  const [playlists, setPlaylists] = useState(null);
  const [isStarred, setIsStarred] = useState(Boolean(starredOfferingsJSON[id]));

  const handleStar = () => {
    if (isStarred) unstarOffering(id);
    else starOffering(id);
    setIsStarred((isStarred_) => !isStarred_);
  };

  const getOffering = async () => {
    let parsedOffering = {};

    const propsState = history.location.state;
    if (propsState && propsState.offering) {
      parsedOffering = propsState.offering;
    } else {
      try {
        const { data } = await api.getOfferingById(id);
        parsedOffering = api.parseSingleOffering(data);
      } catch (error) {
        if (api.isAuthError(error)) {
          setPlaylists(['need-signin']);
          return 401;
        }
        prompt.addOne({
          text: "Couldn't load the offering.",
          position: 'top left',
          refresh: true,
          status: 'error',
        });
        return 500;
      }
    }

    setOffering(parsedOffering);
    // console.log('parsedOffering', parsedOffering)
    util.links.title(
      `${parsedOffering.fullNumber} | ${parsedOffering.termName} | ${parsedOffering.sectionName}`,
    );

    return 200;
  };

  const getPlaylists = async () => {
    try {
      const { data } = await api.getPlaylistsByOfferingId(id);
      setPlaylists(data);
    } catch (error) {
      if (api.isAuthError(error)) {
        setPlaylists(['need-signin']);
      } else {
        setPlaylists([]);
        prompt.addOne({
          text: "Couldn't load the playlists.",
          position: 'top left',
          refresh: true,
          status: 'error',
        });
      }
    }
  };

  const setupOfferingDetails = async () => {
    const status = await getOffering();
    if (status === 200) {
      await getPlaylists();
      await api.sendUserAction('selectcourse', { offeringId: id });
    }
  };

  /**
   * Get all offerings and complete offerings
   */
  useEffect(() => {
    util.elem.scrollIntoView('sp-content');
    setupOfferingDetails();
  }, [id]);

  useEffect(() => {
    setIsStarred(Boolean(starredOfferingsJSON[id]));
  }, [starredOfferingsJSON]);

  return offering.id ? (
    <div className="offering-detail ct-a-fade-in">
      {/* Offering Info */}
      <div className="offering-info">

        <h1 className="od-course-number">{offering.fullNumber}</h1>

        <h2 className="od-course-name">{offering.courseName}</h2>

        <div className="od-course-txt">
          {offering.termName} | {offering.sectionName}
        </div>

        {offering.description && <p className="offering-description">{offering.description}</p>}
        <br />
        {user.isLoggedIn && (
          <Button
            uppercase
            id="off-star-btn"
            color={isStarred ? '' : 'teal'}
            icon={isStarred ? 'star' : 'star_border'}
            text={isStarred ? 'unstar' : 'star'}
            onClick={handleStar}
          />
        )}
      </div>

      {/* Playlists */}
      <Playlists
        offeringId={id}
        accessType={offering.accessType}
        history={history}
        playlists={playlists}
      />
    </div>
  ) : (
    <PlaceHolder />
  );
}
