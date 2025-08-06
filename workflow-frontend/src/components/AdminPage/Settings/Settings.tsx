import React, { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import UserSynch from "./UserSynch";
import DailyNotification from "./DailyNotification";
import WorklogSettings from "./WorklogSettings";

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"sync" | "dailyNotification" | "worklogSettings">("sync");

    return (
        <Container className="mt-3">
            <Row>
                <Col xs={12} md={3} lg={2} className="bg-light p-3">
                    <h5 className="mb-4">Settings</h5>
                    <Nav variant="pills" className="flex-column" activeKey={activeTab}>
                        <Nav.Item>
                            <Nav.Link eventKey="sync" onClick={() => setActiveTab("sync")}>
                                User synchronization
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="dailyNotification" onClick={() => setActiveTab("dailyNotification")}>
                                Daily Notification
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="worklogSettings" onClick={() => setActiveTab("worklogSettings")}>
                                Worklog Settings
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                <Col xs={12} md={9} lg={10} className="p-4">
                    {activeTab === "sync" && (
                        <UserSynch/>
                    )}

                    {activeTab === "dailyNotification" && (
                        <DailyNotification/>
                    )}
                    { activeTab === "worklogSettings" && (
                        <WorklogSettings/>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Settings;
