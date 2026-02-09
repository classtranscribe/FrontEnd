import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyButton from './index';

// Mock the layout components
jest.mock('layout', () => ({
    useButtonStyles: () => ({ tealLink: 'teal-link-class' }),
    CTPopoverLabel: ({ children, label }) => (
      <div data-testid="popover" data-label={label}>{children}</div>
    )
}));

// Mock the utils
const mockCopyTextToClipboard = jest.fn();
jest.mock('utils', () => ({
    _copyTextToClipboard: (...args) => mockCopyTextToClipboard(...args),
    prompt: {
        addOne: jest.fn()
    }
}));

describe('CopyButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<CopyButton text="test" />);
    });

    it('renders as IconButton when no children provided', () => {
        render(<CopyButton text="test" label="Copy link" />);
        const iconButton = screen.getByRole('button');
        expect(iconButton).toBeInTheDocument();
    });

    it('renders as Button with text when children provided', () => {
        render(<CopyButton text="test">Copy Link</CopyButton>);
        expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    it('copies text to clipboard on click', async () => {
        mockCopyTextToClipboard.mockResolvedValue(true);
        render(<CopyButton text="https://example.com" />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(mockCopyTextToClipboard).toHaveBeenCalledWith('https://example.com');
    });

    it('shows "Link Copied!" after successful copy when children provided', async () => {
        mockCopyTextToClipboard.mockResolvedValue(true);
        render(<CopyButton text="test">Copy Link</CopyButton>);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Link Copied!')).toBeInTheDocument();
        });
    });

    it('calls onCopied callback on successful copy', async () => {
        mockCopyTextToClipboard.mockResolvedValue(true);
        const onCopied = jest.fn();
        render(<CopyButton text="test" onCopied={onCopied} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        await waitFor(() => {
            expect(onCopied).toHaveBeenCalledTimes(1);
        });
    });

    it('calls onError callback on failed copy', async () => {
        mockCopyTextToClipboard.mockResolvedValue(false);
        const onError = jest.fn();
        render(<CopyButton text="test" onError={onError} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        await waitFor(() => {
            expect(onError).toHaveBeenCalled();
        });
    });
});
