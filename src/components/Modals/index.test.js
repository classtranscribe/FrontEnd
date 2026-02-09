import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { CTModal } from './index';

// Mock pico-ui Button
jest.mock('pico-ui', () => {
    const Button = ({ onClick, icon, text, children, ...props }) => (
        <button onClick={onClick} {...props}>
            {icon && <span className="icon">{icon}</span>}
            {text || children}
        </button>
    );
    Button.Group = ({ children }) => <div className="button-group">{children}</div>;
    return { Button };
});

describe('CTModal', () => {
    const baseProps = {
        show: true,
        title: 'Test Modal',
        onClose: jest.fn(),
        onSave: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders without crashing', () => {
        render(<CTModal {...baseProps} />);
    });

    it('renders nothing when show is false', () => {
        const { container } = render(<CTModal {...baseProps} show={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders modal when show is true', () => {
        render(<CTModal {...baseProps} />);
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('displays the title', () => {
        render(<CTModal {...baseProps} title="My Dialog" />);
        expect(screen.getByRole('heading', { name: 'My Dialog' })).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(
            <CTModal {...baseProps}>
                <p>Modal content here</p>
            </CTModal>
        );
        expect(screen.getByText('Modal content here')).toBeInTheDocument();
    });

    it('shows default Save and Cancel buttons when no custom actions provided', () => {
        render(<CTModal {...baseProps} />);
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('uses custom button text for save and cancel', () => {
        render(
            <CTModal
                {...baseProps}
                saveBtnText="Confirm"
                cancelBtnText="Dismiss"
            />
        );
        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    it('renders custom actions when provided', () => {
        render(
            <CTModal {...baseProps} actions={<button>Custom Action</button>} />
        );
        expect(screen.getByText('Custom Action')).toBeInTheDocument();
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('calls onSave when save button is clicked', () => {
        render(<CTModal {...baseProps} />);

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        expect(baseProps.onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close icon button is clicked after animation', () => {
        render(<CTModal {...baseProps} />);

        // Find close button (has icon="close")
        const closeButtons = screen.getAllByRole('button');
        const closeIconButton = closeButtons.find(btn => btn.querySelector('.icon'));

        fireEvent.click(closeIconButton);

        // Advance timers for animation delay
        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked after animation', () => {
        render(<CTModal {...baseProps} />);

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('applies large class when large prop is true', () => {
        render(<CTModal {...baseProps} large />);
        const modalBox = document.getElementById('ct-mdl-box');
        expect(modalBox).toHaveClass('large');
    });

    it('applies middle class when middle prop is true', () => {
        render(<CTModal {...baseProps} middle />);
        const modalBox = document.getElementById('ct-mdl-box');
        expect(modalBox).toHaveClass('middle');
    });

    it('closes on backdrop click when closeOnBlur is true', () => {
        render(<CTModal {...baseProps} closeOnBlur />);

        const wrapper = document.querySelector('.ct-mdl-wrapper');
        fireEvent.click(wrapper);

        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on backdrop click when closeOnBlur is false', () => {
        render(<CTModal {...baseProps} closeOnBlur={false} />);

        const wrapper = document.querySelector('.ct-mdl-wrapper');
        fireEvent.click(wrapper);

        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(baseProps.onClose).not.toHaveBeenCalled();
    });
});
