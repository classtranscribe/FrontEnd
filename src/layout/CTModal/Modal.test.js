import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Modal from './Modal';

jest.mock('layout', () => ({
    CTFragment: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe('CTModal', () => {
    const baseProps = {
        open: true,
        onClose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('it renders when open is true', () => {
        render(<Modal {...baseProps}>Modal Content</Modal>);

        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('it does not render content when open is false', () => {
        render(<Modal {...baseProps} open={false}>Modal Content</Modal>);

        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    test('it renders with title', () => {
        render(<Modal {...baseProps} title="Test Title">Content</Modal>);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('it renders with custom heading', () => {
        render(
          <Modal {...baseProps} heading={<div>Custom Heading</div>}>
            Content
          </Modal>
        );

        expect(screen.getByText('Custom Heading')).toBeInTheDocument();
    });

    test('it renders action buttons', () => {
        render(
          <Modal
            {...baseProps}
            action={<button>Save</button>}
          >
            Content
          </Modal>
        );

        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    test('it renders close button when withCloseButton is true', () => {
        render(
          <Modal {...baseProps} withCloseButton>
            Content
          </Modal>
        );

        expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
    });

    test('it calls onClose when close button is clicked', async () => {
        render(
          <Modal {...baseProps} withCloseButton>
            Content
          </Modal>
        );

        const closeButton = screen.getByRole('button', { name: 'close' });
        await userEvent.click(closeButton);

        expect(baseProps.onClose).toHaveBeenCalled();
    });

    test('it renders children directly in container mode', () => {
        render(
          <Modal {...baseProps} container>
            <div data-testid="custom-container">Custom Container Content</div>
          </Modal>
        );

        expect(screen.getByTestId('custom-container')).toBeInTheDocument();
    });

    test('it renders Modal.Text component', () => {
        render(
          <Modal {...baseProps}>
            <Modal.Text>Dialog description text</Modal.Text>
          </Modal>
        );

        expect(screen.getByText('Dialog description text')).toBeInTheDocument();
    });

    describe('edge cases', () => {
        test('it renders with both title and heading', () => {
            render(
              <Modal
                {...baseProps}
                title="Modal Title"
                heading={<span>Custom Heading</span>}
              >
                Content
              </Modal>
            );

            expect(screen.getByText('Modal Title')).toBeInTheDocument();
            expect(screen.getByText('Custom Heading')).toBeInTheDocument();
        });

        test('it renders with multiple action buttons', () => {
            render(
              <Modal
                {...baseProps}
                action={
                  <>
                    <button>Cancel</button>
                    <button>Save</button>
                  </>
                    }
              >
                Content
              </Modal>
            );

            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        });

        test('it renders without title when title is not provided', () => {
            render(<Modal {...baseProps}>Content only</Modal>);

            expect(screen.getByText('Content only')).toBeInTheDocument();
            expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        });

        test('it renders with complex children', () => {
            render(
              <Modal {...baseProps}>
                <div data-testid="nested-div">
                  <p>Paragraph 1</p>
                  <p>Paragraph 2</p>
                  <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                  </ul>
                </div>
              </Modal>
            );

            expect(screen.getByTestId('nested-div')).toBeInTheDocument();
            expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        test('container mode does not render title or action', () => {
            render(
              <Modal
                {...baseProps}
                container
                title="Should Not Appear"
                action={<button>Should Not Appear</button>}
              >
                <div>Container Content</div>
              </Modal>
            );

            expect(screen.getByText('Container Content')).toBeInTheDocument();
            expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument();
        });

        test('it handles empty children', () => {
            render(<Modal {...baseProps}>{null}</Modal>);

            // Should not crash
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        test('it handles string children', () => {
            render(<Modal {...baseProps}>Simple string content</Modal>);

            expect(screen.getByText('Simple string content')).toBeInTheDocument();
        });

        test('it handles number children', () => {
            render(<Modal {...baseProps}>{12345}</Modal>);

            expect(screen.getByText('12345')).toBeInTheDocument();
        });

        test('close button has correct aria-label', () => {
            render(
              <Modal {...baseProps} withCloseButton>
                Content
              </Modal>
            );

            const closeButton = screen.getByRole('button', { name: 'close' });
            expect(closeButton).toHaveAttribute('aria-label', 'close');
        });

        test('it does not render close button when withCloseButton is false', () => {
            render(
              <Modal {...baseProps} withCloseButton={false}>
                Content
              </Modal>
            );

            expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();
        });

        test('it renders with different sizes', () => {
            const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

            sizes.forEach(size => {
                const { unmount } = render(
                  <Modal {...baseProps} size={size}>
                    Content for {size}
                  </Modal>
                );

                expect(screen.getByText(`Content for ${size}`)).toBeInTheDocument();
                unmount();
            });
        });

        test('it renders action with click handler', async () => {
            const handleSave = jest.fn();

            render(
              <Modal
                {...baseProps}
                action={<button onClick={handleSave}>Save</button>}
              >
                Content
              </Modal>
            );

            const saveButton = screen.getByRole('button', { name: 'Save' });
            await userEvent.click(saveButton);

            expect(handleSave).toHaveBeenCalled();
        });
    });
});
