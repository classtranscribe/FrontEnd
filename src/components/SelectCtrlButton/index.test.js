import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectCtrlButton } from './index';

// Mock the layout components
jest.mock('layout', () => ({
    CTPopoverLabel: ({ children, label }) => (
      <div data-testid="popover" data-label={label}>{children}</div>
    )
}));

describe('SelectCtrlButton', () => {
    const baseProps = {
        selecting: false,
        selectAll: jest.fn(),
        removeAll: jest.fn(),
        isSelectedAll: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<SelectCtrlButton {...baseProps} />);
    });

    it('shows "Select All" label when nothing is selected', () => {
        render(<SelectCtrlButton {...baseProps} />);
        const popover = screen.getByTestId('popover');
        expect(popover).toHaveAttribute('data-label', 'Select All');
    });

    it('shows "Remove All" label when all are selected', () => {
        render(<SelectCtrlButton {...baseProps} isSelectedAll />);
        const popover = screen.getByTestId('popover');
        expect(popover).toHaveAttribute('data-label', 'Remove All');
    });

    it('calls selectAll when clicked and not all selected', async () => {
        render(<SelectCtrlButton {...baseProps} />);
        const button = screen.getByRole('button', { hidden: true });
        await userEvent.click(button);
        expect(baseProps.selectAll).toHaveBeenCalledTimes(1);
        expect(baseProps.removeAll).not.toHaveBeenCalled();
    });

    it('calls removeAll when clicked and all selected', async () => {
        render(<SelectCtrlButton {...baseProps} isSelectedAll />);
        const button = screen.getByRole('button', { hidden: true });
        await userEvent.click(button);
        expect(baseProps.removeAll).toHaveBeenCalledTimes(1);
        expect(baseProps.selectAll).not.toHaveBeenCalled();
    });
});
