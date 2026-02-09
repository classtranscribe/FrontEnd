import React from 'react';
import { render, screen } from '@testing-library/react';
import List from './List';

// Mock CTFragment
jest.mock('layout', () => ({
  CTFragment: ({ children, id, className, ...props }) => (
    <div id={id} className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock CSS import
jest.mock('./index.scss', () => ({}), { virtual: true });

describe('List', () => {
  it('renders without crashing', () => {
    render(<List>Test content</List>);
  });

  it('renders children', () => {
    render(<List>Test list content</List>);
    expect(screen.getByText('Test list content')).toBeInTheDocument();
  });

  it('applies ct-info-n-li and list classes to outer container', () => {
    const { container } = render(<List>Content</List>);
    const outerElement = container.firstChild;
    expect(outerElement.className).toContain('ct-info-n-li');
    expect(outerElement.className).toContain('list');
  });

  it('has scroll-view class on inner container', () => {
    const { container } = render(<List>Content</List>);
    const outerElement = container.firstChild;
    const innerElement = outerElement.firstChild;
    expect(innerElement.className).toContain('ct-info-n-li');
    expect(innerElement.className).toContain('scroll-view');
  });

  it('applies custom className to outer container', () => {
    const { container } = render(<List className="custom-list-class">Content</List>);
    const outerElement = container.firstChild;
    expect(outerElement.className).toContain('custom-list-class');
  });

  it('passes id prop to outer container', () => {
    const { container } = render(<List id="test-list-id">Content</List>);
    const outerElement = container.firstChild;
    expect(outerElement.id).toBe('test-list-id');
  });

  it('has data-scroll attribute on inner container', () => {
    const { container } = render(<List>Content</List>);
    const outerElement = container.firstChild;
    const innerElement = outerElement.firstChild;
    expect(innerElement).toHaveAttribute('data-scroll');
  });

  it('passes through additional props to inner container', () => {
    const { container } = render(
      <List data-testid="list-component" aria-label="List section">
        Content
      </List>
    );
    const outerElement = container.firstChild;
    const innerElement = outerElement.firstChild;
    expect(innerElement).toHaveAttribute('data-testid', 'list-component');
    expect(innerElement).toHaveAttribute('aria-label', 'List section');
  });

  it('creates nested CTFragment structure', () => {
    const { container } = render(<List>Content</List>);
    // Should have outer CTFragment and inner CTFragment
    expect(container.firstChild.children.length).toBeGreaterThan(0);
  });
});
