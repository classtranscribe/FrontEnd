import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock lodash to pass through
jest.mock('lodash', () => ({
    ...jest.requireActual('lodash'),
    map: jest.requireActual('lodash').map
}));

// Mock layout
jest.mock('layout', () => ({
    CTModal: ({ open, title, children, action, onClose }) => open ? (
        <div data-testid="modal" role="dialog">
            <h2>{title}</h2>
            <button data-testid="close-btn" onClick={onClose}>Close</button>
            {children}
            <div data-testid="actions">{action}</div>
        </div>
    ) : null,
    makeEl: (Component, props) => <Component {...props} />
}));

// Mock semantic-ui Tab with Tab.Pane
jest.mock('semantic-ui-react', () => {
    const MockTabPane = ({ children }) => <div data-testid="tab-pane">{children}</div>;
    const MockTab = ({ panes }) => (
        <div data-testid="tabs">
            {panes && panes.map((pane, i) => (
                <div key={i} data-testid={`tab-${i}`}>
                    <span data-testid={`tab-menu-${i}`}>{pane.menuItem}</span>
                    <div data-testid={`tab-content-${i}`}>{pane.render()}</div>
                </div>
            ))}
        </div>
    );
    MockTab.Pane = MockTabPane;
    return { Tab: MockTab };
});

// Mock sub-components
jest.mock('./ImagesTab', () => ({ images, imgUrl, setImgUrl }) => (
    <div data-testid="images-tab">
        {images.map((img, i) => (
            <button key={i} onClick={() => setImgUrl(img)} data-testid={`image-${i}`}>
                {img}
            </button>
        ))}
        <span data-testid="selected-image">{imgUrl}</span>
    </div>
));

jest.mock('./UploadTab', () => ({ imgUrl, setImgUrl }) => (
    <div data-testid="upload-tab">
        <input
            data-testid="upload-input"
            onChange={(e) => setImgUrl(e.target.value)}
        />
        <span data-testid="upload-selected">{imgUrl}</span>
    </div>
));

jest.mock('./ImagePickerModalActions', () => ({ canSave, onSave, onClose }) => (
    <div data-testid="modal-actions">
        <button
            data-testid="save-btn"
            onClick={() => onSave()}
            disabled={!canSave}
        >
            Save
        </button>
        <button data-testid="cancel-btn" onClick={onClose}>Cancel</button>
    </div>
));

// Import after mocks
import ImagePickerModal from './index';

describe('ImagePickerModal', () => {
    const baseProps = {
        show: true,
        onSave: jest.fn(),
        onClose: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<ImagePickerModal {...baseProps} />);
    });

    it('does not render when show is false', () => {
        render(<ImagePickerModal {...baseProps} show={false} />);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders modal when show is true', () => {
        render(<ImagePickerModal {...baseProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('displays "Choose an Image" title', () => {
        render(<ImagePickerModal {...baseProps} />);
        expect(screen.getByText('Choose an Image')).toBeInTheDocument();
    });

    it('renders upload tab when tabs includes "upload"', () => {
        render(<ImagePickerModal {...baseProps} tabs={['upload']} />);
        expect(screen.getByText('Upload')).toBeInTheDocument();
        expect(screen.getByTestId('upload-tab')).toBeInTheDocument();
    });

    it('renders image gallery tab with custom images', () => {
        const tabs = [{
            name: 'Gallery',
            images: ['image1.jpg', 'image2.jpg'],
            description: 'Select an image'
        }];
        render(<ImagePickerModal {...baseProps} tabs={tabs} />);

        expect(screen.getByText('Gallery')).toBeInTheDocument();
        expect(screen.getByTestId('images-tab')).toBeInTheDocument();
        expect(screen.getByTestId('image-0')).toBeInTheDocument();
        expect(screen.getByTestId('image-1')).toBeInTheDocument();
    });

    it('uses defaultImage as initial image URL', () => {
        const tabs = [{
            name: 'Gallery',
            images: ['image1.jpg'],
            description: 'test'
        }];
        render(
            <ImagePickerModal
                {...baseProps}
                tabs={tabs}
                defaultImage="default.jpg"
            />
        );

        expect(screen.getByTestId('selected-image')).toHaveTextContent('default.jpg');
    });

    it('calls onSave with selected image when save is clicked', async () => {
        const tabs = [{
            name: 'Gallery',
            images: ['image1.jpg', 'image2.jpg'],
            description: 'test'
        }];
        render(
            <ImagePickerModal
                {...baseProps}
                tabs={tabs}
                defaultImage="image1.jpg"
            />
        );

        const saveButton = screen.getByTestId('save-btn');
        await userEvent.click(saveButton);

        expect(baseProps.onSave).toHaveBeenCalledWith('image1.jpg');
    });

    it('calls onClose when cancel is clicked', async () => {
        render(<ImagePickerModal {...baseProps} tabs={['upload']} />);

        const cancelButton = screen.getByTestId('cancel-btn');
        await userEvent.click(cancelButton);

        expect(baseProps.onClose).toHaveBeenCalled();
    });

    it('updates selected image when clicking an image in gallery', async () => {
        const tabs = [{
            name: 'Gallery',
            images: ['image1.jpg', 'image2.jpg'],
            description: 'test'
        }];
        render(<ImagePickerModal {...baseProps} tabs={tabs} />);

        const image2Button = screen.getByTestId('image-1');
        await userEvent.click(image2Button);

        expect(screen.getByTestId('selected-image')).toHaveTextContent('image2.jpg');
    });

    it('disables save button when no image is selected', () => {
        render(<ImagePickerModal {...baseProps} tabs={['upload']} />);

        const saveButton = screen.getByTestId('save-btn');
        expect(saveButton).toBeDisabled();
    });

    it('enables save button when image is selected', () => {
        const tabs = [{
            name: 'Gallery',
            images: ['image1.jpg'],
            description: 'test'
        }];
        render(
            <ImagePickerModal
                {...baseProps}
                tabs={tabs}
                defaultImage="image1.jpg"
            />
        );

        const saveButton = screen.getByTestId('save-btn');
        expect(saveButton).not.toBeDisabled();
    });
});
