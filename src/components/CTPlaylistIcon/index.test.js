import { render, screen } from '@testing-library/react';
import CTPlaylistIcon from './index';

// Mock the image assets
jest.mock('assets/images', () => ({
    theBoxLogo: 'box-logo.png',
    theKalturaLogo: 'kaltura-logo.png'
}));

describe('CTPlaylistIcon', () => {
    it('renders without crashing with default props', () => {
        render(<CTPlaylistIcon />);
    });

    describe('renders correct icon for each source type', () => {
        it('renders Echo360 icon (type 0)', () => {
            render(<CTPlaylistIcon type={0} />);
            const icon = document.querySelector('.ct-pl-icon');
            expect(icon).toBeInTheDocument();
        });

        it('renders YouTube icon (type 1)', () => {
            render(<CTPlaylistIcon type={1} />);
            const icon = document.querySelector('.ct-pl-icon');
            expect(icon).toBeInTheDocument();
        });

        it('renders File upload icon (type 2)', () => {
            render(<CTPlaylistIcon type={2} />);
            const icon = document.querySelector('.ct-pl-icon');
            expect(icon).toBeInTheDocument();
        });

        it('renders Kaltura image (type 3)', () => {
            render(<CTPlaylistIcon type={3} />);
            const img = screen.getByRole('img', { hidden: true });
            expect(img).toHaveAttribute('src', 'kaltura-logo.png');
            expect(img).toHaveAttribute('alt', 'Kaltura/Mediasapce');
        });

        it('renders Box image (type 4)', () => {
            render(<CTPlaylistIcon type={4} />);
            const img = screen.getByRole('img', { hidden: true });
            expect(img).toHaveAttribute('src', 'box-logo.png');
            expect(img).toHaveAttribute('alt', 'Box');
        });
    });

    describe('size variations', () => {
        it('applies small size class', () => {
            render(<CTPlaylistIcon size="small" />);
            const icon = document.querySelector('.ct-pl-icon.small');
            expect(icon).toBeInTheDocument();
        });

        it('applies normal size class by default', () => {
            render(<CTPlaylistIcon />);
            const icon = document.querySelector('.ct-pl-icon.normal');
            expect(icon).toBeInTheDocument();
        });

        it('applies large size class', () => {
            render(<CTPlaylistIcon size="large" />);
            const icon = document.querySelector('.ct-pl-icon.large');
            expect(icon).toBeInTheDocument();
        });

        it('applies big size class', () => {
            render(<CTPlaylistIcon size="big" />);
            const icon = document.querySelector('.ct-pl-icon.big');
            expect(icon).toBeInTheDocument();
        });
    });
});
