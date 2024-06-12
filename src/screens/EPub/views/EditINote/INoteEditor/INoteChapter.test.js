import { render, screen } from '@testing-library/react';
// TypeError: Cannot read properties of undefined (reading '__buildHTMLFromChapter')
// (src/screens/EPub/controllers/file-builders/EPubParser.js:6:46)
import { v4 as uuidv4 } from 'uuid';
import INoteChapter from './INoteChapter';

const test_uuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => test_uuid),
  };
});

describe('INoteChapter Component', () => {
    const baseProps = {
        chapter: {id: "chapter-id-1", title: "Sample title"},
        chIdx: 0,
        images: [],
        dispatch: jest.fn()
    };

  it('should render INoteChapter components with correct keys', () => {
    render(<INoteChapter {...baseProps} />);

    const contents = screen.getAllByTestId('content');
    contents.forEach((content) => {
      expect(content).toHaveAttribute('key', `ch-content-chapter-id-1-${test_uuid}}`);
    });
  });
});