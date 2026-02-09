import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClosedCaptionMenu from './ClosedCaptionMenu';

// Mock MenuItem
jest.mock('./MenuItem', () => {
  return function MenuItem({ text, active, onClick, goBack, isSubMenu, bordered, ...props }) {
    return (
      <button
        onClick={onClick}
        data-text={text}
        data-active={active}
        data-go-back={goBack}
        data-submenu={isSubMenu}
        data-bordered={bordered}
        {...props}
      >
        {text}
      </button>
    );
  };
});

describe('ClosedCaptionMenu', () => {
  const defaultProps = {
    openCC: true,
    language: { code: 'en-US', text: 'English' },
    languages: [
      { code: 'en-US', text: 'English' },
      { code: 'es-ES', text: 'Spanish' },
      { code: 'fr-FR', text: 'French' },
    ],
    onGoBack: jest.fn(),
    onOpenCCOptions: jest.fn(),
    onCloseCC: jest.fn(),
    setLanguage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
  });

  it('has settings-menu container class', () => {
    const { container } = render(<ClosedCaptionMenu {...defaultProps} />);
    const menu = container.querySelector('.settings-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.className).toContain('ctp');
  });

  it('renders go back button', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    expect(screen.getByText('Closed Caption')).toBeInTheDocument();
  });

  it('calls onGoBack when go back button is clicked', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    const goBackButton = screen.getByText('Closed Caption');
    fireEvent.click(goBackButton);
    expect(defaultProps.onGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders Custom submenu button', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('calls onOpenCCOptions when Custom is clicked', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);
    expect(defaultProps.onOpenCCOptions).toHaveBeenCalledTimes(1);
  });

  it('renders OFF button', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    expect(screen.getByText('OFF')).toBeInTheDocument();
  });

  it('calls onCloseCC when OFF is clicked', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    const offButton = screen.getByText('OFF');
    fireEvent.click(offButton);
    expect(defaultProps.onCloseCC).toHaveBeenCalledTimes(1);
  });

  it('marks OFF as active when openCC is false', () => {
    render(<ClosedCaptionMenu {...defaultProps} openCC={false} />);
    const offButton = screen.getByText('OFF');
    expect(offButton).toHaveAttribute('data-active', 'true');
  });

  it('renders all available languages', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('marks current language as active when openCC is true', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    const englishButton = screen.getByText('English');
    expect(englishButton).toHaveAttribute('data-active', 'true');
  });

  it('calls setLanguage with language code when a language is clicked', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);
    const spanishButton = screen.getByText('Spanish');
    fireEvent.click(spanishButton);
    expect(defaultProps.setLanguage).toHaveBeenCalledWith('es-ES');
  });

  it('renders empty div when languages is undefined', () => {
    const { container } = render(
      <ClosedCaptionMenu {...defaultProps} languages={undefined} />
    );
    expect(container.querySelector('div > div')).toBeInTheDocument();
  });

  it('renders correct number of menu items with languages', () => {
    const { container } = render(<ClosedCaptionMenu {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(6); // go back + custom + OFF + 3 languages
  });

  it('does not mark language as active when openCC is false', () => {
    render(<ClosedCaptionMenu {...defaultProps} openCC={false} />);
    const englishButton = screen.getByText('English');
    expect(englishButton).toHaveAttribute('data-active', 'false');
  });

  it('each language is clickable', () => {
    render(<ClosedCaptionMenu {...defaultProps} />);

    fireEvent.click(screen.getByText('English'));
    fireEvent.click(screen.getByText('Spanish'));
    fireEvent.click(screen.getByText('French'));

    expect(defaultProps.setLanguage).toHaveBeenCalledTimes(3);
    expect(defaultProps.setLanguage).toHaveBeenCalledWith('en-US');
    expect(defaultProps.setLanguage).toHaveBeenCalledWith('es-ES');
    expect(defaultProps.setLanguage).toHaveBeenCalledWith('fr-FR');
  });
});
