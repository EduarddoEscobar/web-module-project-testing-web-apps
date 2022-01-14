import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);

    const header = screen.getByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const fNameInput = screen.getByLabelText(/first name/i);
    userEvent.type(fNameInput, 'Edd');

    const errors = await screen.findAllByTestId('error');
    expect(errors).toHaveLength(1);
        
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitBtn = screen.getByText(/submit/i);
    userEvent.click(submitBtn);

    const errors = await screen.findAllByTestId('error');
    expect(errors).toHaveLength(3);

});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const fNameInput = screen.getByLabelText(/first name/i);
    const lNameInput = screen.getByLabelText(/last name/i);
    const submitBtn = screen.getByText(/submit/i);
    userEvent.type(fNameInput, 'Felipe');
    userEvent.type(lNameInput, 'Rodriguez');
    userEvent.click(submitBtn);

    const errors =  await screen.findAllByTestId('error');
    expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, 'banana');

    const error = await screen.findByTestId('error');
    expect(error).toHaveTextContent(/email must be a valid email address/i);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const fNameInput = screen.getByLabelText(/first name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByText(/submit/i);
    userEvent.type(fNameInput, 'Eduardo');
    userEvent.type(emailInput, 'DefinitelyNotPablosKid@yahoo.com');
    userEvent.click(submitBtn);

    const error = await screen.findByTestId('error');
    expect(error).toHaveTextContent(/lastName is a required field/i);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const fNameInput = screen.getByLabelText(/first name/i);
    const lNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByText(/submit/i);
    userEvent.type(fNameInput, 'Eduardo');
    userEvent.type(lNameInput, 'Escobar');
    userEvent.type(emailInput, 'DefinitelyNotPablosKid@yahoo.com');
    userEvent.click(submitBtn);

    await waitFor(() => {
        const fNameDisplay = screen.getByText(/eduardo/i);
        const lNameDisplay = screen.getByText(/escobar/i);
        const emailDisplay = screen.getByText(/definitelyNotPabloskid/i);
        const messageDisplay = screen.queryByTestId(/messageDisplay/i);

        expect(fNameDisplay).toBeInTheDocument();
        expect(lNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const fNameInput = screen.getByLabelText(/first name/i);
    const lNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByText(/submit/i);
    userEvent.type(fNameInput, 'Eduardo');
    userEvent.type(lNameInput, 'Escobar');
    userEvent.type(messageInput, 'Ketchup on eggs is wrong');
    userEvent.type(emailInput, 'DefinitelyNotPablosKid@yahoo.com');
    userEvent.click(submitBtn);

    await waitFor(() => {
        const fNameDisplay = screen.getByText(/eduardo/i);
        const lNameDisplay = screen.getByText(/escobar/i);
        const emailDisplay = screen.getByText(/definitelyNotPabloskid/i);
        const messageDisplay = screen.getByText(/Ketchup on eggs is wrong/i);

        expect(fNameDisplay).toBeInTheDocument();
        expect(lNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});