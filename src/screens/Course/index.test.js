import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// unused import { ARRAY_INIT } from 'utils/constants';
// unused import ErrorTypes from 'entities/ErrorTypes';
import { Course } from './index';

// Mock utils
jest.mock('utils', () => ({
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
    ARRAY_INIT: []
}));

// Mock entities
jest.mock('entities/ErrorTypes', () => ({
    NotFound404: 'NOT_FOUND_404',
    isError: (val) => val === 'NOT_FOUND_404'
}));

// Mock layout
jest.mock('layout', () => ({
    CTLayout: ({ children }) => <div data-testid="ct-layout">{children}</div>,
    CTErrorWrapper: ({ header, code }) => (
      <div data-testid="error-wrapper">
        <span>Error {code}: {header}</span>
      </div>
    )
}));

// Add createProps static method
beforeAll(() => {
    const { CTLayout } = require('layout');
    CTLayout.createProps = jest.fn((fn) => {
        if (typeof fn === 'function') {
            return fn({ getCoursePageSidebarItems: jest.fn(() => []) });
        }
        return fn;
    });
});

// Mock components
jest.mock('components', () => ({
    InfoAndListLayout: ({ children, loading, error, errorElement }) => {
        if (error) return errorElement;
        if (loading) return <div data-testid="loading">Loading...</div>;
        return <div data-testid="info-list-layout">{children}</div>;
    }
}));

jest.mock('./components', () => ({
    CourseInfo: () => <div data-testid="course-info">Course Info</div>,
    Playlists: () => <div data-testid="playlists">Playlists</div>
}));

// Create mock store
const createTestStore = (preloadedState = {}) => {
    const defaultState = {
        offering: null,
        playlists: [],
        playlist: null,
        starredOfferings: {},
        role: 'student',
        isInstMode: false,
        ...preloadedState
    };

    return configureStore({
        reducer: {
            course: (state = defaultState) => state
        }
    });
};

describe('Course Screen', () => {
    it('renders without crashing', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
    });

    it('displays CTLayout wrapper', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
        expect(screen.getByTestId('ct-layout')).toBeInTheDocument();
    });

    it('shows loading when offering is null', () => {
        const store = createTestStore({ offering: null });
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('shows error when offering is NotFound404', () => {
        const store = createTestStore({ offering: 'NOT_FOUND_404' });
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
        expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
        expect(screen.getByText(/Couldn't find the course/)).toBeInTheDocument();
    });

    it('displays course info when loaded', () => {
        const store = createTestStore({
            offering: { id: 'test-id', fullNumber: 'CS 101' }
        });
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
        expect(screen.getByTestId('course-info')).toBeInTheDocument();
    });

    it('displays playlists when loaded', () => {
        const store = createTestStore({
            offering: { id: 'test-id', fullNumber: 'CS 101' }
        });
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
        expect(screen.getByTestId('playlists')).toBeInTheDocument();
    });

    it('displays info and list layout when offering is loaded', () => {
        const store = createTestStore({
            offering: { id: 'test-id', fullNumber: 'CS 101' }
        });
        render(
          <Provider store={store}>
            <Course />
          </Provider>
        );
        expect(screen.getByTestId('info-list-layout')).toBeInTheDocument();
    });
});
