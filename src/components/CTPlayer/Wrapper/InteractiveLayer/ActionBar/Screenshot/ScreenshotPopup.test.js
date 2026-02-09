import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScreenshotPopup from './ScreenshotPopup';

// Mock Material-UI ClickAwayListener
jest.mock('@material-ui/core/ClickAwayListener', () => {
  return function ClickAwayListener({ children }) {
    return <div data-testid="click-away-listener">{children}</div>;
  };
});

// Mock pico-ui Button
jest.mock('pico-ui', () => ({
  Button: ({ children, onClick, loading, icon, ...props }) => (
    <button onClick={onClick} data-loading={loading} data-icon={icon} {...props}>
      {children}
    </button>
  ),
}));

describe('ScreenshotPopup', () => {
  const defaultProps = {
    open: true,
    height: 500,
    imgBlob: { url: 'blob:test-url' },
    onClose: jest.fn(),
    downloadScreenshot: jest.fn(),
    copyScreenshotLink: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when open is false', () => {
    const { container } = render(<ScreenshotPopup {...defaultProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when open is true', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'ctp-screenshot-title');
  });

  it('displays title', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    expect(screen.getByText('Captured Image')).toBeInTheDocument();
  });

  it('displays screenshot image', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    const img = screen.getByAltText('Captured screenshot');
    expect(img).toHaveAttribute('src', 'blob:test-url');
  });

  it('sets max height based on height prop', () => {
    render(<ScreenshotPopup {...defaultProps} height={600} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ maxHeight: '570px' });
  });

  it('renders COPY LINK button', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    expect(screen.getByText('COPY LINK')).toBeInTheDocument();
  });

  it('renders DOWNLOAD button', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    expect(screen.getByText('DOWNLOAD')).toBeInTheDocument();
  });

  it('renders CANCEL button', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });

  it('calls downloadScreenshot when DOWNLOAD is clicked', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    fireEvent.click(screen.getByText('DOWNLOAD'));
    expect(defaultProps.downloadScreenshot).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when CANCEL is clicked', () => {
    render(<ScreenshotPopup {...defaultProps} />);
    fireEvent.click(screen.getByText('CANCEL'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls copyScreenshotLink when COPY LINK is clicked', async () => {
    render(<ScreenshotPopup {...defaultProps} />);
    fireEvent.click(screen.getByText('COPY LINK'));
    await waitFor(() => {
      expect(defaultProps.copyScreenshotLink).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state while copying', async () => {
    const slowCopy = jest.fn(() => new Promise(resolve => setTimeout(() => resolve(true), 1000)));
    render(<ScreenshotPopup {...defaultProps} copyScreenshotLink={slowCopy} />);

    fireEvent.click(screen.getByText('COPY LINK'));

    await waitFor(() => {
      const copyButton = screen.getByText('COPY LINK');
      expect(copyButton).toHaveAttribute('data-loading', 'true');
    });
  });

  // TODO: Fix async/timer interaction in these tests
  it.skip('shows COPIED state after successful copy', async () => {
    jest.useRealTimers();
    render(<ScreenshotPopup {...defaultProps} />);
    fireEvent.click(screen.getByText('COPY LINK'));
    await waitFor(() => {
      expect(screen.getByText('COPIED')).toBeInTheDocument();
    });
    jest.useFakeTimers();
  });

  it.skip('shows check icon after successful copy', async () => {
    jest.useRealTimers();
    render(<ScreenshotPopup {...defaultProps} />);
    fireEvent.click(screen.getByText('COPY LINK'));
    await waitFor(() => {
      const copiedButton = screen.getByText('COPIED');
      expect(copiedButton).toHaveAttribute('data-icon', 'check');
    });
    jest.useFakeTimers();
  });

  it.skip('closes after 2 seconds when copy is successful', async () => {
    jest.useRealTimers();
    const onCloseMock = jest.fn();
    render(<ScreenshotPopup {...defaultProps} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText('COPY LINK'));
    await waitFor(() => {
      expect(screen.getByText('COPIED')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    }, { timeout: 3000 });
    jest.useFakeTimers();
  });

  it('does not close when copy fails', async () => {
    const failedCopy = jest.fn().mockResolvedValue(false);
    render(<ScreenshotPopup {...defaultProps} copyScreenshotLink={failedCopy} />);

    fireEvent.click(screen.getByText('COPY LINK'));

    await waitFor(() => {
      expect(failedCopy).toHaveBeenCalled();
    });

    jest.advanceTimersByTime(2000);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('resets copy status when popup reopens', () => {
    const { rerender } = render(<ScreenshotPopup {...defaultProps} />);

    rerender(<ScreenshotPopup {...defaultProps} open={false} />);
    rerender(<ScreenshotPopup {...defaultProps} open />);

    expect(screen.getByText('COPY LINK')).toBeInTheDocument();
  });

  it('renders custom action element when provided', () => {
    const customAction = jest.fn(() => <button>Custom Action</button>);
    render(<ScreenshotPopup {...defaultProps} actionElement={customAction} />);

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
    expect(customAction).toHaveBeenCalledWith(defaultProps.imgBlob);
  });

  it('does not render default buttons when custom action element is provided', () => {
    const customAction = () => <button>Custom Action</button>;
    render(<ScreenshotPopup {...defaultProps} actionElement={customAction} />);

    expect(screen.queryByText('COPY LINK')).not.toBeInTheDocument();
    expect(screen.queryByText('DOWNLOAD')).not.toBeInTheDocument();
    expect(screen.queryByText('CANCEL')).not.toBeInTheDocument();
  });
});
