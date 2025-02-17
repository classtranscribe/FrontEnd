import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import dva from 'dva';
import { Provider } from 'react-redux';

import VolumeControl from './index';

// Create a DVA app similar to your main app
const createApp = (initialState) => {
  const app = dva({
    initialState: {
      playerpref: { volume: 0.5, ...initialState }
    }
  });

  app.model({
    namespace: 'playerpref',
    state: { volume: 0.5, ...initialState }
  });

  app.router(({ history }) => {
    return <VolumeControl />;
  });

  return app;
};

// Helper function to render with DVA
const renderWithDva = (initialState = {}) => {
    const app = createApp(initialState);
    return {
      ...render(
        <Provider store={app._store}>
          <VolumeControl />
        </Provider>
      ),
      app
    };
  };
  
  describe('VolumeControl', () => {
    beforeEach(() => {
      delete window.focusVolumeSlider;
    });
  
    it('sets up focus handler on mount', () => {
      renderWithDva();
      expect(window.focusVolumeSlider).toBeDefined();
    });
  
    it('cleans up focus handler on unmount', () => {
      const { unmount } = renderWithDva();
      unmount();
      expect(window.focusVolumeSlider).toBeUndefined();
    });
  
    it('focuses slider when focusVolumeSlider is called', () => {
      const { container } = renderWithDva();
      const slider = container.querySelector('.volume-slider');
      expect(slider).not.toBeNull();
      window.focusVolumeSlider();
      expect(document.activeElement).toBe(slider);
    });
  
    it('displays correct volume percentage', () => {
      const { container } = renderWithDva({ volume: 0.75 });
      const slider = container.querySelector('.volume-slider');
      expect(slider).not.toBeNull();
      
      console.log('Container HTML:', container.innerHTML); // eslint-disable-line
      console.log('Slider element:', slider); // eslint-disable-line
      
      expect(slider.getAttribute('aria-label')).toBe('Volume at 75 %');
    });
  });