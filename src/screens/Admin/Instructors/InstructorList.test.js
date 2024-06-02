import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import InstructorList from './InstructorList';
import * as KeyCode from 'keycode-js';

describe('Instructor List', () => {
    const universityName = 'University of Test'
    const baseProps = {
        loading: false,
        currUni: { name: universityName, id: 0 },
        onInactive: jest.fn()
    };

    const formatUniversityName = (universityName) => `University: ${universityName}`
    // maybe a getNumberOfInstructors function instead

    test('it renders', () => {
        render(<InstructorList {...baseProps} instructors={[]}/>);

        expect(screen.queryByText(formatUniversityName(universityName))).toBeNull();
    });

    // Note: only setting up fields we use for display, add more as needed
    const instructors = [
        { id: 0, firstName: "Harsh", lastName: "Deep", email: "harsh@example.com" },
        { id: 1, firstName: "Alan", email: "alan@example.com" },
        { id: 2, lastName: "Turing", email: "turing@example.com" },
    ]

    test('it shows all instructors', () => {
        render(<InstructorList {...baseProps} instructors={instructors} />);

        expect(screen.getAllByText(formatUniversityName(universityName))).toHaveLength(3);

        expect(screen.getByText("Harsh Deep")).toBeVisible();
        expect(screen.getByText("Alan")).toBeVisible();
        expect(screen.getByText("Unknown Turing")).toBeVisible(); 
        // do we want to still show unknown if we have a last name? - todo: make an issue

        expect(screen.getByText("Email: harsh@example.com")).toBeVisible();
        expect(screen.getByText("Email: alan@example.com")).toBeVisible();
        expect(screen.getByText("Email: harsh@example.com")).toBeVisible();
    });

    test('it filters based on first, last and email and we can reset the filters', async () => {
        render(<InstructorList {...baseProps} instructors={instructors} />);

        const searchField = screen.getByLabelText("Search:");
        const searchButton = screen.getByRole("button", { name: "search"});
        const resetButton = screen.getByRole("button", { name: "Reset" });

        // First Name
        await userEvent.type(searchField, "Harsh");      
        await userEvent.click(searchButton);

        expect(screen.getAllByText(formatUniversityName(universityName))).toHaveLength(1);
        expect(screen.getByText("Harsh Deep")).toBeVisible();
        
        // Last Name
        await userEvent.clear(searchField);
        await userEvent.type(searchField, "Turing");      
        await userEvent.click(searchButton);

        expect(screen.getAllByText(formatUniversityName(universityName))).toHaveLength(1);
        expect(screen.getByText("Unknown Turing")).toBeVisible();

        // Email
        await userEvent.clear(searchField);
        await userEvent.type(searchField, "alan@example");      
        await userEvent.click(searchButton);

        expect(screen.getAllByText(formatUniversityName(universityName))).toHaveLength(1);
        expect(screen.getByText("Alan")).toBeVisible();

        // Reset
        await userEvent.click(resetButton);
        expect(searchField.value).toBe("");
        expect(screen.getAllByText(formatUniversityName(universityName))).toHaveLength(3);
    });
});