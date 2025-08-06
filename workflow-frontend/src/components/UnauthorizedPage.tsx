import { Button } from "react-bootstrap";
import { useUser } from "../contexts/UserContext";

const UnauthorizedPage: React.FC = () => {
    const { user, isLoadingUser } = useUser();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleLoginRedirect = () => {
        const currentFrontendUrl = window.location.origin + window.location.pathname;
        window.location.href = `${apiUrl}/api/Auth/login?redirectUri=${encodeURIComponent(currentFrontendUrl)}`;
    };

    return (
        <div>
            {isLoadingUser ? (
                <p>Ładowanie danych użytkownika...</p>
            ) : user ? (
                <>
                    <p>Zalogowany jako: {user.givenName} {user.surname} {user.role}</p>
                </>
            ) : (
                <>
                    <p>Użytkownik niezalogowany.</p>
                    <Button onClick={handleLoginRedirect}>Zaloguj się</Button>
                </>
            )}
            <h1>Welcome to the UnauthorizedPage</h1>
            <p>This is the main landing page of the application.</p>
        </div>
    );
}
export default UnauthorizedPage;
