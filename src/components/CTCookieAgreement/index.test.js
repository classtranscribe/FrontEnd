import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import CTCookieAgreement, { AGREEMENT_ACCEPTED_KEY } from './index';

// Mock react-device-detect
jest.mock('react-device-detect', () => ({
    isMobile: false
}));

// Mock utils
jest.mock('utils', () => ({
    user: { isLoggedIn: false },
    links: {
        signIn: () => '/sign-in'
    }
}));

// Get reference to mocked user
import { user } from 'utils';

// Mock layout components
jest.mock('layout', () => ({
    CTFragment: ({ children, ...props }) => <div {...props}>{children}</div>,
    CTText: ({ children, ...props }) => <span {...props}>{children}</span>,
    CTBrand: () => <span>ClassTranscribe</span>,
    CTList: ({ items }) => (
        <div data-testid="ct-list">
            {items.map((item, i) => (
                <button key={i} onClick={item.onClick} data-testid={`option-${i}`}>
                    {item.title}
                </button>
            ))}
        </div>
    ),
    CTModal: ({ open, children }) => open ? (
        <div data-testid="modal" role="dialog">{children}</div>
    ) : null
}));

// Mock policies
jest.mock('./policies', () => ({
    CookiePolicyLinks: ['https://example.com/cookie'],
    PrivacyPolicyLinks: ['https://example.com/privacy'],
    TermsOfUseLinks: ['https://example.com/terms']
}));

describe('CTCookieAgreement', () => {
    let localStorageMock;

    beforeEach(() => {
        jest.useFakeTimers();
        localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });
        user.isLoggedIn = false;
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<CTCookieAgreement />);
    });

    it('does not show modal initially', () => {
        localStorageMock.getItem.mockReturnValue(null);
        render(<CTCookieAgreement />);

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('shows modal after timeout when cookies not accepted and user not logged in', () => {
        localStorageMock.getItem.mockReturnValue(null);
        user.isLoggedIn = false;

        render(<CTCookieAgreement />);

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('does not show modal when cookies already accepted', () => {
        localStorageMock.getItem.mockReturnValue('true');

        render(<CTCookieAgreement />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('does not show modal when user is logged in', () => {
        localStorageMock.getItem.mockReturnValue(null);
        user.isLoggedIn = true;

        render(<CTCookieAgreement />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('displays welcome message when modal is open', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(<CTCookieAgreement />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.getByText('Welcome To')).toBeInTheDocument();
        expect(screen.getByText('ClassTranscribe')).toBeInTheDocument();
    });

    it('shows cookie options when modal is open', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(<CTCookieAgreement />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.getByText('Accept and Sign In')).toBeInTheDocument();
        expect(screen.getByText('Accept and Skip Sign In')).toBeInTheDocument();
        expect(screen.getByText('Decline and Close Window')).toBeInTheDocument();
    });

    it('saves acceptance to localStorage when "Accept and Skip" is clicked', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(<CTCookieAgreement />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.getByTestId('modal')).toBeInTheDocument();

        const acceptSkipButton = screen.getByText('Accept and Skip Sign In');
        fireEvent.click(acceptSkipButton);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(AGREEMENT_ACCEPTED_KEY, 'true');
    });

    it('checks localStorage with correct key', () => {
        localStorageMock.getItem.mockReturnValue(null);

        render(<CTCookieAgreement />);

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(localStorageMock.getItem).toHaveBeenCalledWith(AGREEMENT_ACCEPTED_KEY);
    });
});
