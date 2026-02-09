import React from 'react';
import { render, screen } from '@testing-library/react';
import { Analytics } from './index';

// Mock utils
jest.mock('utils', () => ({
    api: {
        contentLoaded: jest.fn()
    },
    links: {
        title: jest.fn()
    }
}));

// Mock layout
jest.mock('layout', () => ({
    CTLayout: ({ children }) => <div data-testid="ct-layout">{children}</div>
}));

// Add createProps static method
beforeAll(() => {
    const { CTLayout } = require('layout');
    CTLayout.createProps = jest.fn((props) => props);
});

describe('Analytics Screen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<Analytics />);
    });

    it('displays CTLayout wrapper', () => {
        render(<Analytics />);
        expect(screen.getByTestId('ct-layout')).toBeInTheDocument();
    });

    it('calls api.contentLoaded on mount', () => {
        const { api } = require('utils');
        render(<Analytics />);
        expect(api.contentLoaded).toHaveBeenCalled();
    });

    it('sets page title to Analytics', () => {
        const { links } = require('utils');
        render(<Analytics />);
        expect(links.title).toHaveBeenCalledWith('Analytics');
    });

    it('creates layout with correct heading props', () => {
        const { CTLayout } = require('layout');
        render(<Analytics />);

        expect(CTLayout.createProps).toHaveBeenCalledWith(
            expect.objectContaining({
                headingProps: expect.objectContaining({
                    heading: 'Personal Analytics',
                    icon: 'bar_chart'
                })
            })
        );
    });
});
