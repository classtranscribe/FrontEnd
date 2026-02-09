import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ARRAY_INIT } from 'utils/constants';
import { Home } from './index';

// Mock utils
jest.mock('utils', () => ({
    env: {
        maintenanceWarningBanner: ''
    }
}));

// Mock layout components
jest.mock('layout', () => ({
    CTLayout: ({ children }) => <div data-testid="ct-layout">{children}</div>,
    CTLoadable: ({ loading, loadingElement, children }) => (
      <div data-testid="ct-loadable">
        {loading ? loadingElement : children}
      </div>
    ),
    altEl: (Component, condition, props) => condition ? <Component {...props} /> : null,
    makeEl: (Component, props) => <Component {...props} />
}));

// Add createProps static method
beforeAll(() => {
    const { CTLayout } = require('layout');
    CTLayout.createProps = jest.fn((props) => props);
});

// Mock sub-components
jest.mock('./components', () => ({
    Placeholder: () => <div data-testid="placeholder">Loading...</div>,
    SectionList: ({ sections }) => (
      <div data-testid="section-list">
        {sections.map((s, i) => <div key={i}>{s.title || 'Section'}</div>)}
      </div>
    ),
    CourseFilter: () => <div data-testid="course-filter">Filter</div>,
    MaintenanceMesg: ({ message }) => message ? <div data-testid="maintenance">{message}</div> : null
}));

// Create a mock store
const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            home: (state = {
                sections: ARRAY_INIT,
                hasDepartmentSections: false,
                ...preloadedState
            }) => state
        }
    });
};

describe('Home Screen', () => {
    it('renders without crashing', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Home />
          </Provider>
        );
    });

    it('displays CTLayout wrapper', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Home />
          </Provider>
        );
        expect(screen.getByTestId('ct-layout')).toBeInTheDocument();
    });

    it('shows loading placeholder when sections are not loaded', () => {
        const store = createTestStore({ sections: ARRAY_INIT });
        render(
          <Provider store={store}>
            <Home />
          </Provider>
        );
        expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    });

    it('shows section list when sections are loaded', () => {
        const store = createTestStore({
            sections: [{ title: 'Test Section' }],
            hasDepartmentSections: true
        });
        render(
          <Provider store={store}>
            <Home />
          </Provider>
        );
        expect(screen.getByTestId('section-list')).toBeInTheDocument();
    });

    it('shows course filter when loaded', () => {
        const store = createTestStore({
            sections: [],
            hasDepartmentSections: false
        });
        render(
          <Provider store={store}>
            <Home />
          </Provider>
        );
        expect(screen.getByTestId('course-filter')).toBeInTheDocument();
    });

    it('displays screen reader heading', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Home />
          </Provider>
        );
        expect(screen.getByRole('heading', { name: 'Course Browser' })).toBeInTheDocument();
    });
});
