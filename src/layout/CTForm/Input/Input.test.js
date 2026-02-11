import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import * as KeyCode from 'keycode-js';
import Input from './index';

describe('CTForm Input', () => {
    const baseProps = {
        id: 'test-input',
        label: 'Test Label',
        onChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('it renders with label', () => {
        render(<Input {...baseProps} />);

        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    test('it renders with placeholder', () => {
        render(<Input {...baseProps} placeholder="Enter text here" />);

        expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
    });

    test('it renders with default value', () => {
        render(<Input {...baseProps} defaultValue="Default text" />);

        expect(screen.getByDisplayValue('Default text')).toBeInTheDocument();
    });

    test('it renders with controlled value', () => {
        render(<Input {...baseProps} value="Controlled value" />);

        expect(screen.getByDisplayValue('Controlled value')).toBeInTheDocument();
    });

    test('it calls onChange when user types', async () => {
        render(<Input {...baseProps} />);

        const input = screen.getByLabelText('Test Label');
        await userEvent.type(input, 'Hello');

        expect(baseProps.onChange).toHaveBeenCalled();
    });

    test('it calls onReturn when Enter key is pressed', () => {
        const onReturn = jest.fn();
        render(<Input {...baseProps} onReturn={onReturn} />);

        const input = screen.getByLabelText('Test Label');
        fireEvent.keyDown(input, { keyCode: KeyCode.KEY_RETURN });

        expect(onReturn).toHaveBeenCalled();
    });

    test('it does not call onReturn for other keys', () => {
        const onReturn = jest.fn();
        render(<Input {...baseProps} onReturn={onReturn} />);

        const input = screen.getByLabelText('Test Label');
        fireEvent.keyDown(input, { keyCode: KeyCode.KEY_SPACE });

        expect(onReturn).not.toHaveBeenCalled();
    });

    test('it renders as disabled when disabled prop is true', () => {
        render(<Input {...baseProps} disabled />);

        const input = screen.getByLabelText('Test Label');
        expect(input).toBeDisabled();
    });

    test('it renders as required when required prop is true', () => {
        render(<Input {...baseProps} required />);

        const input = screen.getByLabelText(/Test Label/);
        expect(input).toBeRequired();
    });

    test('it renders help text', () => {
        render(<Input {...baseProps} helpText="This is help text" />);

        expect(screen.getByText('This is help text')).toBeInTheDocument();
    });

    test('it shows error state', () => {
        const { container } = render(<Input {...baseProps} error />);

        const errorElement = container.querySelector('.Mui-error');
        expect(errorElement).toBeInTheDocument();
    });

    test('it renders as textarea when textarea prop is true', () => {
        render(<Input {...baseProps} textarea />);

        const textarea = screen.getByLabelText('Test Label');
        expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });

    test('it renders with underlined variant', () => {
        const { container } = render(<Input {...baseProps} underlined />);

        const standardInput = container.querySelector('.MuiInput-underline');
        expect(standardInput).toBeInTheDocument();
    });

    describe('edge cases', () => {
        test('it handles empty string value', () => {
            render(<Input {...baseProps} value="" />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveValue('');
        });

        test('it handles special characters in value', () => {
            render(<Input {...baseProps} value="<script>alert('xss')</script>" />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveValue("<script>alert('xss')</script>");
        });

        test('it handles unicode characters', () => {
            render(<Input {...baseProps} value="你好世界 🎉" />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveValue('你好世界 🎉');
        });

        test('it handles very long text', () => {
            const longText = 'a'.repeat(1000);
            render(<Input {...baseProps} value={longText} />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveValue(longText);
        });

        test('it does not call onReturn when onReturn is not provided', () => {
            render(<Input {...baseProps} />);

            const input = screen.getByLabelText('Test Label');
            // Should not throw error
            fireEvent.keyDown(input, { keyCode: KeyCode.KEY_RETURN });
        });

        test('it applies correct id to input element', () => {
            render(<Input {...baseProps} id="custom-input-id" />);

            const input = document.getElementById('custom-input-id');
            expect(input).toBeInTheDocument();
        });

        test('it passes additional props to TextField', () => {
            render(<Input {...baseProps} autoFocus data-testid="custom-input" />);

            const input = screen.getByTestId('custom-input');
            expect(input).toBeInTheDocument();
        });

        test('it handles multiple onChange calls', async () => {
            const onChange = jest.fn();
            render(<Input {...baseProps} onChange={onChange} />);

            const input = screen.getByLabelText('Test Label');
            await userEvent.type(input, 'abc');

            expect(onChange).toHaveBeenCalledTimes(3);
        });

        test('it handles rapid Enter key presses', () => {
            const onReturn = jest.fn();
            render(<Input {...baseProps} onReturn={onReturn} />);

            const input = screen.getByLabelText('Test Label');
            fireEvent.keyDown(input, { keyCode: KeyCode.KEY_RETURN });
            fireEvent.keyDown(input, { keyCode: KeyCode.KEY_RETURN });
            fireEvent.keyDown(input, { keyCode: KeyCode.KEY_RETURN });

            expect(onReturn).toHaveBeenCalledTimes(3);
        });

        test('it handles Tab key without calling onReturn', () => {
            const onReturn = jest.fn();
            render(<Input {...baseProps} onReturn={onReturn} />);

            const input = screen.getByLabelText('Test Label');
            fireEvent.keyDown(input, { keyCode: KeyCode.KEY_TAB });

            expect(onReturn).not.toHaveBeenCalled();
        });

        test('it handles Escape key without calling onReturn', () => {
            const onReturn = jest.fn();
            render(<Input {...baseProps} onReturn={onReturn} />);

            const input = screen.getByLabelText('Test Label');
            fireEvent.keyDown(input, { keyCode: KeyCode.KEY_ESCAPE });

            expect(onReturn).not.toHaveBeenCalled();
        });

        test('textarea handles multiline content', () => {
            const multilineText = 'Line 1\nLine 2\nLine 3';
            render(<Input {...baseProps} textarea value={multilineText} />);

            const textarea = screen.getByLabelText('Test Label');
            expect(textarea).toHaveValue(multilineText);
        });

        test('it renders with both error and helpText', () => {
            render(<Input {...baseProps} error helpText="Error message" />);

            expect(screen.getByText('Error message')).toBeInTheDocument();
        });

        test('it renders with combined disabled and error states', () => {
            const { container } = render(<Input {...baseProps} disabled error />);

            const input = screen.getByLabelText('Test Label');
            expect(input).toBeDisabled();
            expect(container.querySelector('.Mui-error')).toBeInTheDocument();
        });
    });
});
