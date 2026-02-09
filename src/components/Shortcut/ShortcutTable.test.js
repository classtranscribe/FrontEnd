import React from 'react';
import { render, screen } from '@testing-library/react';
import ShortcutTable from './ShortcutTable';

describe('ShortcutTable', () => {
  const baseShortcuts = [
    {
      category: 'Playback',
      actions: [
        {
          name: 'Toggle play/pause',
          keys: ['space', 'k'],
        },
        {
          name: 'Increase volume',
          keys: [['⇧ Shift', '↑']],
        },
      ],
    },
  ];

  it('renders without crashing', () => {
    render(<ShortcutTable shortcuts={[]} />);
  });

  it('renders category heading', () => {
    render(<ShortcutTable shortcuts={baseShortcuts} />);
    expect(screen.getByText('Playback')).toBeInTheDocument();
  });

  it('renders action names', () => {
    render(<ShortcutTable shortcuts={baseShortcuts} />);
    expect(screen.getByText('Toggle play/pause')).toBeInTheDocument();
    expect(screen.getByText('Increase volume')).toBeInTheDocument();
  });

  it('renders shortcut keys', () => {
    render(<ShortcutTable shortcuts={baseShortcuts} />);
    expect(screen.getByText('space')).toBeInTheDocument();
    expect(screen.getByText('k')).toBeInTheDocument();
  });

  it('renders "or" prefix for multiple single keys', () => {
    render(<ShortcutTable shortcuts={baseShortcuts} />);
    const orElements = screen.getAllByText('or');
    expect(orElements.length).toBeGreaterThan(0);
  });

  it('renders kbd elements for keys', () => {
    const { container } = render(<ShortcutTable shortcuts={baseShortcuts} />);
    const kbdElements = container.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);
  });

  it('applies fullWidth class when prop is true', () => {
    const { container } = render(<ShortcutTable shortcuts={baseShortcuts} fullWidth />);
    expect(container.firstChild.className).toContain('fullWidth');
  });

  it('does not apply fullWidth class when prop is false', () => {
    const { container } = render(<ShortcutTable shortcuts={baseShortcuts} />);
    expect(container.firstChild.className).not.toContain('fullWidth');
  });

  it('renders table with accessibility attributes', () => {
    render(<ShortcutTable shortcuts={baseShortcuts} />);
    const table = screen.getByRole('table', { name: 'Shortcuts table' });
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('aria-rowcount', '2');
  });

  it('renders multiple categories', () => {
    const shortcuts = [
      {
        category: 'Playback',
        actions: [{ name: 'Play', keys: ['space'] }],
      },
      {
        category: 'Navigation',
        actions: [{ name: 'Go forward', keys: ['l'] }],
      },
    ];

    render(<ShortcutTable shortcuts={shortcuts} />);
    expect(screen.getByText('Playback')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders category without heading when category name is empty', () => {
    const shortcuts = [
      {
        category: '',
        actions: [{ name: 'Action', keys: ['a'] }],
      },
    ];

    const { container } = render(<ShortcutTable shortcuts={shortcuts} />);
    const heading = container.querySelector('h3');
    expect(heading).toBeNull();
  });

  it('handles array of keys (key combinations)', () => {
    const shortcuts = [
      {
        category: 'Test',
        actions: [
          {
            name: 'Combo action',
            keys: [['Ctrl', 'Alt', 'Del']],
          },
        ],
      },
    ];

    render(<ShortcutTable shortcuts={shortcuts} />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('Alt')).toBeInTheDocument();
    expect(screen.getByText('Del')).toBeInTheDocument();
  });

  it('renders + prefix for key combinations', () => {
    const shortcuts = [
      {
        category: 'Test',
        actions: [
          {
            name: 'Multi-key',
            keys: [['Ctrl', 'C']],
          },
        ],
      },
    ];

    render(<ShortcutTable shortcuts={shortcuts} />);
    const plusElements = screen.getAllByText('+');
    expect(plusElements.length).toBeGreaterThan(0);
  });

  it('handles empty shortcuts array', () => {
    const { container } = render(<ShortcutTable shortcuts={[]} />);
    expect(container.querySelector('table')).toBeNull();
  });

  it('sets correct aria-rowindex on table rows', () => {
    const { container } = render(<ShortcutTable shortcuts={baseShortcuts} />);
    const rows = container.querySelectorAll('.shortcuts-tr');
    expect(rows[0]).toHaveAttribute('aria-rowindex', '1');
    expect(rows[1]).toHaveAttribute('aria-rowindex', '2');
  });
});
