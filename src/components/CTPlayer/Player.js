import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { initialState, CTPlayerController } from './controllers';
import Video from './Video';

export class Player extends React.Component {
  constructor(props) {
    super(props);
    this.player = new CTPlayerController();

    this.state = initialState;
  }

  setPlayerState(key, value) {
    this.setState({ [key]: value });
  }

  componentDidMount() {
    const { mediaId } = this.props;
  }

  render() {
    let {
      id,
      fill = false,
      width = 320,
      height = 240,
      beginAt,
      //
      allowTwoScreen = false,
      // Range picker
      allowRangePicker = false,
      defaultRange,
      range,
      onRangePicked,
    } = this.props;

    const playerClasses = cx('ct-player', { fill });
  
    const video1Props = {
      id: `v1-${ id}`,
      getVideoNode: this.player.registerVideo1
    };
  
    return (
      <div id={id} className={playerClasses}>
        <Video {...video1Props} />
      </div>
    );
  }
}

Player.propTypes = {
  id: PropTypes.string,
  fill: PropTypes.bool,
  width: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  height: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  allowTwoScreen: PropTypes.bool,
};

