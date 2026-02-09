import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Import after mocks
import Image from './index';

// Mock URL.createObjectURL
const mockObjectUrl = 'blob:http://localhost/test-image';
global.URL.createObjectURL = jest.fn(() => mockObjectUrl);

// Mock EPubParser
const mockLoadImageBuffer = jest.fn();
jest.mock('screens/EPub/controllers/file-builders/EPubParser', () => ({
    loadImageBuffer: (...args) => mockLoadImageBuffer(...args)
}));

describe('Image', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLoadImageBuffer.mockResolvedValue(new ArrayBuffer(8));
    });

    it('renders without crashing', async () => {
        render(<Image src="data:image/png;base64,test" alt="test" />);
        await waitFor(() => {
            expect(screen.getByRole('img')).toBeInTheDocument();
        });
    });

    it('uses data URL directly when src starts with data:', async () => {
        const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';

        render(<Image src={dataUrl} alt="test image" />);

        await waitFor(() => {
            const img = screen.getByRole('img');
            expect(img).toHaveAttribute('src', dataUrl);
        });

        expect(mockLoadImageBuffer).not.toHaveBeenCalled();
    });

    it('calls EPubParser.loadImageBuffer for non-data URLs', async () => {
        render(<Image src="http://example.com/image.jpg" alt="test" />);

        await waitFor(() => {
            expect(mockLoadImageBuffer).toHaveBeenCalledWith('http://example.com/image.jpg');
        });
    });

    it('handles src as module with default export', async () => {
        const srcModule = { default: 'module-image.png' };

        render(<Image src={srcModule} alt="test" />);

        await waitFor(() => {
            expect(mockLoadImageBuffer).toHaveBeenCalledWith('module-image.png');
        });
    });

    it('passes additional props to img element', async () => {
        const dataUrl = 'data:image/png;base64,test';

        render(
          <Image
            src={dataUrl}
            alt="test image"
            className="custom-class"
            width={100}
            height={100}
          />
        );

        await waitFor(() => {
            const img = screen.getByRole('img');
            expect(img).toHaveClass('custom-class');
            expect(img).toHaveAttribute('width', '100');
            expect(img).toHaveAttribute('height', '100');
        });
    });

    it('creates blob URL after loading image buffer', async () => {
        const imageBuffer = new ArrayBuffer(8);
        mockLoadImageBuffer.mockResolvedValue(imageBuffer);

        render(<Image src="http://example.com/image.jpg" alt="test" />);

        await waitFor(() => {
            expect(mockLoadImageBuffer).toHaveBeenCalled();
        });

        // Verify URL.createObjectURL was called with a Blob
        await waitFor(() => {
            expect(global.URL.createObjectURL).toHaveBeenCalled();
        });
    });
});
