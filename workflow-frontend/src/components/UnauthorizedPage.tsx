import { Button } from "react-bootstrap";
import { useUser } from "../contexts/UserContext";
import { BACKEND_BASE_URL } from "../config/environment";

const UnauthorizedPage: React.FC = () => {
    const { user, isLoadingUser } = useUser();

    const handleLoginRedirect = () => {
        const currentFrontendUrl = window.location.origin + window.location.pathname;
        window.location.href = `${BACKEND_BASE_URL}/Auth/login?redirectUri=${encodeURIComponent(currentFrontendUrl)}`;
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
