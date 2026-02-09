import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventVisualPopup from './EventVisualPopup';

// Mock CTPlayerConstants
jest.mock('../../controllers', () => ({
  CTPlayerConstants: {
    PlayerEventPlay: 'PLAY',
    PlayerEventPause: 'PAUSE',
    PlayerEventRewind: 'REWIND',
    PlayerEventForward: 'FORWARD',
    PlayerEventMute: 'MUTE',
    PlayerEventVolumeUp: 'VOLUME_UP',
    PlayerEventVolumeDown: 'VOLUME_DOWN',
  },
}));

describe('EventVisualPopup', () => {
  it('renders without crashing', () => {
    render(<EventVisualPopup event={null} volume={0.5} />);
  });

  it('has wrapper container with correct classes', () => {
    const { container } = render(<EventVisualPopup event="PLAY" volume={0.5} />);
    const wrapper = container.querySelector('.e-v-popup-con');
    expect(wrapper).toHaveClass('ctp', 'wrapper', 'e-v-popup-con', 'ct-d-c-center');
  });

  it('displays play icon for play event', () => {
    render(<EventVisualPopup event="PLAY" volume={0.5} />);
    expect(screen.getByText('play_arrow')).toBeInTheDocument();
  });

  it('displays pause icon for pause event', () => {
    render(<EventVisualPopup event="PAUSE" volume={0.5} />);
    expect(screen.getByText('pause')).toBeInTheDocument();
  });

  it('displays rewind icon for rewind event', () => {
    render(<EventVisualPopup event="REWIND" volume={0.5} />);
    expect(screen.getByText('replay_5')).toBeInTheDocument();
  });

  it('displays forward icon for forward event', () => {
    render(<EventVisualPopup event="FORWARD" volume={0.5} />);
    expect(screen.getByText('forward_5')).toBeInTheDocument();
  });

  it('displays mute icon for mute event', () => {
    render(<EventVisualPopup event="MUTE" volume={0.5} />);
    expect(screen.getByText('volume_off')).toBeInTheDocument();
  });

  it('displays volume up icon for volume up event', () => {
    render(<EventVisualPopup event="VOLUME_UP" volume={0.75} />);
    const icons = screen.getAllByText('volume_up');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('displays volume down icon for volume down event', () => {
    render(<EventVisualPopup event="VOLUME_DOWN" volume={0.25} />);
    const icons = screen.getAllByText('volume_down');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('shows volume percentage for volume up event', () => {
    render(<EventVisualPopup event="VOLUME_UP" volume={0.75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows volume percentage for volume down event', () => {
    render(<EventVisualPopup event="VOLUME_DOWN" volume={0.33} />);
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('rounds volume percentage to nearest integer', () => {
    render(<EventVisualPopup event="VOLUME_UP" volume={0.667} />);
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('does not show volume percentage for non-volume events', () => {
    const { container } = render(<EventVisualPopup event="PLAY" volume={0.5} />);
    expect(container.querySelector('.e-v-volume-con')).not.toBeInTheDocument();
  });

  it('does not show icon when event is null', () => {
    const { container } = render(<EventVisualPopup event={null} volume={0.5} />);
    const icon = container.querySelector('.e-v-popup-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('does not show icon when event is undefined', () => {
    const { container } = render(<EventVisualPopup volume={0.5} />);
    const icon = container.querySelector('.e-v-popup-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('icon has material-icons class', () => {
    const { container } = render(<EventVisualPopup event="PLAY" volume={0.5} />);
    const icons = container.querySelectorAll('.material-icons');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('volume icon has aria-hidden attribute', () => {
    const { container } = render(<EventVisualPopup event="VOLUME_UP" volume={0.5} />);
    const ariaHiddenIcon = container.querySelector('[aria-hidden="true"]');
    expect(ariaHiddenIcon).toBeInTheDocument();
  });

  it('handles volume of 0', () => {
    render(<EventVisualPopup event="VOLUME_DOWN" volume={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles volume of 1', () => {
    render(<EventVisualPopup event="VOLUME_UP" volume={1} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
