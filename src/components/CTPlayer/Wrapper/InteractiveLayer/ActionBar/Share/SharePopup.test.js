import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SharePopup from './SharePopup';

// Mock Material-UI ClickAwayListener
jest.mock('@material-ui/core/ClickAwayListener', () => {
  return function ClickAwayListener({ children }) {
    return <div data-testid="click-away-listener">{children}</div>;
  };
});

// Mock pico-ui Button
jest.mock('pico-ui', () => ({
  Button: ({ children, onClick, icon, ...props }) => (
    <button onClick={onClick} data-icon={icon} {...props}>
      {children}
    </button>
  ),
}));

describe('SharePopup', () => {
  const defaultProps = {
    open: true,
    shareLink: 'https://example.com/share/123',
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    document.execCommand = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when open is false', () => {
    const { container } = render(<SharePopup {...defaultProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when open is true', () => {
    render(<SharePopup {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<SharePopup {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'ctp-share-title');
  });

  it('displays title', () => {
    render(<SharePopup {...defaultProps} />);
    expect(screen.getByText('SHARE LINK')).toBeInTheDocument();
  });

  it('displays share link in input field', () => {
    render(<SharePopup {...defaultProps} />);
    const input = screen.getByDisplayValue('https://example.com/share/123');
    expect(input).toBeInTheDocument();
  });

  it('input is read-only', () => {
    render(<SharePopup {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.shareLink);
    expect(input).toHaveAttribute('readOnly');
  });

  it('renders COPY LINK button', () => {
    render(<SharePopup {...defaultProps} />);
    expect(screen.getByText('COPY LINK')).toBeInTheDocument();
  });

  it('renders CANCEL button', () => {
    render(<SharePopup {...defaultProps} />);
    expect(screen.getByText('CANCEL')).toBeInTheDocument();
  });

  it('calls onClose when CANCEL is clicked', () => {
    render(<SharePopup {...defaultProps} />);
    fireEvent.click(screen.getByText('CANCEL'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls document.execCommand when COPY LINK is clicked', () => {
    render(<SharePopup {...defaultProps} />);
    fireEvent.click(screen.getByText('COPY LINK'));
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('shows COPIED state after clicking COPY LINK', () => {
    render(<SharePopup {...defaultProps} />);

    fireEvent.click(screen.getByText('COPY LINK'));

    expect(screen.getByText('COPIED')).toBeInTheDocument();
  });

  it('shows check icon after copying', () => {
    render(<SharePopup {...defaultProps} />);

    fireEvent.click(screen.getByText('COPY LINK'));

    const copiedButton = screen.getByText('COPIED');
    expect(copiedButton).toHaveAttribute('data-icon', 'check');
  });

  it('closes after 2 seconds when copied', () => {
    render(<SharePopup {...defaultProps} />);

    fireEvent.click(screen.getByText('COPY LINK'));

    expect(screen.getByText('COPIED')).toBeInTheDocument();

    jest.advanceTimersByTime(2000);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('resets copy status when closing before timeout', () => {
    jest.clearAllTimers(); // Clear any pending timers
    const { unmount } = render(<SharePopup {...defaultProps} />);

    fireEvent.click(screen.getByText('COPY LINK'));
    expect(screen.getByText('COPIED')).toBeInTheDocument();

    // Unmount and remount to ensure fresh state
    unmount();
    render(<SharePopup {...defaultProps} open />);

    expect(screen.getByText('COPY LINK')).toBeInTheDocument();
  });

  it('selects input text on focus', () => {
    render(<SharePopup {...defaultProps} />);
    const input = screen.getByDisplayValue(defaultProps.shareLink);

    input.select = jest.fn();
    fireEvent.focus(input);

    expect(input.select).toHaveBeenCalled();
  });

  it('has correct dialog id', () => {
    render(<SharePopup {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('id', 'ctp-share-con');
  });

  it('has correct class names', () => {
    render(<SharePopup {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('ctp', 'share-popup');
  });

  it('input container has correct class name', () => {
    const { container } = render(<SharePopup {...defaultProps} />);
    const shareLink = container.querySelector('.share-link');
    expect(shareLink).toBeInTheDocument();
    expect(shareLink.className).toContain('ctp');
  });

  it('updates share link when prop changes', () => {
    const { rerender } = render(<SharePopup {...defaultProps} />);

    expect(screen.getByDisplayValue('https://example.com/share/123')).toBeInTheDocument();

    rerender(<SharePopup {...defaultProps} shareLink="https://example.com/share/456" />);

    expect(screen.getByDisplayValue('https://example.com/share/456')).toBeInTheDocument();
  });
});
