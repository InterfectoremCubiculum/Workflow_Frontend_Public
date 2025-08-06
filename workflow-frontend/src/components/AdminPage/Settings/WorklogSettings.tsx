import { useEffect, useState } from "react";
import type { GetSettingDto } from "./GetSettingDto";
import { getAppSettings, updateAppSettings } from "../../../services/adminPanelService";
import Form from "react-bootstrap/esm/Form";
import { Button, Card, Col, Row } from "react-bootstrap";
import type { UpdatedSettingDto } from "./UpdatedSettingDto";
import { ListOfSettingsKey } from "../../../enums/ListOfSettingsKey";
import { utcToLocalHHmm } from "../../../utility/dateUtils";

const WorklogSettings: React.FC = () => {
    const [settings, setSettings] = useState<GetSettingDto[]>([]);
    const [updatedSettings, setUpdatedSettings] = useState<UpdatedSettingDto[]>([]);
    
    const maxWorkTimeSetting = settings.find(s => s.key === ListOfSettingsKey.max_work_time);
    const maxTimeBreakSetting = settings.find(s => s.key === ListOfSettingsKey.max_time_break);
    const maxTimeAwaySetting = settings.find(s => s.key === ListOfSettingsKey.max_time_away);
    const maxSummariseBreakTimeSetting = settings.find(s => s.key === ListOfSettingsKey.max_summarise_break_time);
    const timeAwayWhenUserGetNotificationSetting = settings.find(s => s.key === ListOfSettingsKey.time_away_when_user_get_notification);
    const maxReverseRegistrationTime = settings.find(s => s.key === ListOfSettingsKey.max_reverse_registration_time);
    const maxReverseRegistrationTimeLogged = settings.find(s => s.key === ListOfSettingsKey.max_reverse_registration_time_logged);
    const timeKeys = [
        ListOfSettingsKey.max_work_time.toString(),
        ListOfSettingsKey.max_time_break.toString(),
        ListOfSettingsKey.max_time_away.toString(),
        ListOfSettingsKey.max_summarise_break_time.toString(),
        ListOfSettingsKey.time_away_when_user_get_notification.toString(),
        ListOfSettingsKey.max_reverse_registration_time.toString(),
        ListOfSettingsKey.max_reverse_registration_time_logged.toString(),
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
        await updateAppSettings(updatedSettings)
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
                if (timeKeys.includes(setting.key) && setting.type === "TimeSpan") {
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
                {maxWorkTimeSetting && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Daily Work Limit (hours)</Form.Label>
                            <Form.Control
                                type="number"
                                max={23}
                                min={1}
                                value={maxWorkTimeSetting.value}
                                onChange={(e) =>
                                    handleChange(maxWorkTimeSetting.key, e.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                )}

                {maxTimeBreakSetting && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Max Break Duration (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                max={1440}
                                min={2}
                                value={maxTimeBreakSetting.value}
                                onChange={(e) =>
                                    handleChange(maxTimeBreakSetting.key, e.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                )}

                {timeAwayWhenUserGetNotificationSetting && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Notify After Inactivity (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                max={1440}
                                min={1}
                                value={timeAwayWhenUserGetNotificationSetting.value}
                                onChange={(e) =>
                                    handleChange(timeAwayWhenUserGetNotificationSetting.key, e.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                )}

                {maxTimeAwaySetting && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Auto Break After Inactivity (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                max={1440}
                                min={2}
                                value={maxTimeAwaySetting.value}
                                onChange={(e) =>
                                    handleChange(maxTimeAwaySetting.key, e.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                )}

                {maxSummariseBreakTimeSetting && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Total Break Limit (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                max={1440}
                                min={1}
                                value={maxSummariseBreakTimeSetting.value}
                                onChange={(e) =>
                                    handleChange(maxSummariseBreakTimeSetting.key, e.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                )}
                {maxReverseRegistrationTime && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Maximum Reverse Registration Time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                max={1440}
                                min={1}
                                value={maxReverseRegistrationTime.value}
                                onChange={(e) =>
                                    handleChange(maxReverseRegistrationTime.key, e.target.value)
                                }
                            />
                        </Form.Group>
                    </Col>
                )}
                {maxReverseRegistrationTimeLogged && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Minutes When Admin Approval Is Required (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                max={30}
                                min={1}
                                value={maxReverseRegistrationTimeLogged.value}
                                onChange={(e) =>
                                    handleChange(maxReverseRegistrationTimeLogged   .key, e.target.value)
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

export default WorklogSettings;