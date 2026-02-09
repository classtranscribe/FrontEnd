import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFound404 } from './index';

// Mock utils
jest.mock('utils', () => ({
    api: {
        contentLoaded: jest.fn()
    },
    links: {
        title: jest.fn(),
        home: jest.fn(() => '/')
    }
}));

// Mock layout
jest.mock('layout', () => ({
    CTErrorWrapper: ({ show, goHomeButton, navbar }) => (
        <div data-testid="error-wrapper">
            {navbar && <div data-testid="navbar">Navbar</div>}
            {show && <div data-testid="error-content">404 Error</div>}
            {goHomeButton && <button data-testid="go-home">Go Home</button>}
        </div>
    )
}));

describe('NotFound404', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<NotFound404 />);
    });

    it('displays error wrapper', () => {
        render(<NotFound404 />);
        expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
    });

    it('shows navbar', () => {
        render(<NotFound404 />);
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('shows go home button', () => {
        render(<NotFound404 />);
        expect(screen.getByTestId('go-home')).toBeInTheDocument();
    });

    it('calls api.contentLoaded on mount', () => {
        const { api } = require('utils');
        render(<NotFound404 />);
        expect(api.contentLoaded).toHaveBeenCalledWith(100);
    });

    it('sets page title to 404', () => {
        const { links } = require('utils');
        render(<NotFound404 />);
        expect(links.title).toHaveBeenCalledWith('404');
    });
});
