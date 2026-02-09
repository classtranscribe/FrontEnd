import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookiePolicy from './CookiePolicy';

describe('CookiePolicy', () => {
  it('renders without crashing', () => {
    render(<CookiePolicy />);
  });

  it('displays the policy title', () => {
    render(<CookiePolicy />);
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
  });

  it('displays tracking technologies notice', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/this site utilizes tracking technologies/i)).toBeInTheDocument();
  });

  it('explains what cookies are', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/Cookies are small pieces of data stored by a web browser/i)).toBeInTheDocument();
  });

  it('explains the purpose of cookies', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/to allow us to know what types of information users are interested in/i)).toBeInTheDocument();
  });

  it('mentions browser settings for cookies', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/You can set your browser not to accept cookies/i)).toBeInTheDocument();
  });

  it('explains how collected information is used', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/We may combine the information we collect through cookies/i)).toBeInTheDocument();
  });

  it('displays effective date', () => {
    render(<CookiePolicy />);
    expect(screen.getByText(/Effective as of July 28, 2020/i)).toBeInTheDocument();
  });

  it('renders as a div container', () => {
    const { container } = render(<CookiePolicy />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('contains multiple paragraphs', () => {
    const { container } = render(<CookiePolicy />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(3);
  });

  it('includes heading for effective date', () => {
    const { container } = render(<CookiePolicy />);
    const heading = container.querySelector('h4');
    expect(heading).toHaveTextContent('Effective as of July 28, 2020');
  });
});
