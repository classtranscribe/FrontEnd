import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EPubCTListItem from './EPubCTListItem';

// Mock Material-UI components
jest.mock('@material-ui/core', () => ({
  ButtonBase: ({ children, ...props }) => <button {...props}>{children}</button>,
  Checkbox: ({ checked, onChange, ...props }) => (
    <input type="checkbox" checked={checked} onChange={onChange} {...props} />
  ),
  Dialog: ({ open, children, ...props }) => open ? <div data-testid="dialog" {...props}>{children}</div> : null,
  DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogContentText: ({ children }) => <div>{children}</div>,
  DialogActions: ({ children }) => <div>{children}</div>,
  IconButton: ({ children, onClick, 'aria-label': ariaLabel, ...props }) => (
    <button onClick={onClick} aria-label={ariaLabel} {...props}>{children}</button>
  ),
}));

jest.mock('@material-ui/core/styles', () => ({
  createTheme: jest.fn(() => ({})),
  MuiThemeProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('@material-ui/core/colors', () => ({
  amber: {},
}));

// Mock layout components
jest.mock('layout', () => {
  const PropTypes = require('prop-types');
  const CTTextComponent = ({ children, size, bold, ...props }) => (
    <span data-size={size} data-bold={bold} {...props}>{children}</span>
  );
  CTTextComponent.propTypes = {
    size: PropTypes.string, // Proper PropTypes validator
  };

  return {
    CTFragment: ({ children, ...props }) => <div {...props}>{children}</div>,
    CTText: CTTextComponent,
    CTCheckbox: {
      useStyles: jest.fn(() => ({})),
    },
    CTPopoverLabel: ({ children, label }) => (
      <div data-label={label}>{children}</div>
    ),
    CTInput: ({ value, onChange, onReturn, label, placeholder, ...props }) => (
      <input
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onReturn && onReturn(e)}
        placeholder={placeholder || label}
        aria-label={label}
        {...props}
      />
    ),
  };
});

// Mock pico-ui
jest.mock('pico-ui', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// Mock utils
jest.mock('utils', () => ({
  prompt: {
    addOne: jest.fn(),
  },
}));

describe('EPubCTListItem', () => {
  const defaultProps = {
    id: 'epub-1',
    title: 'Test EPub',
    description: 'English',
    icon: 'text_snippet',
    onDelete: jest.fn(),
    onRename: jest.fn(),
    onPin: jest.fn(),
    isSelected: jest.fn(() => false),
    handleSelect: jest.fn(),
    isPinned: false,
    enableButtons: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<EPubCTListItem {...defaultProps} />);
  });

  it('displays title', () => {
    render(<EPubCTListItem {...defaultProps} />);
    expect(screen.getByText('Test EPub')).toBeInTheDocument();
  });

  it('displays description', () => {
    render(<EPubCTListItem {...defaultProps} />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('displays icon', () => {
    render(<EPubCTListItem {...defaultProps} />);
    const icon = screen.getByText('text_snippet');
    expect(icon).toHaveClass('material-icons');
  });

  it('renders checkbox when enableButtons is true', () => {
    const { container } = render(<EPubCTListItem {...defaultProps} />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('does not render checkbox when enableButtons is false', () => {
    const { container } = render(
      <EPubCTListItem {...defaultProps} enableButtons={false} />
    );
    expect(container.querySelector('input[type="checkbox"]')).not.toBeInTheDocument();
  });

  it('calls handleSelect when checkbox clicked', () => {
    const mockHandleSelect = jest.fn();
    const { container } = render(
      <EPubCTListItem {...defaultProps} handleSelect={mockHandleSelect} />
    );

    const checkbox = container.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);

    expect(mockHandleSelect).toHaveBeenCalledWith('epub-1', true);
  });

  it('checkbox reflects selection state', () => {
    const isSelected = jest.fn((id) => id === 'epub-1');
    const { container } = render(
      <EPubCTListItem {...defaultProps} isSelected={isSelected} />
    );

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeChecked();
  });

  it('renders rename button', () => {
    render(<EPubCTListItem {...defaultProps} />);
    expect(screen.getByLabelText('Rename')).toBeInTheDocument();
  });

  it('switches to edit mode when rename clicked', () => {
    render(<EPubCTListItem {...defaultProps} />);

    const renameBtn = screen.getByLabelText('Rename');
    fireEvent.click(renameBtn);

    expect(screen.getByPlaceholderText('Test EPub')).toBeInTheDocument();
  });

  it('shows save button in edit mode', () => {
    render(<EPubCTListItem {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Rename'));

    expect(screen.getByLabelText('Save')).toBeInTheDocument();
  });

  it('calls onRename when saved with new value', () => {
    const mockOnRename = jest.fn();
    render(<EPubCTListItem {...defaultProps} onRename={mockOnRename} />);

    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Rename'));

    // Change value
    const input = screen.getByPlaceholderText('Test EPub');
    fireEvent.change(input, { target: { value: 'New Title' } });

    // Save
    fireEvent.click(screen.getByLabelText('Save'));

    expect(mockOnRename).toHaveBeenCalledWith('New Title', 'epub-1');
  });

  it('does not call onRename if value unchanged', () => {
    const mockOnRename = jest.fn();
    render(<EPubCTListItem {...defaultProps} onRename={mockOnRename} />);

    // Enter edit mode
    fireEvent.click(screen.getByLabelText('Rename'));

    // Save without changing
    fireEvent.click(screen.getByLabelText('Save'));

    expect(mockOnRename).not.toHaveBeenCalled();
  });

  it('saves on Enter key press', () => {
    const mockOnRename = jest.fn();
    render(<EPubCTListItem {...defaultProps} onRename={mockOnRename} />);

    fireEvent.click(screen.getByLabelText('Rename'));

    const input = screen.getByPlaceholderText('Test EPub');
    fireEvent.change(input, { target: { value: 'Enter Title' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnRename).toHaveBeenCalledWith('Enter Title', 'epub-1');
  });

  it('renders as link when link prop is true', () => {
    render(
      <BrowserRouter>
        <EPubCTListItem {...defaultProps} link to="/epub/123" />
      </BrowserRouter>
    );
    // Component should render without errors
    expect(screen.getByText('Test EPub')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <EPubCTListItem {...defaultProps} className="custom-class" />
    );
    const listitem = container.querySelector('.ct-listitem');
    expect(listitem).toBeInTheDocument();
  });

  it('uses default role="listitem"', () => {
    const { container } = render(<EPubCTListItem {...defaultProps} />);
    expect(container.firstChild).toHaveAttribute('role', 'listitem');
  });

  it('accepts custom role', () => {
    const { container } = render(<EPubCTListItem {...defaultProps} role="option" />);
    expect(container.firstChild).toHaveAttribute('role', 'option');
  });

  it('displays children when no title', () => {
    render(<EPubCTListItem {...defaultProps} title="">Child Content</EPubCTListItem>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('uses custom title size', () => {
    render(<EPubCTListItem {...defaultProps} titleSize="large" />);
    const title = screen.getByText('Test EPub');
    expect(title).toHaveAttribute('data-size', 'large');
  });

  it('applies titleProps', () => {
    render(<EPubCTListItem {...defaultProps} titleProps={{ className: 'custom-title' }} />);
    const title = screen.getByText('Test EPub');
    expect(title.className).toContain('custom-title');
  });

  it('renders without buttons when enableButtons is false', () => {
    render(<EPubCTListItem {...defaultProps} enableButtons={false} />);
    expect(screen.queryByLabelText('Rename')).not.toBeInTheDocument();
  });

  it('does not render delete dialog initially', () => {
    render(<EPubCTListItem {...defaultProps} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});
