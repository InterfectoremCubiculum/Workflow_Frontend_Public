import { useEffect } from "react";

const AuthPopupSuccess = () => {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage("login-success", window.location.origin);
            window.close();
        } else {
            window.location.href = "/";
        }
    }, []);

    return <p>Logged successfully. You can close this window.</p>;
};

export default AuthPopupSuccess;
