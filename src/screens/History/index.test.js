import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { History } from './index';
import { ARRAY_INIT } from 'utils/constants';

// Mock layout components
jest.mock('layout', () => ({
    CTLayout: ({ children }) => <div data-testid="ct-layout">{children}</div>
}));

// Add createProps static method
beforeAll(() => {
    const { CTLayout } = require('layout');
    CTLayout.createProps = jest.fn((props) => props);
});

// Mock sub-components
jest.mock('./components/WatchHistories', () => () => (
    <div data-testid="watch-histories">
        <h3>Your Watch History</h3>
    </div>
));

// Create a mock store
const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            historypage: (state = {
                watchHistories: ARRAY_INIT,
                ...preloadedState
            }) => state
        }
    });
};

describe('History Screen', () => {
    it('renders without crashing', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <History />
            </Provider>
        );
    });

    it('displays CTLayout wrapper', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <History />
            </Provider>
        );
        expect(screen.getByTestId('ct-layout')).toBeInTheDocument();
    });

    it('displays watch histories component', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <History />
            </Provider>
        );
        expect(screen.getByTestId('watch-histories')).toBeInTheDocument();
    });

    it('shows watch history heading', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <History />
            </Provider>
        );
        expect(screen.getByRole('heading', { name: 'Your Watch History' })).toBeInTheDocument();
    });
});
