import { render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import DefaultFilter from './DefaultFilter';

describe('DefaultFilter', () => {
    const baseProps = {
        value: '',
        placeholder: 'Filter...',
        onInputChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('it renders with placeholder', () => {
        render(<DefaultFilter {...baseProps} />);

        expect(screen.getByPlaceholderText('Filter...')).toBeInTheDocument();
    });

    test('it renders with initial value', () => {
        render(<DefaultFilter {...baseProps} value="initial" />);

        expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
    });

    test('it calls onInputChange when user types', async () => {
        render(<DefaultFilter {...baseProps} />);

        const input = screen.getByPlaceholderText('Filter...');
        await userEvent.type(input, 'test');

        expect(baseProps.onInputChange).toHaveBeenCalled();
    });

    test('it does not render reverse button when onToggleReverse is not provided', () => {
        render(<DefaultFilter {...baseProps} />);

        expect(screen.queryByRole('button', { name: /sort/i })).not.toBeInTheDocument();
    });

    test('it renders reverse button when onToggleReverse is provided', () => {
        const onToggleReverse = jest.fn();
        render(<DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('it calls onToggleReverse when reverse button is clicked', async () => {
        const onToggleReverse = jest.fn();
        render(<DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} />);

        const reverseButton = screen.getByRole('button');
        await userEvent.click(reverseButton);

        expect(onToggleReverse).toHaveBeenCalled();
    });

    test('it shows correct tooltip for reverse button', async () => {
        const onToggleReverse = jest.fn();
        render(<DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} reversed={false} />);

        const reverseButton = screen.getByRole('button');
        await userEvent.hover(reverseButton);

        await waitFor(() => {
            expect(screen.getByText('Reverse')).toBeInTheDocument();
        });
    });

    test('it shows correct tooltip when reversed is true', async () => {
        const onToggleReverse = jest.fn();
        render(<DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} reversed />);

        const reverseButton = screen.getByRole('button');
        await userEvent.hover(reverseButton);

        await waitFor(() => {
            expect(screen.getByText('Undo Reverse')).toBeInTheDocument();
        });
    });

    test('it applies grey theme when grey prop is true', () => {
        const { container } = render(<DefaultFilter {...baseProps} grey />);

        const filterContainer = container.querySelector('.ct-filter.grey');
        expect(filterContainer).toBeInTheDocument();
    });

    test('it debounces onInputChange when debounce prop is true', async () => {
        jest.useFakeTimers();

        render(<DefaultFilter {...baseProps} debounce />);

        const input = screen.getByPlaceholderText('Filter...');
        await userEvent.type(input, 'test', { delay: null });

        // Should not be called immediately due to debounce
        expect(baseProps.onInputChange).not.toHaveBeenCalled();

        // Fast forward debounce time
        jest.advanceTimersByTime(500);

        expect(baseProps.onInputChange).toHaveBeenCalled();

        jest.useRealTimers();
    });

    test('it has accessible label for screen readers', () => {
        render(<DefaultFilter {...baseProps} />);

        // The label should be screen reader only but associated with input
        const input = screen.getByPlaceholderText('Filter...');
        expect(input).toHaveAccessibleName('Filter...');
    });

    describe('edge cases', () => {
        test('it handles empty string value', () => {
            render(<DefaultFilter {...baseProps} value="" />);

            const input = screen.getByPlaceholderText('Filter...');
            expect(input).toHaveValue('');
        });

        test('it handles special characters in value', () => {
            render(<DefaultFilter {...baseProps} value="<script>" />);

            const input = screen.getByPlaceholderText('Filter...');
            expect(input).toHaveValue('<script>');
        });

        test('it handles unicode characters', () => {
            render(<DefaultFilter {...baseProps} value="搜索 🔍" />);

            const input = screen.getByPlaceholderText('Filter...');
            expect(input).toHaveValue('搜索 🔍');
        });

        test('it updates internal state when typing', async () => {
            render(<DefaultFilter {...baseProps} />);

            const input = screen.getByPlaceholderText('Filter...');
            await userEvent.type(input, 'new value');

            expect(input).toHaveValue('new value');
        });

        test('it passes inputProps to input element', () => {
            render(
                <DefaultFilter
                    {...baseProps}
                    inputProps={{ 'data-testid': 'custom-input', maxLength: 10 }}
                />
            );

            const input = screen.getByTestId('custom-input');
            expect(input).toHaveAttribute('maxLength', '10');
        });

        test('it handles autoFocus false', () => {
            render(<DefaultFilter {...baseProps} autoFocus={false} />);

            const input = screen.getByPlaceholderText('Filter...');
            expect(document.activeElement).not.toBe(input);
        });

        test('it handles multiple rapid inputs without debounce', async () => {
            render(<DefaultFilter {...baseProps} debounce={false} />);

            const input = screen.getByPlaceholderText('Filter...');
            await userEvent.type(input, 'abc');

            // Without debounce, each keystroke triggers onChange
            expect(baseProps.onInputChange).toHaveBeenCalledTimes(3);
        });

        test('debounce batches multiple inputs', async () => {
            jest.useFakeTimers();

            render(<DefaultFilter {...baseProps} debounce />);

            const input = screen.getByPlaceholderText('Filter...');

            // Type multiple characters rapidly
            await userEvent.type(input, 'a', { delay: null });
            await userEvent.type(input, 'b', { delay: null });
            await userEvent.type(input, 'c', { delay: null });

            // Should not be called yet
            expect(baseProps.onInputChange).not.toHaveBeenCalled();

            // Advance time
            jest.advanceTimersByTime(500);

            // Should be called once (batched)
            expect(baseProps.onInputChange).toHaveBeenCalled();

            jest.useRealTimers();
        });

        test('it handles clearing input', async () => {
            render(<DefaultFilter {...baseProps} value="initial" />);

            const input = screen.getByPlaceholderText('Filter...');
            await userEvent.clear(input);

            expect(input).toHaveValue('');
            expect(baseProps.onInputChange).toHaveBeenCalled();
        });

        test('it handles reverse button multiple clicks', async () => {
            const onToggleReverse = jest.fn();
            render(<DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} />);

            const reverseButton = screen.getByRole('button');
            await userEvent.click(reverseButton);
            await userEvent.click(reverseButton);
            await userEvent.click(reverseButton);

            expect(onToggleReverse).toHaveBeenCalledTimes(3);
        });

        test('it applies reversed class to button when reversed', () => {
            const onToggleReverse = jest.fn();
            const { container } = render(
                <DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} reversed />
            );

            const reversedButton = container.querySelector('.reverse-btn.reversed');
            expect(reversedButton).toBeInTheDocument();
        });

        test('it does not apply reversed class when not reversed', () => {
            const onToggleReverse = jest.fn();
            const { container } = render(
                <DefaultFilter {...baseProps} onToggleReverse={onToggleReverse} reversed={false} />
            );

            const reversedButton = container.querySelector('.reverse-btn.reversed');
            expect(reversedButton).not.toBeInTheDocument();
        });

        test('it handles very long input', async () => {
            const longText = 'a'.repeat(500);
            render(<DefaultFilter {...baseProps} value={longText} />);

            const input = screen.getByPlaceholderText('Filter...');
            expect(input).toHaveValue(longText);
        });

        test('it handles different placeholder text', () => {
            render(<DefaultFilter {...baseProps} placeholder="Search users..." />);

            expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
        });

        test('input has unique id', () => {
            const { container } = render(<DefaultFilter {...baseProps} />);

            const input = container.querySelector('input');
            expect(input).toHaveAttribute('id');
            expect(input.id).toBeTruthy();
        });

        test('label is associated with input via htmlFor', () => {
            const { container } = render(<DefaultFilter {...baseProps} />);

            const input = container.querySelector('input');
            const label = container.querySelector('label');

            expect(label).toHaveAttribute('for', input.id);
        });
    });
});
