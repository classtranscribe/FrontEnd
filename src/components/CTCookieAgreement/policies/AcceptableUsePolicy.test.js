import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AcceptableUsePolicy from './AcceptableUsePolicy';

describe('AcceptableUsePolicy', () => {
  it('renders without crashing', () => {
    render(<AcceptableUsePolicy />);
  });

  it('displays the policy title', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText('Acceptable Use Policy')).toBeInTheDocument();
  });

  it('displays the mission statement', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/mission is to provide universal/i)).toBeInTheDocument();
  });

  it('displays prohibited content section header', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/You are prohibited from using our Services to share/i)).toBeInTheDocument();
  });

  it('includes illegal content prohibition', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Contains illegal content or promotes illegal activities/i)).toBeInTheDocument();
  });

  it('includes harassment prohibition', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Harrasses others/i)).toBeInTheDocument();
  });

  it('includes intellectual property violation prohibition', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Violates intellectual property, privacy, or other rights/i)).toBeInTheDocument();
  });

  it('includes spam prohibition', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Spam others/i)).toBeInTheDocument();
  });

  it('displays prohibited actions section header', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/You also aren.?t allowed to:/i)).toBeInTheDocument();
  });

  it('includes security testing prohibition', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Break or circumvent our authentication or security measures/i)).toBeInTheDocument();
  });

  it('includes reverse engineering prohibition', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Try to reverse engineer any portion of our Services/i)).toBeInTheDocument();
  });

  it('displays effective date', () => {
    render(<AcceptableUsePolicy />);
    expect(screen.getByText(/Effective as of July 28, 2020/i)).toBeInTheDocument();
  });

  it('renders as a div container', () => {
    const { container } = render(<AcceptableUsePolicy />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('includes unordered lists for policy items', () => {
    const { container } = render(<AcceptableUsePolicy />);
    const lists = container.querySelectorAll('ul');
    expect(lists.length).toBeGreaterThan(0);
  });
});
