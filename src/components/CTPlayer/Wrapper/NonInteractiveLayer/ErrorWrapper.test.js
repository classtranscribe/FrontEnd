import React from 'react';
import { render, screen } from '@testing-library/react';
import { __mockUser as mockUser } from 'utils';
import ErrorWrapper from './ErrorWrapper';


// Mock layout components
jest.mock('layout', () => ({
  CTFragment: ({ children, center, dFlexCol, ...props }) => (
    <div data-center={center} data-dflex-col={dFlexCol} {...props}>
      {children}
    </div>
  ),
  CTText: ({ children, white, size, textCenter, ...props }) => (
    <span data-white={white} data-size={size} data-text-center={textCenter} {...props}>
      {children}
    </span>
  ),
}));

// Mock SignInPrompt
jest.mock('components', () => ({
  SignInPrompt: ({ topDescription, targetBlank, closeAfterSignedIn }) => (
    <div
      data-testid="sign-in-prompt"
      data-target-blank={targetBlank}
      data-close-after-signed-in={closeAfterSignedIn}
    >
      {topDescription}
    </div>
  ),
}));

// Mock user utility
jest.mock('utils', () => {
  const mockedUser = {
    isLoggedIn: false,
  };
  return {
    user: mockedUser,
    __mockUser: mockedUser, // Export for test access
  };
});

describe('ErrorWrapper', () => {
  beforeEach(() => {
    mockUser.isLoggedIn = false;
  });

  it('renders without crashing', () => {
    render(<ErrorWrapper error={404} />);
  });

  it('displays generic error message for 404', () => {
    render(<ErrorWrapper error={404} />);
    expect(screen.getByText(/Media Unavailable: 404 Error/)).toBeInTheDocument();
  });

  it('displays generic error message for 500', () => {
    render(<ErrorWrapper error={500} />);
    expect(screen.getByText(/Media Unavailable: 500 Error/)).toBeInTheDocument();
  });

  it('displays generic error message for other error codes', () => {
    render(<ErrorWrapper error={403} />);
    expect(screen.getByText(/Media Unavailable: 403 Error/)).toBeInTheDocument();
  });

  it('shows SignInPrompt for 401 when not logged in', () => {
    mockUser.isLoggedIn = false;
    render(<ErrorWrapper error={401} />);
    expect(screen.getByTestId('sign-in-prompt')).toBeInTheDocument();
  });

  it('passes correct props to SignInPrompt', () => {
    mockUser.isLoggedIn = false;
    render(<ErrorWrapper error={401} />);
    const prompt = screen.getByTestId('sign-in-prompt');
    expect(prompt).toHaveAttribute('data-target-blank', 'true');
    expect(prompt).toHaveAttribute('data-close-after-signed-in', 'true');
  });

  it('displays sign in message in SignInPrompt', () => {
    mockUser.isLoggedIn = false;
    render(<ErrorWrapper error={401} />);
    expect(screen.getByText('Please sign in to watch the video.')).toBeInTheDocument();
  });

  it('shows unauthorized message for 401 when logged in', () => {
    mockUser.isLoggedIn = true;
    render(<ErrorWrapper error={401} />);
    expect(screen.getByText(/Unauthorized Access/)).toBeInTheDocument();
    expect(screen.getByText(/you are not authorized/)).toBeInTheDocument();
  });

  it('does not show SignInPrompt when logged in with 401', () => {
    mockUser.isLoggedIn = true;
    render(<ErrorWrapper error={401} />);
    expect(screen.queryByTestId('sign-in-prompt')).not.toBeInTheDocument();
  });

  it('applies white text style', () => {
    const { container } = render(<ErrorWrapper error={404} />);
    const text = container.querySelector('[data-white]');
    expect(text).toHaveAttribute('data-white', 'true');
  });

  it('applies medium size style', () => {
    const { container } = render(<ErrorWrapper error={404} />);
    const text = container.querySelector('[data-size]');
    expect(text).toHaveAttribute('data-size', 'medium');
  });

  it('centers text for logged in 401 error', () => {
    mockUser.isLoggedIn = true;
    const { container } = render(<ErrorWrapper error={401} />);
    const text = container.querySelector('[data-text-center]');
    expect(text).toHaveAttribute('data-text-center', 'true');
  });

  it('renders CTFragment container', () => {
    const { container } = render(<ErrorWrapper error={404} />);
    const fragment = container.querySelector('[data-center]');
    expect(fragment).toBeInTheDocument();
  });

  it('handles error prop as string', () => {
    render(<ErrorWrapper error="404" />);
    expect(screen.getByText(/Media Unavailable: 404 Error/)).toBeInTheDocument();
  });

  it('includes line break in unauthorized message', () => {
    mockUser.isLoggedIn = true;
    const { container } = render(<ErrorWrapper error={401} />);
    const br = container.querySelector('br');
    expect(br).toBeInTheDocument();
  });
});
