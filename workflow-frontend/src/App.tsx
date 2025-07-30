import { useEffect } from "react";
import { setGlobalErrorHandler } from "../axiosConfig";
import { useError } from "./components/ErrorAlert/ErrorProvider";
import Routing from "./routing/routing";
import ErrorAlert from "./components/ErrorAlert/ErrorAlert";

function App() {
  const { error, showError, clearError } = useError();
  useEffect(() => {
    setGlobalErrorHandler(showError);
    return () => setGlobalErrorHandler(() => {});
  }, [showError]);
  return (
    <>
      <Routing/>
      <ErrorAlert error={error} onClose={clearError} />
    </>

  );
}
export default App;