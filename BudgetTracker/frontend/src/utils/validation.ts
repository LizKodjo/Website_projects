export interface ValidationResult { isValid: boolean; errors: string[];}

export const validateTransaction = (transaction: any): ValidationResult => {
    const errors: string[] = []

    // Validate amount
    if (!transaction.amount || transaction.amount <= 0) {
        errors.push("Amount must be greater than 0.")
    }

    if (transaction.amount > 1000000) {
        errors.push('Amount seems too large.  Please check the value')
    }

    // Validate description

    if (!transaction.description || transaction.description.trim().length === 0) {
        errors.push('Description is required.')
    }

    if (transaction.description.length > 100) {
        errors.push('Description must be less than 100 characters.')
    }

    // Category validation
    if (!transaction.category || transaction.category.trim().length === 0) {
        errors.push('Category is required.')
    }

    // Type validation
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)){
        errors.push('Transaction type must be income or expense.')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

export const validateBudget = (budget: any): ValidationResult => {
    const errors: string[] = []

    // Amount validation
    if (!budget.amount || budget.amount <= 0) {
        errors.push('Budget amount must be greater than 0.')
    }

    if (budget.amount > 1000000) {
        errors.push('Budget amount seems too large.  Please check the value.')
    }

    // Category validation
    if (!budget.category || budget.category.trim().length === 0) {
        errors.push('Category is required.')
    }

    // Period validation
    if (!budget.period || !['weekly', 'monthly', 'yearly'].includes(budget.period)) {
        errors.push('Budget period must be weekly, monthly or yearly.')
    }

    return {isValid: errors.length === 0, errors}
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const validatePassword = (password: string): ValidationResult => {
    const errors: string[] = []

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long.')
    }

    if (password.length > 50) {
        errors.push('Password must be less than 50 characters.')
    }

    return {isValid: errors.length === 0, errors}
}