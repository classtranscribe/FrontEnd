import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { UISlogo } from '../../../../assets/images';

export function LivePlayerNavBar() {
    return (
        <Navbar bg="light">
            <Navbar.Brand href="https://www.bot.uillinois.edu/">
                <img
                    src={UISlogo}
                    width="30"
                    height="42"
                    alt="Board of Trustees"
                />
                Board of Trustees
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    <a href="https://www.uis.edu/" style={{ textDecoration: 'none' }}>University of Illinois Springfield </a>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}
