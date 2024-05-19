import { render, screen } from '@testing-library/react';
import NewEPubModal from './NewEPubModal';
import { LanguageConstants } from 'components/CTPlayer';

const noop = () => ({});

describe('New EPubModal', () => {
    test('it renders with no languages', () => {
        render(<NewEPubModal open={true} onClose={noop} onCreate={noop} defaultTitle={""}/>);

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
        render(<NewEPubModal open={false} onClose={noop} onCreate={noop} defaultTitle={""}/>);
    });
});