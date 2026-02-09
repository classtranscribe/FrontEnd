import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Search } from './index';
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
jest.mock('./components/SearchInput', () => () => (
    <div data-testid="search-input">
        <input placeholder="Search..." />
    </div>
));

jest.mock('./components/SearchResult', () => () => (
    <div data-testid="search-result">Search Results</div>
));

// Create a mock store
const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            search: (state = {
                offerings: ARRAY_INIT,
                searchValue: '',
                searchResult: {},
                result: [],
                ...preloadedState
            }) => state
        }
    });
};

describe('Search Screen', () => {
    it('renders without crashing', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <Search />
            </Provider>
        );
    });

    it('displays CTLayout wrapper', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <Search />
            </Provider>
        );
        expect(screen.getByTestId('ct-layout')).toBeInTheDocument();
    });

    it('displays search input component', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <Search />
            </Provider>
        );
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('displays search result component', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <Search />
            </Provider>
        );
        expect(screen.getByTestId('search-result')).toBeInTheDocument();
    });

    it('has search input field', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <Search />
            </Provider>
        );
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
});
