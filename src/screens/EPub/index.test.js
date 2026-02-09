import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as KeyCode from 'keycode-js';
import { EPub } from './index';
import { ARRAY_INIT } from 'utils/constants';

// Mock layout
jest.mock('layout', () => ({
    CTFragment: ({ children, loading, id, onKeyDown, tabIndex, as: Component = 'div' }) => (
        <Component
            data-testid="ct-fragment"
            data-loading={loading ? 'true' : 'false'}
            id={id}
            onKeyDown={onKeyDown}
            tabIndex={tabIndex}
        >
            {!loading && children}
        </Component>
    ),
    altEl: (Component, condition, props) => condition ? <Component {...props} /> : null,
    makeEl: (Component, props) => <Component {...props} />
}));

// Mock controllers
jest.mock('./controllers', () => ({
    epub: {
        const: {
            EpbReadOnly: 'v-read-only',
            EditINote: 'v-edit-inote'
        },
        id: {
            EPubMainID: 'ct-epb-main'
        }
    }
}));

// Mock components
jest.mock('./components', () => ({
    EPubHeader: () => <div data-testid="epub-header">EPub Header</div>,
    PlayerModal: () => <div data-testid="player-modal">Player Modal</div>,
    ShortcutModal: () => <div data-testid="shortcut-modal">Shortcut Modal</div>,
    EPubFileInfoModal: () => <div data-testid="file-info-modal">File Info Modal</div>,
    ImagePickerModal: () => <div data-testid="image-picker-modal">Image Picker Modal</div>
}));

// Mock views
jest.mock('./views', () => ({
    ViewAndDownload: () => <div data-testid="view-download">View and Download</div>,
    EditINote: () => <div data-testid="edit-inote">Edit INote</div>
}));

// Create mock store
const createTestStore = (preloadedState = {}) => {
    const defaultState = {
        view: 'v-edit-inote',
        chapters: [],
        epub: { id: 'test-id', title: 'Test EPub' },
        ...preloadedState
    };

    return configureStore({
        reducer: {
            epub: (state = defaultState, action) => {
                switch (action.type) {
                    case 'epub/setView':
                        return { ...state, view: action.payload };
                    case 'epub/toggleNav':
                        return { ...state, showNav: !state.showNav };
                    case 'epub/toggleShortcuts':
                        return { ...state, showShortcuts: !state.showShortcuts };
                    default:
                        return state;
                }
            }
        }
    });
};

describe('EPub Screen', () => {
    it('renders without crashing', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
    });

    it('shows loading state when chapters are ARRAY_INIT', () => {
        const store = createTestStore({ chapters: ARRAY_INIT });
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        const fragment = screen.getByTestId('ct-fragment');
        expect(fragment).toHaveAttribute('data-loading', 'true');
    });

    it('shows loading state when epub is null', () => {
        const store = createTestStore({ epub: null });
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        const fragment = screen.getByTestId('ct-fragment');
        expect(fragment).toHaveAttribute('data-loading', 'true');
    });

    it('shows content when loaded', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        // Get the main fragment by ID
        const mainFragment = document.getElementById('ct-epb-main');
        expect(mainFragment).toHaveAttribute('data-loading', 'false');
    });

    it('displays EPub header when loaded', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        expect(screen.getByTestId('epub-header')).toBeInTheDocument();
    });

    it('displays EditINote view when view is EditINote', () => {
        const store = createTestStore({ view: 'v-edit-inote' });
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        expect(screen.getByTestId('edit-inote')).toBeInTheDocument();
    });

    it('displays ViewAndDownload view when view is ReadOnly', () => {
        const store = createTestStore({ view: 'v-read-only' });
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        expect(screen.getByTestId('view-download')).toBeInTheDocument();
    });

    it('displays modals', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        expect(screen.getByTestId('image-picker-modal')).toBeInTheDocument();
        expect(screen.getByTestId('player-modal')).toBeInTheDocument();
        expect(screen.getByTestId('shortcut-modal')).toBeInTheDocument();
        expect(screen.getByTestId('file-info-modal')).toBeInTheDocument();
    });

    it('has correct main element ID', () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <EPub />
            </Provider>
        );
        expect(document.getElementById('ct-epb-main')).toBeInTheDocument();
    });

    describe('keyboard shortcuts', () => {
        it('dispatches setView to ReadOnly on Shift+1', () => {
            const store = createTestStore();
            render(
                <Provider store={store}>
                    <EPub />
                </Provider>
            );

            const mainEl = document.getElementById('ct-epb-main');
            fireEvent.keyDown(mainEl, { keyCode: KeyCode.KEY_1, shiftKey: true });

            expect(store.getState().epub.view).toBe('v-read-only');
        });

        it('dispatches setView to EditINote on Shift+2', () => {
            const store = createTestStore({ view: 'v-read-only' });
            render(
                <Provider store={store}>
                    <EPub />
                </Provider>
            );

            const mainEl = document.getElementById('ct-epb-main');
            fireEvent.keyDown(mainEl, { keyCode: KeyCode.KEY_2, shiftKey: true });

            expect(store.getState().epub.view).toBe('v-edit-inote');
        });

        it('does not trigger shortcuts without shift key', () => {
            const store = createTestStore({ view: 'v-edit-inote' });
            render(
                <Provider store={store}>
                    <EPub />
                </Provider>
            );

            const mainEl = document.getElementById('ct-epb-main');
            fireEvent.keyDown(mainEl, { keyCode: KeyCode.KEY_1, shiftKey: false });

            // View should remain unchanged
            expect(store.getState().epub.view).toBe('v-edit-inote');
        });
    });
});
