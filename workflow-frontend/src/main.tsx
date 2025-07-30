import { createRoot } from 'react-dom/client';
import './index.css';
import "../node_modules/react-calendar-timeline/dist/Timeline.scss";
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import App from './App';
import { ErrorProvider } from './components/ErrorAlert/ErrorProvider';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <ErrorProvider>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </ErrorProvider>
);
