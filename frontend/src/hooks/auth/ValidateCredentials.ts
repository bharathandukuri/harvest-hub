export function isValidUsername(username: string): string | undefined {
    if (username.length < 6) {
        return "Username must be at least 6 characters long.";
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return "Username must contain only letters and numbers. Special characters are not allowed.";
    }
    return undefined;
}

export function isValidName(name: string): string | undefined {
    if (typeof name !== "string" || name.trim().length === 0) {
        return "Name cannot be empty.";
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
        return "Name must contain only letters, spaces, apostrophes, or hyphens.";
    }
    if (name.trim().length < 2) {
        return "Name must be at least 2 characters long.";
    }
    return undefined;
}

export function isValidPassword(password: string): string | undefined {
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[!@#$%^&*()_\-+=\[\]{}|\\;:'",.<>\/?`~]/.test(password)) {
        return "Password must include at least one special character.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must include at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must include at least one number.";
    }
    return undefined;
}

export function isValidEmail(email: string): string | undefined {
    email = email.trim();
    if (email.length === 0) {
        return "Email cannot be empty.";
    }
    const atCount = email.split("@").length - 1;
    if (atCount !== 1) {
        return "Email must contain exactly one '@' symbol.";
    }
    const [localPart, domainPart] = email.split("@");
    if (!localPart) {
        return "Email must have characters before '@'.";
    }
    if (!domainPart || domainPart.indexOf(".") === -1) {
        return "Email domain must contain a '.' like '.com' or '.org'.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }

    return undefined;
}
