import { render, screen } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import SubChapterItem from './SubChapterItem';

const test_uuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => test_uuid),
  };
});

describe('SubChapterItem Component', () => {
    const baseProps = {
        subChapter: { title: "title", id: 'chapter-id-1', contents : ["content 1", "content 2"] },
        subChapterIndex: 0,
        currChIndex: 0, 
        dispatch: jest.fn()
    };

  it('should render SubChapterItem components with correct keys', () => {
    // Invariant Violation: Could not find "store"
    render(<SubChapterItem {...baseProps} />);

    const contents = screen.getAllByTestId('SubChapterItem-test-tag');
    contents.forEach((content) => {
      expect(content).toHaveAttribute('key', `sch-content-chapter-id-1-${test_uuid}}`);
    });
  });
});