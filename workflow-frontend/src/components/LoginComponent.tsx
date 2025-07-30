import { Button } from "react-bootstrap";
import React, { useEffect } from "react"; 
import { useUser } from "../contexts/UserContext";
import axiosInstance from "../../axiosConfig";
import { BACKEND_BASE_URL } from "../config/environment";

const LoginComponent: React.FC = () => {
    const { user, isLoadingUser, clearUser } = useUser();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data === "login-success") {
                window.location.reload(); // lub odśwież userContext
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);


    const handleLogin = () => {
        const loginUrl = `${BACKEND_BASE_URL}/Auth/login`;
        window.open(loginUrl, "popup", "width=600,height=600"); 
    };


    const handleLogout = () => {
        logout(); 
    };

    const logout = async () => {
        try {

            await axiosInstance.get(`/auth/logout`, {
                withCredentials: true
            });
            clearUser(); 
        } catch (error) 
        {
            console.error('Logout error:', error);
        }
    };

    return (
        <div>
            {isLoadingUser ? (
                <p>Ładowanie danych użytkownika...</p>
            ) : user ? ( 
                <div className="d-flex">
                    <p className="m-0 pe-3">Logged as: {user.givenName} {user.surname}</p>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            ) : (
                <Button onClick={handleLogin}>Login</Button>
            )}
        </div>
    );
};

export default LoginComponent;