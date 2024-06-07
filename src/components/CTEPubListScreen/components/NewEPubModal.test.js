import { render, screen } from '@testing-library/react';
import { LanguageConstants } from '../../CTPlayer/index.js'
import NewEPubModal from './NewEPubModal';

const mockSelect = jest.fn();
jest.mock("../../../layout/CTForm/Select/index.js", () => (props) => {
    mockSelect(props);
    return <div />;
}) 

describe('New EPubModal', () => {
    const baseProps = {
        open: true,
        onClose: jest.fn(),
        onCreate: jest.fn(),
        defaultTitle: ""
    };

    test('it renders with no languages', () => {
        render(<NewEPubModal {...baseProps} />);

        expect(screen.getByText("CREATE NEW I-Note")).toBeVisible();
        expect(screen.getByText("I-Note Title")).toBeVisible();
        
        expect(mockSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                options: []
            })
        );
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

        expect(mockSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                options:  [
                    {"text": "English", "value": LanguageConstants.English}, 
                    {"text": "French", "value": LanguageConstants.French}, 
                    {"text": "Spanish", "value": LanguageConstants.Spanish}]
            })
        );
    });
});