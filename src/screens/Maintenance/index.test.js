import React from 'react';
import { render, screen } from '@testing-library/react';
import { Maintenance } from './index';

// Mock utils
jest.mock('utils', () => ({
    api: {
        contentLoaded: jest.fn()
    },
    env: {
        classTranscribeDownMessage: 'System is under maintenance'
    }
}));

describe('Maintenance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<Maintenance />);
    });

    it('displays ClassTranscribe heading', () => {
        render(<Maintenance />);
        expect(screen.getByRole('heading', { name: 'ClassTranscribe' })).toBeInTheDocument();
    });

    it('displays maintenance message from env', () => {
        render(<Maintenance />);
        expect(screen.getByText('System is under maintenance')).toBeInTheDocument();
    });

    it('calls api.contentLoaded on mount', () => {
        const { api } = require('utils');
        render(<Maintenance />);
        expect(api.contentLoaded).toHaveBeenCalled();
    });
});
