import { render, screen } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import ChapterInfo from './ChapterInfo';

const test_uuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => test_uuid),
  };
});

describe('ChapterInfo Component', () => {
    const baseProps = {
        chapter: { id: 'chapter-id-1', title: 'Sample Chapter', contents: ["content 1", "content 2"], condition: "condition"},
        currChIndex: 0,
        dispatch: jest.fn()
    };

  it('should render ChapterContent components with correct keys', () => {
    // Invariant Violation: Could not find "store"
    render(<ChapterInfo {...baseProps} />);

    const contents = getAllByTestId('content');
    contents.forEach((content) => {
      expect(content).toHaveAttribute('key', `ch-content-chapter-id-1-${test_uuid}`);
    });
  });
});