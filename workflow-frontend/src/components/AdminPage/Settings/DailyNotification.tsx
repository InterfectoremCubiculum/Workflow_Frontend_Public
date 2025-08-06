import { useEffect, useState } from "react";
import type { GetSettingDto } from "./GetSettingDto";
import { getAppSettings, updateAppSettings } from "../../../services/adminPanelService";
import Form from "react-bootstrap/esm/Form";
import { Button, Card, Col, Row } from "react-bootstrap";
import type { UpdatedSettingDto } from "./UpdatedSettingDto";
import { ListOfSettingsKey } from "../../../enums/ListOfSettingsKey";
import { localToUtcHHmm, utcToLocalHHmm } from "../../../utility/dateUtils";

const DailyNotification: React.FC = () => {
    const [settings, setSettings] = useState<GetSettingDto[]>([]);
    const [updatedSettings, setUpdatedSettings] = useState<UpdatedSettingDto[]>([]);
    
    const dailyWorkThreadSetting = settings.find(s => s.key === ListOfSettingsKey.daily_work_thread);
    const workLogNotificationEndSetting = settings.find(s => s.key === ListOfSettingsKey.work_log_notification_end);
    const workLogNotificationStartSetting = settings.find(s => s.key === ListOfSettingsKey.work_log_notification_start);

    const timeKeys = [
        ListOfSettingsKey.daily_work_thread.toString(),
        ListOfSettingsKey.work_log_notification_start.toString(),
        ListOfSettingsKey.work_log_notification_end.toString()
    ];

    const handleChange = (key: string, newValue: string) => {
        setUpdatedSettings(prev => {
            const filtered = prev.filter(s => s.key !== key);
            return [...filtered, { key, value: newValue }];
        });

        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const convertedToUtc = updatedSettings.map(setting => {

        if (timeKeys.includes(setting.key)) {
            return { ...setting, value: localToUtcHHmm(setting.value) };
        }

            return setting;
        });
        await updateAppSettings(convertedToUtc)
            .then(() => {
                alert("Settings updated successfully!");
                fetchSettings();
                setUpdatedSettings([]);
            })
            .catch(error => {
                console.error("Error updating settings:", error);
                alert("Failed to update settings. Please try again.");
            }); 
    };

    useEffect (() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        await getAppSettings().then(data => {
            const localConverted = data.map(setting => {
                if (timeKeys.includes(setting.key)) {
                    return { ...setting, value: utcToLocalHHmm(setting.value) };
                }
                    return setting;
                });
            setSettings(localConverted);
        })
    };

    return (
        <Card className="p-4 shadow-sm">
            <Card.Title className="mb-3">Application Settings</Card.Title>
            <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                    {dailyWorkThreadSetting && (
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Thread Creation Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={dailyWorkThreadSetting.value}
                                    onChange={(e) =>
                                        handleChange(dailyWorkThreadSetting.key, e.target.value)
                                    }
                                />
                            </Form.Group>
                        </Col>
                    )}

                    {workLogNotificationStartSetting && (
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Notification Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={workLogNotificationStartSetting.value}
                                    onChange={(e) =>
                                        handleChange(workLogNotificationStartSetting.key, e.target.value)
                                    }
                                />
                            </Form.Group>
                        </Col>
                    )}

                    {workLogNotificationEndSetting && (
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Notification End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={workLogNotificationEndSetting.value}
                                    onChange={(e) =>
                                        handleChange(workLogNotificationEndSetting.key, e.target.value)
                                    }
                                />
                            </Form.Group>
                        </Col>
                    )}
                </Row>

                <div className="mt-4 d-flex justify-content-end">
                    <Button variant="primary" type="submit" className="me-2">
                        Save
                    </Button>
                    <Button variant="secondary" type="button" onClick={fetchSettings}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default DailyNotification;