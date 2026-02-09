import { render, screen } from '@testing-library/react';
import InfoAndListLayout from './index';

// Mock the layout components
jest.mock('layout', () => ({
    CTFragment: ({ children, className, ...props }) => (
      <div className={className} {...props}>{children}</div>
    )
}));

describe('InfoAndListLayout', () => {
    it('renders without crashing', () => {
        render(<InfoAndListLayout />);
    });

    it('renders children', () => {
        render(
          <InfoAndListLayout>
            <div data-testid="child">Child Content</div>
          </InfoAndListLayout>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<InfoAndListLayout className="custom-class" />);
        const element = container.querySelector('.custom-class');
        expect(element).toBeInTheDocument();
    });

    it('applies base classes', () => {
        const { container } = render(<InfoAndListLayout />);
        const element = container.querySelector('.ct-info-n-li.inl-container');
        expect(element).toBeInTheDocument();
    });

    it('has Info sub-component', () => {
        expect(InfoAndListLayout.Info).toBeDefined();
    });

    it('has List sub-component', () => {
        expect(InfoAndListLayout.List).toBeDefined();
    });

    describe('InfoAndListLayout.Info', () => {
        it('renders without crashing', () => {
            render(<InfoAndListLayout.Info />);
        });

        it('renders children', () => {
            render(
              <InfoAndListLayout.Info>
                <span>Info Content</span>
              </InfoAndListLayout.Info>
            );
            expect(screen.getByText('Info Content')).toBeInTheDocument();
        });

        it('applies info class', () => {
            const { container } = render(<InfoAndListLayout.Info />);
            const element = container.querySelector('.info');
            expect(element).toBeInTheDocument();
        });
    });

    describe('InfoAndListLayout.List', () => {
        it('renders without crashing', () => {
            render(<InfoAndListLayout.List />);
        });

        it('renders children', () => {
            render(
              <InfoAndListLayout.List>
                <span>List Content</span>
              </InfoAndListLayout.List>
            );
            expect(screen.getByText('List Content')).toBeInTheDocument();
        });

        it('applies list class', () => {
            const { container } = render(<InfoAndListLayout.List />);
            const element = container.querySelector('.list');
            expect(element).toBeInTheDocument();
        });
    });
});
