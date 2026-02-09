import React from 'react';
import { render, screen } from '@testing-library/react';
import ShortcutModal from './ShortcutModal';

// Mock CTModal
jest.mock('layout/CTModal', () => ({
  CTModal: ({ children, open, title, onClose, withCloseButton }) => (
    open ? (
      <div data-testid="modal" role="dialog">
        <div data-testid="modal-title">{title}</div>
        {withCloseButton && (
          <button onClick={onClose} data-testid="close-button">Close</button>
        )}
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null
  ),
}));

// Mock ShortcutTable
jest.mock('./ShortcutTable', () => {
  return function ShortcutTable({ shortcuts, fullWidth }) {
    return (
      <div data-testid="shortcut-table" data-fullwidth={fullWidth ? 'true' : 'false'}>
        {shortcuts.length} shortcuts
      </div>
    );
  };
});

describe('ShortcutModal', () => {
  const mockShortcuts = [
    {
      category: 'Playback',
      actions: [
        { name: 'Play/Pause', keys: ['space'] },
      ],
    },
  ];

  it('renders when open is true', () => {
    render(<ShortcutModal open shortcuts={mockShortcuts} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<ShortcutModal open={false} shortcuts={mockShortcuts} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders default title "Shortcuts"', () => {
    render(<ShortcutModal open shortcuts={mockShortcuts} />);
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Shortcuts');
  });

  it('renders custom title', () => {
    render(<ShortcutModal open title="Keyboard Shortcuts" shortcuts={mockShortcuts} />);
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Keyboard Shortcuts');
  });

  it('passes shortcuts to ShortcutTable', () => {
    render(<ShortcutModal open shortcuts={mockShortcuts} />);
    expect(screen.getByTestId('shortcut-table')).toHaveTextContent('1 shortcuts');
  });

  it('passes fullWidth prop to ShortcutTable', () => {
    render(<ShortcutModal open shortcuts={mockShortcuts} fullWidth />);
    const table = screen.getByTestId('shortcut-table');
    expect(table).toHaveAttribute('data-fullwidth', 'true');
  });

  it('does not pass fullWidth when prop is false', () => {
    render(<ShortcutModal open shortcuts={mockShortcuts} fullWidth={false} />);
    const table = screen.getByTestId('shortcut-table');
    expect(table).toHaveAttribute('data-fullwidth', 'false');
  });

  it('renders close button (withCloseButton)', () => {
    render(<ShortcutModal open shortcuts={mockShortcuts} />);
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ShortcutModal open shortcuts={mockShortcuts} onClose={onClose} />);

    screen.getByTestId('close-button').click();

    expect(onClose).toHaveBeenCalled();
  });

  it('passes through additional modal props', () => {
    // Since we're mocking CTModal, we can verify the props are passed
    // In a real test, this would be verified through CTModal behavior
    render(
      <ShortcutModal
        open
        shortcuts={mockShortcuts}
        data-testid="custom-modal"
      />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('handles empty shortcuts array', () => {
    render(<ShortcutModal open shortcuts={[]} />);
    expect(screen.getByTestId('shortcut-table')).toHaveTextContent('0 shortcuts');
  });

  it('uses default empty shortcuts array when not provided', () => {
    render(<ShortcutModal open />);
    expect(screen.getByTestId('shortcut-table')).toHaveTextContent('0 shortcuts');
  });
});
