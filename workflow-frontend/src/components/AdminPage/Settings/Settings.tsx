import React, { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import AppSettings from "./AppSettings";
import UserSynch from "./UserSynch";

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"sync" | "settings">("sync");

    return (
        <Container className="mt-3">
            <Row>
                <Col xs={12} md={3} lg={2} className="bg-light p-3">
                    <h5 className="mb-4">Ustawienia</h5>
                    <Nav variant="pills" className="flex-column" activeKey={activeTab}>
                        <Nav.Item>
                            <Nav.Link eventKey="sync" onClick={() => setActiveTab("sync")}>
                                User synchronization
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="settings" onClick={() => setActiveTab("settings")}>
                                Settings
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                <Col xs={12} md={9} lg={10} className="p-4">
                    {activeTab === "sync" && (
                        <UserSynch/>
                    )}

                    {activeTab === "settings" && (
                        <AppSettings/>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Settings;
