# Login Authentication System

## Project Overview

This project is a client-side Login Authentication System developed as part of the Oasis Infobyte Web Development Internship.

The system provides user registration, login validation, password hashing, duplicate account checking, protected dashboard access, and logout functionality.

## Objective

Build a simple authentication system featuring:

- User registration
- Login validation
- Password validation
- Protected dashboard
- Logout functionality

## Technology Used

- HTML5
- CSS3
- JavaScript
- localStorage
- sessionStorage
- Web Crypto API
- SHA-256 hashing

## Features

### Registration

- Username field
- Email field
- Password field
- Confirm password field
- Minimum 8-character password
- At least 1 number in the password
- Empty-field validation
- Duplicate username/email checking

### Login

- Username or email login
- Password validation
- Empty-field validation
- Generic incorrect credential message

### Protected Dashboard

- Separate dashboard page
- Dashboard can only be accessed with an active session
- Direct access without a session redirects to the login page
- Displays logged-in username and email

### Logout

- Clears the active session
- Redirects the user to the login page

### Password Security

Passwords are not stored in plain text.

The project uses the browser Web Crypto API with SHA-256 to create a hash before storing the password hash in localStorage.

## Project Structure

```text
WebDev-L2-LoginAuth/
│
├── index.html
├── dashboard.html
├── style.css
├── script.js
└── README.md