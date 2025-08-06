import { Link, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import UnauthorizedPage from "../components/UnauthorizedPage";
import HomePage from "../components/HomePage";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginComponent from "../components/LoginComponent";
import AdminPage from "../components/AdminPage/AdmingPage";
import { useUser } from "../contexts/UserContext";
import DayOffAdminPanel from "../components/AdminPage/AdminPanel/DayOffAdminPanel";
import "../../node_modules/react-big-calendar/lib/css/react-big-calendar.css";
import DayOffsViewer from "../components/DayOff/Calendar/DayOffsViewer";
import DayOffsManager from "../components/DayOff/Calendar/DayOffsManager";
import WorkLogViewer from "../components/Worklogs/Timeline/WorklogViewer";
import AdminWorkLogViewer from "../components/Worklogs/Timeline/AdminWorkLogViewer";
import SummaryPage from "../components/Summary/SummaryPage";
import AuthPopupSuccess from "../components/AuthPopupSuccess";
import WorkTrackerContainer from "../components/Worklogs/WorkTrackerContainer";
import Notifications from "../notifications/Notifications";

const Routing = () => {
    const { user, isLoadingUser } = useUser();

    if (isLoadingUser) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h4>Ładowanie...</h4>
            </div>
        );
    }

    return (
        <>
            {user && <WorkTrackerContainer />}

            <header>
                <Navbar expand="lg" bg="light" variant="light" className="shadow-sm">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Workflow Log</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav">
                            <Nav className="me-auto">
                                {user && (
                                    <>
                                        {user.role === "Admin" && (
                                            <NavDropdown title="Admin" menuVariant="light">
                                                <NavDropdown.Item as={Link} to="/adminPanel">Admin Panel</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/dayOffAdminPanel">Day Off Requests</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/summaryPage">Summary</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/adminWorkLogViewer">Work Log Calendar</NavDropdown.Item>
                                            </NavDropdown>
                                        )}

                                        <NavDropdown title="Day Offs">
                                            <NavDropdown.Item as={Link} to="/dayOffsViewer">View Day Offs</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/dayOffsManager">Manage Your Day Offs</NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title="Worklog">
                                            <NavDropdown.Item as={Link} to="/worklogViewer">View Worklog</NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                )}
                            </Nav>

                            <div className="d-flex align-items-center gap-3">
                                <LoginComponent />
                                {user?.role === "Admin" && <Notifications />}
                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>

            <main className="container py-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {user && (
                        <>
                            <Route path="/adminPanel" element={
                                <ProtectedRoute rolesAllowed={["Admin"]} currentRole={user.role}>
                                    <AdminPage />
                                </ProtectedRoute>
                            } />

                            <Route path="/adminWorkLogViewer" element={
                                <ProtectedRoute rolesAllowed={["Admin"]} currentRole={user.role}>
                                    <AdminWorkLogViewer />
                                </ProtectedRoute>
                            } />

                            <Route path="/summaryPage" element={
                                <ProtectedRoute rolesAllowed={["Admin", "User"]} currentRole={user.role}>
                                    <SummaryPage />
                                </ProtectedRoute>
                            } />

                            <Route path="/worklogViewer" element={
                                <ProtectedRoute rolesAllowed={["Admin", "User"]} currentRole={user.role}>
                                    <WorkLogViewer />
                                </ProtectedRoute>
                            } />

                            <Route path="/dayOffAdminPanel" element={
                                <ProtectedRoute rolesAllowed={["Admin"]} currentRole={user.role}>
                                    <DayOffAdminPanel />
                                </ProtectedRoute>
                            } />

                            <Route path="/dayOffsViewer" element={
                                <ProtectedRoute rolesAllowed={["Admin", "User"]} currentRole={user.role}>
                                    <DayOffsViewer />
                                </ProtectedRoute>
                            } />

                            <Route path="/dayOffsManager" element={
                                <ProtectedRoute rolesAllowed={["Admin", "User"]} currentRole={user.role}>
                                    <DayOffsManager />
                                </ProtectedRoute>
                            } />
                        </>
                    )}

                    <Route path="/auth-popup-success" element={<AuthPopupSuccess />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <footer className="bg-body-secondary text-center py-3 mt-auto">
                <p className="mb-0 text-muted">© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Routing;
