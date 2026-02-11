import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UploadBase from './UploadBase';

jest.mock('react-dropzone', () => ({
    useDropzone: ({ onDrop }) => ({
        getRootProps: () => ({
            onClick: jest.fn(),
            onDragEnter: jest.fn(),
            onDragOver: jest.fn(),
            onDragLeave: jest.fn(),
            onDrop: (e) => {
                if (onDrop && e.dataTransfer && e.dataTransfer.files) {
                    onDrop(Array.from(e.dataTransfer.files));
                }
            },
        }),
        getInputProps: () => ({}),
        isDragActive: false,
    }),
}));

describe('UploadBase', () => {
    const baseProps = {
        id: 'test-upload',
        children: (isDragActive) => (
            <span>{isDragActive ? 'Drop here' : 'Browse files'}</span>
        ),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('it renders without crashing', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        expect(container.querySelector('.ct-upload')).toBeTruthy();
    });

    test('it renders children as a function', () => {
        const { getByText } = render(<UploadBase {...baseProps} />);
        expect(getByText('Browse files')).toBeTruthy();
    });

    test('it has the base class', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const uploadDiv = container.querySelector('.ct-upload');
        expect(uploadDiv.classList.contains('base')).toBe(true);
    });

    test('it adds fluid class when fluid prop is true', () => {
        const { container } = render(<UploadBase {...baseProps} fluid />);
        const uploadDiv = container.querySelector('.ct-upload');
        expect(uploadDiv.classList.contains('fluid')).toBe(true);
    });

    test('it does not add fluid class when fluid prop is false', () => {
        const { container } = render(<UploadBase {...baseProps} fluid={false} />);
        const uploadDiv = container.querySelector('.ct-upload');
        expect(uploadDiv.classList.contains('fluid')).toBe(false);
    });

    test('it has aria-label for accessibility', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const uploadDiv = container.querySelector('.ct-upload');
        expect(uploadDiv.getAttribute('aria-label')).toBe('browse files');
    });

    test('it renders a file input element', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeTruthy();
    });

    test('it sets accept prop on file input', () => {
        const { container } = render(
            <UploadBase {...baseProps} accept=".pdf,.doc" />
        );
        const input = container.querySelector('input[type="file"]');
        expect(input.getAttribute('accept')).toBe('.pdf,.doc');
    });

    test('it sets id prop on file input', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const input = container.querySelector('input[type="file"]');
        expect(input.getAttribute('id')).toBe('test-upload');
    });

    test('it sets multiple attribute on file input', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const input = container.querySelector('input[type="file"]');
        expect(input.hasAttribute('multiple')).toBe(true);
    });

    test('it disables file input when disabled prop is true', () => {
        const { container } = render(<UploadBase {...baseProps} disabled />);
        const input = container.querySelector('input[type="file"]');
        expect(input.disabled).toBe(true);
    });

    test('it does not disable file input by default', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const input = container.querySelector('input[type="file"]');
        expect(input.disabled).toBe(false);
    });

    test('it calls onFileChange when file is selected via input', () => {
        const onFileChange = jest.fn();
        const { container } = render(
            <UploadBase {...baseProps} onFileChange={onFileChange} />
        );
        const input = container.querySelector('input[type="file"]');
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        fireEvent.change(input, { target: { files: [file] } });
        expect(onFileChange).toHaveBeenCalledWith([file]);
    });

    test('it does not throw when onFileChange is not provided', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const input = container.querySelector('input[type="file"]');
        const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
        expect(() => {
            fireEvent.change(input, { target: { files: [file] } });
        }).not.toThrow();
    });

    test('it calls onFileChange with multiple files', () => {
        const onFileChange = jest.fn();
        const { container } = render(
            <UploadBase {...baseProps} onFileChange={onFileChange} />
        );
        const input = container.querySelector('input[type="file"]');
        const file1 = new File(['a'], 'a.pdf', { type: 'application/pdf' });
        const file2 = new File(['b'], 'b.pdf', { type: 'application/pdf' });
        fireEvent.change(input, { target: { files: [file1, file2] } });
        expect(onFileChange).toHaveBeenCalledWith([file1, file2]);
    });

    test('it renders with different children content', () => {
        const props = {
            ...baseProps,
            children: () => <div data-testid="custom-child">Custom Upload UI</div>,
        };
        const { getByTestId } = render(<UploadBase {...props} />);
        expect(getByTestId('custom-child')).toBeTruthy();
    });

    test('it renders without accept prop', () => {
        const { container } = render(<UploadBase {...baseProps} />);
        const input = container.querySelector('input[type="file"]');
        expect(input.getAttribute('accept')).toBeNull();
    });

    test('it accepts image file types', () => {
        const { container } = render(
            <UploadBase {...baseProps} accept="image/*" />
        );
        const input = container.querySelector('input[type="file"]');
        expect(input.getAttribute('accept')).toBe('image/*');
    });

    test('it calls onFileChange with empty file list', () => {
        const onFileChange = jest.fn();
        const { container } = render(
            <UploadBase {...baseProps} onFileChange={onFileChange} />
        );
        const input = container.querySelector('input[type="file"]');
        fireEvent.change(input, { target: { files: [] } });
        expect(onFileChange).toHaveBeenCalledWith([]);
    });
});
