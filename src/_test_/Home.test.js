import React from 'react';
import { render } from '@testing-library/react';
import Home from '../components/Home';
import { screen } from '@testing-library/react';

describe("home page", ()=> {
    
    test('home page render', () => {
        render(<Home />)
        const linkElement = screen.getByTestId("home");
         expect(linkElement).toBeInTheDocument();
    });

    test('text', () => {
        render(<Home />)
        const linkElement = screen.getByTestId("text");
        expect(linkElement).toBeInTheDocument();
    })



})