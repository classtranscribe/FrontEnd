import { render, screen } from '@testing-library/react';
import { LanguageConstants } from 'components/CTPlayer';
import NewEPubModal from './NewEPubModal';

describe('New EPubModal', () => {
    const noop = () => ({});
    const baseProps = {
        open: true,
        onClose: noop,
        onCreate: noop,
        defaultTitle: ""
    }
    test('it renders with no languages', () => {
        render(<NewEPubModal {...baseProps} />);

        expect(screen.getByText("CREATE NEW I-Note")).toBeVisible();
        expect(screen.getByText("I-Note Title")).toBeVisible();
        expect(screen.queryByText("I-Note Language")).toBeVisible(); 
        // because we have no languages
    });

    test('it renders given list of languages and uniquely', () => {
        const languages = [
            LanguageConstants.English,
            LanguageConstants.English,
            LanguageConstants.French,
            LanguageConstants.Spanish,
            LanguageConstants.French
        ]
        render(<NewEPubModal languages={languages} {...baseProps} />);
    });
});