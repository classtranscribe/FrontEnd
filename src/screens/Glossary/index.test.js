import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Glossary } from './index';

// Mock layout
jest.mock('layout', () => ({
    CTLayout: ({ children }) => <div data-testid="ct-layout">{children}</div>
}));

// Add createProps static method
beforeAll(() => {
    const { CTLayout } = require('layout');
    CTLayout.createProps = jest.fn((props) => props);
});

// Mock cthttp
jest.mock('utils/cthttp/request.js', () => ({
    cthttp: {
        get: jest.fn().mockResolvedValue({ data: [] })
    }
}));

// Mock sub-components
jest.mock('./components/GlossaryTable/index.js', () => ({ words }) => (
  <div data-testid="glossary-table">
    Glossary Table ({words.length} words)
  </div>
));

jest.mock('./components/GlossaryBar/index.js', () => ({ setSelectCourse, setSelectOffering }) => (
  <div data-testid="glossary-bar">
    <button onClick={() => setSelectCourse('course-1')}>Select Course</button>
    <button onClick={() => setSelectOffering('offering-1')}>Select Offering</button>
  </div>
));

// Create mock store
const createTestStore = () => {
    return configureStore({
        reducer: {
            glossarypage: (state = {}) => state
        }
    });
};

describe('Glossary Screen', () => {
    it('renders without crashing', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Glossary />
          </Provider>
        );
    });

    it('displays CTLayout wrapper', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Glossary />
          </Provider>
        );
        expect(screen.getByTestId('ct-layout')).toBeInTheDocument();
    });

    it('displays Glossary heading', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Glossary />
          </Provider>
        );
        expect(screen.getByRole('heading', { name: 'Glossary' })).toBeInTheDocument();
    });

    it('displays GlossaryBar component', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Glossary />
          </Provider>
        );
        expect(screen.getByTestId('glossary-bar')).toBeInTheDocument();
    });

    it('displays GlossaryTable component', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Glossary />
          </Provider>
        );
        expect(screen.getByTestId('glossary-table')).toBeInTheDocument();
    });

    it('shows empty table initially', () => {
        const store = createTestStore();
        render(
          <Provider store={store}>
            <Glossary />
          </Provider>
        );
        expect(screen.getByText('Glossary Table (0 words)')).toBeInTheDocument();
    });
});
