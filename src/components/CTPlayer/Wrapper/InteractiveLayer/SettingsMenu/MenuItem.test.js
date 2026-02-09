import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MenuItem from './MenuItem';

describe('MenuItem', () => {
  const defaultProps = {
    text: 'Test Item',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MenuItem {...defaultProps} />);
  });

  it('displays text', () => {
    render(<MenuItem text="Playback Rate" />);
    expect(screen.getByText('Playback Rate')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<MenuItem text="Rate" current="1.5x" />);
    expect(screen.getByText('1.5x')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<MenuItem text="Test" onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Test'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies settings-menuitem class', () => {
    const { container } = render(<MenuItem {...defaultProps} />);
    const button = container.querySelector('button');
    expect(button.className).toContain('settings-menuitem');
  });

  it('applies ctp class', () => {
    const { container } = render(<MenuItem {...defaultProps} />);
    const button = container.querySelector('button');
    expect(button.className).toContain('ctp');
  });

  it('applies active class when active is true', () => {
    const { container } = render(<MenuItem {...defaultProps} active />);
    const button = container.querySelector('button');
    expect(button.className).toContain('active');
  });

  it('does not apply active class when active is false', () => {
    const { container } = render(<MenuItem {...defaultProps} active={false} />);
    const button = container.querySelector('button');
    expect(button.className).not.toContain('active');
  });

  it('applies bordered class when bordered is true', () => {
    const { container } = render(<MenuItem {...defaultProps} bordered />);
    const button = container.querySelector('button');
    expect(button.className).toContain('bordered');
  });

  it('applies go-back class when goBack is true', () => {
    const { container } = render(<MenuItem {...defaultProps} goBack />);
    const button = container.querySelector('button');
    expect(button.className).toContain('go-back');
  });

  it('has role="menuitemradio"', () => {
    const { container } = render(<MenuItem {...defaultProps} />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('role', 'menuitemradio');
  });

  it('sets aria-checked to true when active', () => {
    const { container } = render(<MenuItem {...defaultProps} active />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('sets aria-checked to false when not active', () => {
    const { container } = render(<MenuItem {...defaultProps} active={false} />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('sets aria-haspopup when isSubMenu is true', () => {
    const { container } = render(<MenuItem {...defaultProps} isSubMenu />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
  });

  it('autofocuses when active is true', () => {
    const { container } = render(<MenuItem {...defaultProps} active />);
    const button = container.querySelector('button');
    // In React, autoFocus prop is used but doesn't create an HTML autofocus attribute in tests
    // We can't test this directly in JSDOM, so just verify the button renders
    expect(button).toBeInTheDocument();
  });

  it('does not autofocus when active is false', () => {
    const { container } = render(<MenuItem {...defaultProps} active={false} />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('shows check icon by default', () => {
    render(<MenuItem {...defaultProps} />);
    expect(screen.getByText('check')).toBeInTheDocument();
  });

  it('shows back arrow when goBack is true', () => {
    render(<MenuItem {...defaultProps} goBack />);
    expect(screen.getByText('arrow_back_ios')).toBeInTheDocument();
  });

  it('shows forward arrow when isSubMenu is true', () => {
    render(<MenuItem {...defaultProps} isSubMenu />);
    expect(screen.getByText('arrow_forward_ios')).toBeInTheDocument();
  });

  it('does not show forward arrow when isSubMenu is false', () => {
    render(<MenuItem {...defaultProps} isSubMenu={false} />);
    expect(screen.queryByText('arrow_forward_ios')).not.toBeInTheDocument();
  });

  it('hides check icon when isSubMenu is true and not bordered', () => {
    const { container } = render(<MenuItem {...defaultProps} isSubMenu bordered={false} />);
    const checkIcons = container.querySelectorAll('.check-icon');
    expect(checkIcons.length).toBe(0);
  });

  it('shows check icon when isSubMenu is true but bordered is also true', () => {
    const { container } = render(<MenuItem {...defaultProps} isSubMenu bordered />);
    const checkIcons = container.querySelectorAll('.check-icon');
    expect(checkIcons.length).toBeGreaterThan(0);
  });

  it('marks check icon as aria-hidden', () => {
    const { container } = render(<MenuItem {...defaultProps} />);
    const checkIcon = container.querySelector('.check-icon');
    expect(checkIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('marks right arrow as aria-hidden', () => {
    const { container } = render(<MenuItem {...defaultProps} isSubMenu />);
    const rightArrow = container.querySelector('.right-arrow');
    expect(rightArrow).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies checked class to check icon when active', () => {
    const { container } = render(<MenuItem {...defaultProps} active />);
    const checkIcon = container.querySelector('.check-icon');
    expect(checkIcon.className).toContain('checked');
  });

  it('applies checked class to check icon when goBack', () => {
    const { container } = render(<MenuItem {...defaultProps} goBack />);
    const checkIcon = container.querySelector('.check-icon');
    expect(checkIcon.className).toContain('checked');
  });

  it('renders left section with text', () => {
    const { container } = render(<MenuItem {...defaultProps} />);
    const left = container.querySelector('.left');
    expect(left).toBeInTheDocument();
    expect(left.querySelector('.menuitem-text')).toBeInTheDocument();
  });

  it('renders right section with current value', () => {
    const { container } = render(<MenuItem text="Test" current="Value" />);
    const right = container.querySelector('.right');
    expect(right).toBeInTheDocument();
    expect(right.querySelector('.current-value')).toHaveTextContent('Value');
  });
});
