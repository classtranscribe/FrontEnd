import React from 'react';
import { render, screen } from '@testing-library/react';
import EPubCTList from './EPubCTList';

// Mock layout
jest.mock('layout', () => ({
  CTFragment: ({ children, id, role, className, ...props }) => (
    <div id={id} role={role} className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock EPubCTListItem
jest.mock('./EPubCTListItem', () => {
  return function EPubCTListItem(props) {
    return (
      <div data-testid="epub-list-item" data-item-id={props.id}>
        {props.title}
      </div>
    );
  };
});

describe('EPubCTList', () => {
  const mockItems = [
    { id: '1', title: 'EPub 1', description: 'Description 1' },
    { id: '2', title: 'EPub 2', description: 'Description 2' },
    { id: '3', title: 'EPub 3', description: 'Description 3' },
  ];

  it('renders without crashing', () => {
    render(<EPubCTList items={[]} />);
  });

  it('renders with empty items array', () => {
    const { container } = render(<EPubCTList items={[]} />);
    const listItems = container.querySelectorAll('[data-testid="epub-list-item"]');
    expect(listItems.length).toBe(0);
  });

  it('renders all items', () => {
    render(<EPubCTList items={mockItems} />);
    const listItems = screen.getAllByTestId('epub-list-item');
    expect(listItems.length).toBe(3);
  });

  it('passes item props to EPubCTListItem', () => {
    render(<EPubCTList items={mockItems} />);
    expect(screen.getByText('EPub 1')).toBeInTheDocument();
    expect(screen.getByText('EPub 2')).toBeInTheDocument();
    expect(screen.getByText('EPub 3')).toBeInTheDocument();
  });

  it('uses correct keys for list items', () => {
    render(<EPubCTList items={mockItems} />);
    expect(screen.getByText('EPub 1').closest('[data-item-id]')).toHaveAttribute('data-item-id', '1');
    expect(screen.getByText('EPub 2').closest('[data-item-id]')).toHaveAttribute('data-item-id', '2');
  });

  it('applies default role="list"', () => {
    const { container } = render(<EPubCTList items={mockItems} />);
    expect(container.firstChild).toHaveAttribute('role', 'list');
  });

  it('accepts custom role', () => {
    const { container } = render(<EPubCTList items={mockItems} role="navigation" />);
    expect(container.firstChild).toHaveAttribute('role', 'navigation');
  });

  it('applies id prop', () => {
    const { container } = render(<EPubCTList items={mockItems} id="my-epub-list" />);
    expect(container.firstChild).toHaveAttribute('id', 'my-epub-list');
  });

  it('applies className prop', () => {
    const { container } = render(<EPubCTList items={mockItems} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    const { container } = render(
      <EPubCTList items={mockItems} data-testid="custom-list" aria-label="EPub List" />
    );
    expect(container.firstChild).toHaveAttribute('data-testid', 'custom-list');
    expect(container.firstChild).toHaveAttribute('aria-label', 'EPub List');
  });

  it('renders with default empty items when items prop omitted', () => {
    const { container } = render(<EPubCTList />);
    const listItems = container.querySelectorAll('[data-testid="epub-list-item"]');
    expect(listItems.length).toBe(0);
  });
});
