import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the user utility - must be before component import
jest.mock('utils', () => ({
    user: { isLoggedIn: false }
}));

// Mock the SignInButton component
jest.mock('layout', () => ({
    SignInButton: ({ children, onAfterClick }) => (
        <button onClick={onAfterClick} data-testid="signin-button">
            {children}
        </button>
    )
}));

// Import after mocks are set up
import { SignInPrompt } from './index';
import { user as mockUser } from 'utils';

describe('SignInPrompt', () => {
    beforeEach(() => {
        mockUser.isLoggedIn = false;
    });

    it('renders without crashing', () => {
        render(<SignInPrompt />);
    });

    it('renders nothing when user is logged in', () => {
        mockUser.isLoggedIn = true;
        const { container } = render(<SignInPrompt />);
        expect(container.firstChild).toBeNull();
    });

    it('displays default button text', () => {
        render(<SignInPrompt />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('displays custom button text', () => {
        render(<SignInPrompt buttonText="Log In Now" />);
        expect(screen.getByText('Log In Now')).toBeInTheDocument();
    });

    it('displays default top description', () => {
        render(<SignInPrompt />);
        expect(screen.getByText(/Can't find your courses/)).toBeInTheDocument();
        expect(screen.getByText(/Sign in to see more/)).toBeInTheDocument();
    });

    it('displays custom top description', () => {
        render(<SignInPrompt topDescription="Custom top message" />);
        expect(screen.getByText('Custom top message')).toBeInTheDocument();
    });

    it('displays bottom description when provided', () => {
        render(<SignInPrompt bottomDescription="Custom bottom message" />);
        expect(screen.getByText('Custom bottom message')).toBeInTheDocument();
    });

    it('applies dark mode class when darkMode is true', () => {
        render(<SignInPrompt darkMode />);
        const promptDiv = document.querySelector('.ct-signin-prompt');
        expect(promptDiv).toHaveClass('dark');
    });

    it('shows refresh message after clicking sign in', async () => {
        render(<SignInPrompt />);

        const signInButton = screen.getByTestId('signin-button');
        await userEvent.click(signInButton);

        expect(screen.getByText(/Manually refresh the player if you have successfully signed in/)).toBeInTheDocument();
        expect(screen.getByText('Manually refresh here')).toBeInTheDocument();
    });
});
