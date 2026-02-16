import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Select from './index';

describe('CTForm Select', () => {
    const baseProps = {
        id: 'test-select',
        label: 'Test Label',
        value: '',
        onChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('it renders with label', () => {
        const { container } = render(<Select {...baseProps} />);

        const label = container.querySelector('label');
        expect(label).toHaveTextContent('Test Label');
    });

    test('it renders with no items message when options are empty', async () => {
        render(<Select {...baseProps} options={[]} />);

        // Open the dropdown - MUI Select uses role="button"
        const selectButton = screen.getByRole('button');
        await userEvent.click(selectButton);

        expect(screen.getByText('No items')).toBeInTheDocument();
    });

    test('it renders with custom no items message', async () => {
        render(<Select {...baseProps} options={[]} noItemsHolder="Nothing here" />);

        const selectButton = screen.getByRole('button');
        await userEvent.click(selectButton);

        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    test('it renders options correctly', async () => {
        const options = [
            { value: 'opt1', text: 'Option 1' },
            { value: 'opt2', text: 'Option 2' },
            { value: 'opt3', text: 'Option 3' },
        ];

        render(<Select {...baseProps} options={options} />);

        const selectButton = screen.getByRole('button');
        await userEvent.click(selectButton);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    test('it renders options with descriptions', async () => {
        const options = [
            { value: 'opt1', text: 'Option 1', description: 'First option' },
            { value: 'opt2', text: 'Option 2', description: 'Second option' },
        ];

        render(<Select {...baseProps} options={options} />);

        const selectButton = screen.getByRole('button');
        await userEvent.click(selectButton);

        expect(screen.getByText('First option')).toBeInTheDocument();
        expect(screen.getByText('Second option')).toBeInTheDocument();
    });

    test('it calls onChange when an option is selected', async () => {
        const options = [
            { value: 'opt1', text: 'Option 1' },
            { value: 'opt2', text: 'Option 2' },
        ];

        render(<Select {...baseProps} options={options} />);

        const selectButton = screen.getByRole('button');
        await userEvent.click(selectButton);

        const option = screen.getByText('Option 1');
        await userEvent.click(option);

        expect(baseProps.onChange).toHaveBeenCalled();
    });

    test('it renders as disabled when disabled prop is true', () => {
        render(<Select {...baseProps} disabled />);

        const selectButton = screen.getByRole('button');
        expect(selectButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('it renders as required when required prop is true', () => {
        render(<Select {...baseProps} required />);

        // MUI adds an asterisk to required fields
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('it renders help text', () => {
        render(<Select {...baseProps} helpText="Please select an option" />);

        expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    test('it shows error state', () => {
        const { container } = render(<Select {...baseProps} error />);

        const formControl = container.querySelector('.Mui-error');
        expect(formControl).toBeInTheDocument();
    });

    describe('edge cases', () => {
        test('it handles options with numeric values', async () => {
            const options = [
                { value: 1, text: 'One' },
                { value: 2, text: 'Two' },
                { value: 3, text: 'Three' },
            ];

            render(<Select {...baseProps} options={options} />);

            const selectButton = screen.getByRole('button');
            await userEvent.click(selectButton);

            expect(screen.getByText('One')).toBeInTheDocument();
            expect(screen.getByText('Two')).toBeInTheDocument();
        });

        test('it displays selected value', () => {
            const options = [
                { value: 'opt1', text: 'Option 1' },
                { value: 'opt2', text: 'Option 2' },
            ];

            render(<Select {...baseProps} value="opt1" options={options} />);

            expect(screen.getByText('Option 1')).toBeInTheDocument();
        });

        test('it renders with underlined variant', () => {
            const { container } = render(<Select {...baseProps} underlined />);

            const standardInput = container.querySelector('.MuiInput-underline');
            expect(standardInput).toBeInTheDocument();
        });

        test('it handles multiple select mode', async () => {
            const options = [
                { value: 'opt1', text: 'Option 1' },
                { value: 'opt2', text: 'Option 2' },
                { value: 'opt3', text: 'Option 3' },
            ];

            render(<Select {...baseProps} multiple value={['opt1', 'opt2']} options={options} />);

            // Multiple select displays comma-separated values
            expect(screen.getByText('Option 1, Option 2')).toBeInTheDocument();
        });

        test('it renders with placeholder', async () => {
            render(<Select {...baseProps} placeholder="Select an option" />);

            const selectButton = screen.getByRole('button');
            expect(selectButton).toBeInTheDocument();
        });

        test('it handles empty string value', () => {
            const options = [
                { value: '', text: 'None' },
                { value: 'opt1', text: 'Option 1' },
            ];

            render(<Select {...baseProps} value="" options={options} />);

            // Should not crash with empty string value
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        test('it handles special characters in option text', async () => {
            const options = [
                { value: 'special', text: 'Option <with> "special" & chars' },
            ];

            render(<Select {...baseProps} options={options} />);

            const selectButton = screen.getByRole('button');
            await userEvent.click(selectButton);

            expect(screen.getByText('Option <with> "special" & chars')).toBeInTheDocument();
        });

        test('it handles long option text', async () => {
            const longText = 'This is a very long option text that might overflow the select component';
            const options = [
                { value: 'long', text: longText },
            ];

            render(<Select {...baseProps} options={options} />);

            const selectButton = screen.getByRole('button');
            await userEvent.click(selectButton);

            expect(screen.getByText(longText)).toBeInTheDocument();
        });

        test('it applies correct id to select element', () => {
            render(<Select {...baseProps} id="custom-select-id" />);

            const select = document.getElementById('custom-select-id');
            expect(select).toBeInTheDocument();
        });
    });
});
