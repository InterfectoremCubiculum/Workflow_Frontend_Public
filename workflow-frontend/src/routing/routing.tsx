import { Link, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import UnauthorizedPage from "../components/UnauthorizedPage";
import HomePage from "../components/HomePage";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginComponent from "../components/LoginComponent";
import AdminPage from "../components/AdminPage/AdmingPage";
import { useUser } from "../contexts/UserContext";
import DayOffAdminPanel from "../components/AdminPage/AdminPanel/DayOffAdminPanel";
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css';
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
        return <div>Ładowanie...</div>;
    }
    else {
        return (
            <>  
            {user && (
                <>
                    <WorkTrackerContainer/>
                </>
            )}
            <div>
                <header>
                    <Navbar expand="lg" className="bg-body-secondary p-3 ps-5 pe-5">
                        <Navbar.Brand as={Link} to="/">Workflow Log</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse>
                            <Nav className="me-auto">
                            {user && (
                                <>
                                {user.role === "Admin" && (
                                    <NavDropdown title="Admin">
                                    <NavDropdown.Item as={Link} to="/adminPanel">Admin Panel</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/dayOffAdminPanel">Day Off Request</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/summaryPage">Summary</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/adminWorkLogViewer">Work Log Calendar</NavDropdown.Item>
                                    </NavDropdown>
                                )}

                                <NavDropdown title="Day Offs">
                                    <NavDropdown.Item as={Link} to="/dayOffsViewer">View Other Day Offs</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/dayOffsManager">Manage Your Day Offs</NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Worklog">
                                    <NavDropdown.Item as={Link} to="/worklogViewer">View Worklog</NavDropdown.Item>
                                </NavDropdown>
                                </>
                            )}
                            </Nav>
                        </Navbar.Collapse>
                            <div className="d-flex  gap-3">
                                <LoginComponent />
                                {user && user.role === "Admin" && (
                                <Notifications />
                                )}
                            </div>
                    </Navbar>
                </header>
            </div>

                <div className="container">
                    <Routes>
                        
                        <Route path="/" element={<HomePage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        {user && (
                            <>
                            <Route path="/adminPanel" element={
                                <ProtectedRoute rolesAllowed={["Admin"]} currentRole={user?.role}> <AdminPage /> </ProtectedRoute>
                            }/>
                            <Route path="/adminWorkLogViewer" element={
                                <ProtectedRoute rolesAllowed={["Admin"]} currentRole={user?.role}> <AdminWorkLogViewer /> </ProtectedRoute>
                            }/>
                            <Route path="/summaryPage" element={
                                <ProtectedRoute rolesAllowed={["Admin"]} currentRole={user?.role}> <SummaryPage/> </ProtectedRoute>
                            }/>
                            <Route path="/workLogViewer" element={<WorkLogViewer/>} />
                            <Route path="/dayOffAdminPanel" element={<DayOffAdminPanel />} />
                            <Route path="/dayOffsViewer" element={<DayOffsViewer />} />
                            <Route path="/dayOffsManager" element={<DayOffsManager />} />
                            </>
                        )}
                        <Route path="*" element={<Navigate to="/" replace />} />
                        <Route path="/auth-popup-success" element={<AuthPopupSuccess />} />

                    </Routes>
                </div>
            </> 
        );
    }
};

export default Routing;
