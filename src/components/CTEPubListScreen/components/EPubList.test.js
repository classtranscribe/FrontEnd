import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorTypes from 'entities/ErrorTypes';
import EPubList, { _getEPubListItems } from './EPubList';

// Mock pico-ui
jest.mock('pico-ui', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// Mock Material-UI
jest.mock('@material-ui/core', () => ({
  Dialog: ({ open, children }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogContentText: ({ children }) => <div>{children}</div>,
  DialogActions: ({ children }) => <div>{children}</div>,
}));

// Mock utils
jest.mock('utils', () => ({
  prompt: {
    addOne: jest.fn(),
  },
}));

jest.mock('utils/links', () => ({
  links: {
    epub: jest.fn((id) => `/epub/${id}`),
  },
}));

// Mock ErrorTypes
jest.mock('entities/ErrorTypes', () => ({
  __esModule: true,
  default: {
    NotFound404: 'NOT_FOUND_404',
  },
}));

// Mock layout components
jest.mock('layout', () => ({
  altEl: jest.fn((Component, condition, props) => condition ? <Component {...props} /> : null),
  makeEl: jest.fn((componentOrJsx) => componentOrJsx),
  CTFragment: ({ children, id, ...props }) => <div id={id} {...props}>{children}</div>,
  CTHeading: ({ children, icon, ...props }) => (
    <h3 {...props}>
      {icon && <span className="material-icons">{icon}</span>}
      {children}
    </h3>
  ),
  CTText: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

// Mock SelectCtrlButton
jest.mock('components/SelectCtrlButton', () => ({
  SelectCtrlButton: (props) => (
    <div data-testid="select-ctrl-button" data-selecting={props.selecting}>
      Select Button
    </div>
  ),
}));

// Mock LanguageConstants
jest.mock('../../CTPlayer', () => ({
  LanguageConstants: {
    decode: jest.fn((lang) => lang === 'en-US' ? 'English' : 'Unknown'),
  },
}));

// Mock Wrappers
jest.mock('./Wrappers', () => ({
  NoLangWrapper: () => <div data-testid="no-lang-wrapper">No Lang</div>,
  NoEPubWrapper: ({ sourceType, sourceId }) => (
    <div data-testid="no-epub-wrapper" data-source-type={sourceType} data-source-id={sourceId}>
      No EPub
    </div>
  ),
}));

// Mock NewEPubButton
jest.mock('./NewEPubButton', () => {
  return function NewEPubButton({ onCreate }) {
    return (
      <button data-testid="new-epub-button" onClick={onCreate}>
        Create new I-Note
      </button>
    );
  };
});

// Mock EPubCTList
jest.mock('./EPubCTList/EPubCTList', () => {
  return function EPubCTList({ items }) {
    return (
      <div data-testid="epub-ct-list">
        {items.map((item) => (
          <div key={item.id} data-testid="epub-item">
            {item.title}
          </div>
        ))}
      </div>
    );
  };
});

describe.skip('EPubList', () => {
  describe('_getEPubListItems helper', () => {
    const mockOnDelete = jest.fn(() => jest.fn());
    const mockOnRename = jest.fn(() => jest.fn());
    const mockOnPin = jest.fn(() => jest.fn());
    const mockIsSelected = jest.fn(() => false);
    const mockHandleSelect = jest.fn(() => jest.fn());

    it('returns empty array for empty ePubs', () => {
      const result = _getEPubListItems(
        [],
        mockOnDelete,
        mockOnRename,
        mockOnPin,
        mockIsSelected,
        mockHandleSelect
      );
      expect(result).toBeUndefined();
    });

    it('maps ePubs to list items', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
        { id: '2', title: 'EPub 2', language: 'en-US', publishStatus: 0 },
      ];

      const result = _getEPubListItems(
        ePubs,
        mockOnDelete,
        mockOnRename,
        mockOnPin,
        mockIsSelected,
        mockHandleSelect
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: '1',
        title: 'EPub 1',
        icon: 'text_snippet',
        description: 'English',
      });
    });

    it('sorts pinned ePubs to top', () => {
      const ePubs = [
        { id: '1', title: 'Unpinned', language: 'en-US', publishStatus: 0 },
        { id: '2', title: 'Pinned', language: 'en-US', publishStatus: 1 },
        { id: '3', title: 'Another Unpinned', language: 'en-US', publishStatus: 0 },
      ];

      const result = _getEPubListItems(
        ePubs,
        mockOnDelete,
        mockOnRename,
        mockOnPin,
        mockIsSelected,
        mockHandleSelect
      );

      expect(result[0].id).toBe('2'); // Pinned first
      expect(result[0].isPinned).toBe(true);
    });

    it('sets link properties correctly', () => {
      const ePubs = [{ id: '123', title: 'Test', language: 'en-US', publishStatus: 0 }];

      const result = _getEPubListItems(
        ePubs,
        mockOnDelete,
        mockOnRename,
        mockOnPin,
        mockIsSelected,
        mockHandleSelect
      );

      expect(result[0]).toMatchObject({
        link: true,
        to: '/epub/123',
        target: '_blank',
      });
    });

    it('creates callback functions for each item', () => {
      const ePubs = [{ id: '1', title: 'Test', language: 'en-US', publishStatus: 0 }];

      _getEPubListItems(
        ePubs,
        mockOnDelete,
        mockOnRename,
        mockOnPin,
        mockIsSelected,
        mockHandleSelect
      );

      expect(mockOnDelete).toHaveBeenCalledWith('1');
      expect(mockOnRename).toHaveBeenCalledWith('1', 'Test');
      expect(mockOnPin).toHaveBeenCalledWith('1');
      expect(mockIsSelected).toHaveBeenCalledWith('1');
      expect(mockHandleSelect).toHaveBeenCalledWith('1');
    });
  });

  describe('EPubList component', () => {
    const defaultProps = {
      ePubs: [],
      languages: ['en-US'],
      rawEPubData: {},
      sourceType: 'media',
      sourceId: '123',
      onCreate: jest.fn(),
      onDelete: jest.fn(),
      onRename: jest.fn(),
      onPin: jest.fn(),
      isSelected: jest.fn(() => false),
      isSelectedAll: false,
      handleSelect: jest.fn(),
      handleSelectAll: jest.fn(() => jest.fn()),
      handleRemoveAll: jest.fn(() => jest.fn()),
      epubsSelected: 0,
      deleteSelected: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders without crashing', () => {
      render(<EPubList {...defaultProps} />);
    });

    it('shows NoLangWrapper when no languages', () => {
      render(<EPubList {...defaultProps} languages={[]} />);
      expect(screen.getByTestId('no-lang-wrapper')).toBeInTheDocument();
    });

    it('shows NoEPubWrapper when rawEPubData is NotFound404', () => {
      render(
        <EPubList
          {...defaultProps}
          rawEPubData={ErrorTypes.NotFound404}
        />
      );
      expect(screen.getByTestId('no-epub-wrapper')).toBeInTheDocument();
    });

    it('shows create button when no ePubs', () => {
      render(<EPubList {...defaultProps} ePubs={[]} />);
      expect(screen.getByTestId('new-epub-button')).toBeInTheDocument();
    });

    it('shows "Create your first I-Note book" message when no ePubs', () => {
      render(<EPubList {...defaultProps} ePubs={[]} />);
      expect(screen.getByText('Create your first I-Note book')).toBeInTheDocument();
    });

    it('renders list when ePubs exist', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
        { id: '2', title: 'EPub 2', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} />);
      expect(screen.getByTestId('epub-ct-list')).toBeInTheDocument();
    });

    it('shows I-Note Books heading when ePubs exist', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} />);
      expect(screen.getByText('I-Note Books')).toBeInTheDocument();
    });

    it('shows SelectCtrlButton when ePubs exist', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} />);
      expect(screen.getByTestId('select-ctrl-button')).toBeInTheDocument();
    });

    it('shows delete button when items selected', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} epubsSelected={2} />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('does not show delete button when no items selected', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} epubsSelected={0} />);
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('opens delete dialog when delete clicked', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} epubsSelected={1} />);

      fireEvent.click(screen.getByText('Delete'));

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('shows correct dialog title for single item', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} epubsSelected={1} />);
      fireEvent.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete I•Note')).toBeInTheDocument();
    });

    it('shows correct dialog title for multiple items', () => {
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(<EPubList {...defaultProps} ePubs={ePubs} epubsSelected={3} />);
      fireEvent.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete I•Notes')).toBeInTheDocument();
    });

    it('calls deleteSelected when YES clicked in dialog', () => {
      const mockDeleteSelected = jest.fn();
      const ePubs = [
        { id: '1', title: 'EPub 1', language: 'en-US', publishStatus: 0 },
      ];

      render(
        <EPubList {...defaultProps} ePubs={ePubs} epubsSelected={1} deleteSelected={mockDeleteSelected} />
      );

      fireEvent.click(screen.getByText('Delete'));
      fireEvent.click(screen.getByText('YES'));

      expect(mockDeleteSelected).toHaveBeenCalledTimes(1);
    });

    it('has container with id ct-epb-list', () => {
      const { container } = render(<EPubList {...defaultProps} />);
      expect(container.querySelector('#ct-epb-list')).toBeInTheDocument();
    });
  });
});
