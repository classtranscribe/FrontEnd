import React from 'react';
import { render, screen } from '@testing-library/react';
import Info from './Info';

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

describe('Info', () => {
  it('renders without crashing', () => {
    render(<Info>Test content</Info>);
  });

  it('renders children', () => {
    render(<Info>Test children content</Info>);
    expect(screen.getByText('Test children content')).toBeInTheDocument();
  });

  it('applies ct-info-n-li and info classes', () => {
    const { container } = render(<Info>Content</Info>);
    const element = container.firstChild;
    expect(element.className).toContain('ct-info-n-li');
    expect(element.className).toContain('info');
  });

  it('applies custom className', () => {
    const { container } = render(<Info className="custom-class">Content</Info>);
    const element = container.firstChild;
    expect(element.className).toContain('custom-class');
  });

  it('passes id prop', () => {
    render(<Info id="test-info-id">Content</Info>);
    expect(screen.getByText('Content').id).toBe('test-info-id');
  });

  it('has data-scroll attribute', () => {
    const { container } = render(<Info>Content</Info>);
    const element = container.firstChild;
    expect(element).toHaveAttribute('data-scroll');
  });

  it('passes through additional props', () => {
    const { container } = render(
      <Info data-testid="info-component" aria-label="Information section">
        Content
      </Info>
    );
    const element = container.firstChild;
    expect(element).toHaveAttribute('data-testid', 'info-component');
    expect(element).toHaveAttribute('aria-label', 'Information section');
  });
});
