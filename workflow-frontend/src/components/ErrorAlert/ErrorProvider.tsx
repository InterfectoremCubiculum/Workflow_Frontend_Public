import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface ErrorContextType {
    error: any;
    showError: (problemDetails: any) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>({
    error: null,
    showError: () => {},
    clearError: () => {},
});

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState(null);

    const showError = (problemDetails: any) => {
        setError(problemDetails);
    };

    const clearError = () => setError(null);

    return (
        <ErrorContext.Provider value={{ error, showError, clearError }}>
        {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    return useContext(ErrorContext);
}
