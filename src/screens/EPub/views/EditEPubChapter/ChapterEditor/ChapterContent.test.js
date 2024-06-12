import { render, screen } from '@testing-library/react';
// TypeError: Cannot read properties of undefined (reading '__buildHTMLFromChapter')
// (src/screens/EPub/controllers/file-builders/EPubParser.js:6:46)
import { v4 as uuidv4 } from 'uuid';
import ChapterContent from './ChapterContent';

const test_uuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => test_uuid),
  };
});


describe('ChapterContent Component', () => {
    const mockDispatch = jest.fn();
    const mockOnInsert = jest.fn();
    const mockOnRemove = jest.fn();
    const mockOnTextChange = jest.fn();
    const mockOnImageChange = jest.fn();
  
    const props = {
      id: 'ch-content-12345-uuid-0',
      key: 'ch-content-12345-uuid-12345',
      content: 'Sample text content',
      index: 0,
      dispatch: mockDispatch,
      onRemove: mockOnRemove,
      onTextChange: mockOnTextChange,
      onImageChange: mockOnImageChange,
      onInsert: mockOnInsert,
    };

    it('should render text content correctly', () => {
        render(<ChapterContent {...props} />);
        
        expect(screen.getByText('Sample text content')).toBeVisible();
      });
  
    it('should render Tags components with correct keys', () => {
      render(<ChapterContent {...props} />);
      
      const tags = screen.getAllByTestId('ChapterContent-test-tag');
      tags.forEach((tag) => {
        expect(tag).toHaveAttribute('key', `tag-${props.key}-${test_uuid}`);
      });
    });
  });
