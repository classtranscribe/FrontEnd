import React from 'react';
import { render, screen } from '@testing-library/react';
import CircularProgress from './index';

describe('CircularProgress', () => {
    it('renders without crashing', () => {
        render(<CircularProgress value={50} />);
    });

    it('displays the percentage value', () => {
        render(<CircularProgress value={75} />);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('rounds the percentage value', () => {
        render(<CircularProgress value={33.7} />);
        expect(screen.getByText('34%')).toBeInTheDocument();
    });

    it('displays 0% for zero value', () => {
        render(<CircularProgress value={0} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('displays 100% for full value', () => {
        render(<CircularProgress value={100} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });
});
