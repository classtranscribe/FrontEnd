import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseCard from './Card';
import { parseCourse } from './parse-course';

// Mock layout
jest.mock('layout', () => ({
  CTFragment: ({ children, as: Component = 'div', to, ...props }) => {
    if (Component && Component !== 'div') {
      return <Component to={to} {...props}>{children}</Component>;
    }
    return <div {...props}>{children}</div>;
  },
  CTText: ({ children, bold, size, line, teal, celadon, muted, ...props }) => (
    <span
      data-bold={bold}
      data-size={size}
      data-line={line}
      data-teal={teal}
      data-celadon={celadon}
      data-muted={muted}
      {...props}
    >
      {children}
    </span>
  ),
}));

// Mock SCSS
jest.mock('./index.scss', () => ({}), { virtual: true });

describe('CourseCard', () => {
  const defaultProps = {
    id: 'course-1',
    number: 'CS 101',
    name: 'Introduction to Computer Science',
    term: 'Fall 2025',
    section: 'Section A',
    description: 'An introductory course covering fundamentals of computer science',
    href: '/course/123',
  };

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
  });

  it('displays course number', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('CS 101')).toBeInTheDocument();
  });

  it('displays course name', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Introduction to Computer Science')).toBeInTheDocument();
  });

  it('displays term and section', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Fall 2025 \| Section A/)).toBeInTheDocument();
  });

  it('displays description', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/An introductory course/)).toBeInTheDocument();
  });

  it('renders as Link with correct href', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/course/123');
  });

  it('applies ct-course-card class', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    expect(container.querySelector('.ct-course-card')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} className="custom-class" />
      </BrowserRouter>
    );
    const card = container.querySelector('.ct-course-card');
    expect(card.className).toContain('custom-class');
  });

  it('applies fluid class when fluid prop is true', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} fluid />
      </BrowserRouter>
    );
    const card = container.querySelector('.ct-course-card');
    expect(card.className).toContain('fluid');
  });

  it('applies row class when row prop is true', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} row />
      </BrowserRouter>
    );
    const card = container.querySelector('.ct-course-card');
    expect(card.className).toContain('row');
  });

  it('has role="listitem" when listitem prop is true', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} listitem />
      </BrowserRouter>
    );
    expect(container.querySelector('[role="listitem"]')).toBeInTheDocument();
  });

  it('does not have role when listitem prop is false', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} listitem={false} />
      </BrowserRouter>
    );
    const link = container.querySelector('a');
    expect(link).not.toHaveAttribute('role');
  });

  it('sets title attribute with course info', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('title', 'CS 101 | Introduction to Computer Science | Fall 2025 | Section A');
  });

  it('applies teal and bold to course number', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    const number = screen.getByText('CS 101');
    expect(number).toHaveAttribute('data-teal', 'true');
    expect(number).toHaveAttribute('data-bold', 'true');
  });

  it('applies celadon to term/section text', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    const termSection = screen.getByText(/Fall 2025 \| Section A/);
    expect(termSection).toHaveAttribute('data-celadon', 'true');
  });

  it('applies muted to description', () => {
    render(
      <BrowserRouter>
        <CourseCard {...defaultProps} />
      </BrowserRouter>
    );
    const description = screen.getByText(/An introductory course/);
    expect(description).toHaveAttribute('data-muted', 'true');
  });

  it('has parse static method', () => {
    expect(CourseCard.parse).toBe(parseCourse);
  });

  it('sets id attribute', () => {
    const { container } = render(
      <BrowserRouter>
        <CourseCard {...defaultProps} id="my-course" />
      </BrowserRouter>
    );
    expect(container.querySelector('#my-course')).toBeInTheDocument();
  });
});
