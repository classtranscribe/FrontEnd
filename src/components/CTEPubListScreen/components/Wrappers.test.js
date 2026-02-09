import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoLangWrapper, NoEPubWrapper } from './Wrappers';

// Mock layout components
jest.mock('layout', () => ({
  CTFragment: ({ children, ...props }) => <div {...props}>{children}</div>,
  CTText: ({ children, textCenter, bold, ...props }) => (
    <div data-text-center={textCenter} data-bold={bold} {...props}>
      {children}
    </div>
  ),
}));

// Mock pico-ui Button
jest.mock('pico-ui', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock EPubListCtrl - create mock inside factory
jest.mock('../controllers', () => ({
  EPubListCtrl: {
    requestEPub: jest.fn().mockResolvedValue(true),
  },
}));

describe('Wrappers', () => {
  let mockRequestEPub;

  beforeEach(() => {
    // Get the mock function from the mocked module
    const { EPubListCtrl } = require('../controllers');
    mockRequestEPub = EPubListCtrl.requestEPub;
    jest.clearAllMocks();
  });

  describe('NoLangWrapper', () => {
    it('renders without crashing', () => {
      render(<NoLangWrapper />);
    });

    it('displays no transcriptions message', () => {
      render(<NoLangWrapper />);
      expect(screen.getByText('No transcriptions found.')).toBeInTheDocument();
    });

    it('centers text', () => {
      const { container } = render(<NoLangWrapper />);
      const text = container.querySelector('[data-text-center]');
      expect(text).toBeInTheDocument();
    });
  });

  describe('NoEPubWrapper', () => {
    it('renders without crashing', () => {
      render(<NoEPubWrapper sourceType="media" sourceId="123" />);
    });

    it('displays initial message when not requested', () => {
      render(<NoEPubWrapper sourceType="media" sourceId="123" />);
      expect(screen.getByText(/There is no I-Note data for this media now/i)).toBeInTheDocument();
      expect(screen.getByText(/Please make a request for this video/i)).toBeInTheDocument();
    });

    it('displays request button initially', () => {
      render(<NoEPubWrapper sourceType="media" sourceId="123" />);
      expect(screen.getByText('Request I-Note data')).toBeInTheDocument();
    });

    it('calls requestEPub when button clicked', async () => {
      render(<NoEPubWrapper sourceType="media" sourceId="test-id" />);

      const button = screen.getByText('Request I-Note data');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockRequestEPub).toHaveBeenCalledWith('media', 'test-id');
      });
    });

    it('shows success message after request', async () => {
      render(<NoEPubWrapper sourceType="playlist" sourceId="456" />);

      const button = screen.getByText('Request I-Note data');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Request has been sent successfully/i)).toBeInTheDocument();
        expect(screen.getByText(/We are processing the data right now/i)).toBeInTheDocument();
      });
    });

    it('hides request button after request', async () => {
      render(<NoEPubWrapper sourceType="media" sourceId="123" />);

      const button = screen.getByText('Request I-Note data');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.queryByText('Request I-Note data')).not.toBeInTheDocument();
      });
    });

    it('displays loading spinner after request', async () => {
      render(<NoEPubWrapper sourceType="media" sourceId="123" />);

      const button = screen.getByText('Request I-Note data');
      fireEvent.click(button);

      await waitFor(() => {
        const spinner = document.querySelector('.sk-wave');
        expect(spinner).toBeInTheDocument();
      });
    });

    it('renders loading spinner with correct structure', async () => {
      render(<NoEPubWrapper sourceType="media" sourceId="123" />);

      fireEvent.click(screen.getByText('Request I-Note data'));

      await waitFor(() => {
        const rects = document.querySelectorAll('.sk-wave-rect');
        expect(rects.length).toBe(5);
      });
    });

    it('passes sourceType and sourceId correctly', async () => {
      render(<NoEPubWrapper sourceType="offering" sourceId="abc-123" />);

      fireEvent.click(screen.getByText('Request I-Note data'));

      await waitFor(() => {
        expect(mockRequestEPub).toHaveBeenCalledWith('offering', 'abc-123');
      });
    });
  });
});
