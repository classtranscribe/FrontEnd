import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewEPubButton from './NewEPubButton';

// Mock Material-UI components
jest.mock('@material-ui/core/Button', () => {
  return function Button({ children, onClick, startIcon, ...props }) {
    return (
      <button onClick={onClick} {...props}>
        {startIcon}
        {children}
      </button>
    );
  };
});

jest.mock('@material-ui/icons/Add', () => {
  return function AddIcon() {
    return <span data-testid="add-icon">+</span>;
  };
});

// Mock useButtonStyles
jest.mock('layout', () => ({
  useButtonStyles: () => ({ teal: 'teal-button' }),
}));

describe('NewEPubButton', () => {
  it('renders without crashing', () => {
    render(<NewEPubButton onCreate={() => {}} />);
  });

  it('displays correct button text', () => {
    render(<NewEPubButton onCreate={() => {}} />);
    expect(screen.getByText('Create new I-Note')).toBeInTheDocument();
  });

  it('renders AddIcon', () => {
    render(<NewEPubButton onCreate={() => {}} />);
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
  });

  it('calls onCreate when clicked', () => {
    const onCreate = jest.fn();
    render(<NewEPubButton onCreate={onCreate} />);

    fireEvent.click(screen.getByText('Create new I-Note'));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('has aria-haspopup attribute', () => {
    render(<NewEPubButton onCreate={() => {}} />);
    const button = screen.getByText('Create new I-Note');
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('applies teal button style', () => {
    render(<NewEPubButton onCreate={() => {}} />);
    const button = screen.getByText('Create new I-Note');
    expect(button.className).toContain('teal-button');
  });

  it('is a contained variant button', () => {
    render(<NewEPubButton onCreate={() => {}} />);
    const button = screen.getByText('Create new I-Note');
    expect(button).toHaveAttribute('variant', 'contained');
  });
});
