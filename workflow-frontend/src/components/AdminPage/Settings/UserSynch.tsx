import { useEffect, useState } from "react";
import type { GetSettingDto } from "./GetSettingDto";
import { getAppSettings, updateSettings_UserSync } from "../../../services/adminPanelService";
import Form from "react-bootstrap/esm/Form";
import { Button, Card, Col, Row } from "react-bootstrap";
import type { UpdatedSettingDto } from "./UpdatedSettingDto";
import { ListOfSettingsKey } from "../../../enums/ListOfSettingsKey";
import { userSync } from "../../../services/userService";
import Select from "react-select";
import { localToUtcHHmm, utcToLocalHHmm } from "../../../utility/dateUtils";

const UserSynch: React.FC = () => {
    const [settings, setSettings] = useState<GetSettingDto[]>([]);
    const [updatedSettings, setUpdatedSettings] = useState<UpdatedSettingDto[]>([]);

    const userSyncEnabled = settings.find(s => s.key === ListOfSettingsKey.user_sync_enabled);
    const userSyncDaysOfWeek = settings.find(s => s.key === ListOfSettingsKey.user_sync_days_of_week);
    const userSyncFrequency = settings.find(s => s.key === ListOfSettingsKey.user_sync_frequency);
    const userSyncDayOfMonth = settings.find(s => s.key === ListOfSettingsKey.user_sync_day_of_month);
    const userSyncTimeOfDay = settings.find(s => s.key === ListOfSettingsKey.user_sync_time_of_day);

    const handleChange = (key: string, newValue: string) => {
        setUpdatedSettings(prev => {
            const filtered = prev.filter(s => s.key !== key);
            return [...filtered, { key, value: newValue }];
        });

        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
    };

    const handleSync = async () => {
        try {
            await userSync();
            alert("Synchronizacja zakończona pomyślnie!");
        } catch (error) {
            console.error("Błąd podczas synchronizacji:", error);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors: string[] = [];

        if (userSyncEnabled?.value.toLowerCase() === "true") {
            const freq = userSyncFrequency?.value?.toLowerCase();
            const time = userSyncTimeOfDay?.value;

            if (!freq) {
                errors.push("Frequency is required.");
            }

            if (!time) {
                errors.push("Time of day is required.");
            }

            if (freq === "weekly" && (!userSyncDaysOfWeek?.value || userSyncDaysOfWeek.value.trim() === "")) {
                errors.push("At least one day of the week must be selected.");
            }

            if (freq === "monthly" && (!userSyncDayOfMonth?.value || isNaN(Number(userSyncDayOfMonth.value)))) {
                errors.push("A valid day of the month (1–28) is required.");
            }
        }

        const convertedSettings = updatedSettings.map(setting => {
            if (setting.key === ListOfSettingsKey.user_sync_time_of_day) {
                return {
                    ...setting,
                    value: localToUtcHHmm(setting.value)
                }
            }
            return setting;
        })

        if (errors.length > 0) {
            alert("Please fix the following errors:\n\n" + errors.join("\n"));
            return;
        }

        try {
            await updateSettings_UserSync(convertedSettings);
            alert("Settings updated successfully!");
            fetchSettings();
            setUpdatedSettings([]);
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Failed to update settings. Please try again.");
        }
    };


    useEffect (() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        await getAppSettings().then(data => {
            const converted = data.map(setting => {
                if (setting.key === ListOfSettingsKey.user_sync_time_of_day) {
                    return { ...setting, value: utcToLocalHHmm(setting.value) };
                }
                return setting;
            });
            setSettings(converted);
        })
    };

    return (
        <Card className="p-4 shadow-sm">
            <Card.Title>User Synchronization</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">
                You can manually or automatically synchronize user data.
            </Card.Subtitle>

            <div className="mb-4">
                <Button variant="primary" onClick={handleSync}>
                    Synchronize Now
                </Button>
            </div>

            <hr />

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Enable automatic user synchronization"
                        checked={userSyncEnabled?.value.toLowerCase() === "true"}
                        onChange={(e) =>
                            handleChange(
                                ListOfSettingsKey.user_sync_enabled,
                                e.target.checked.toString()
                            )
                        }
                    />
                </Form.Group>

                {userSyncEnabled?.value.toLowerCase() === "true" && (
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Frequency</Form.Label>
                                <Form.Select
                                    value={userSyncFrequency?.value || ""}
                                    onChange={(e) =>
                                        handleChange(ListOfSettingsKey.user_sync_frequency, e.target.value)
                                    }
                                >
                                    <option value="">-- Select frequency --</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Time of Day</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={userSyncTimeOfDay?.value || ""}
                                    onChange={(e) =>
                                        handleChange(ListOfSettingsKey.user_sync_time_of_day, e.target.value)
                                    }
                                />
                            </Form.Group>
                        </Col>

                        {userSyncFrequency?.value === "weekly" && (
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Days of Week</Form.Label>
                                    <Select
                                        isMulti
                                        options={[
                                            { value: "Sunday", label: "Sunday" },
                                            { value: "Monday", label: "Monday" },
                                            { value: "Tuesday", label: "Tuesday" },
                                            { value: "Wednesday", label: "Wednesday" },
                                            { value: "Thursday", label: "Thursday" },
                                            { value: "Friday", label: "Friday" },
                                            { value: "Saturday", label: "Saturday" }
                                        ]}
                                        value={(userSyncDaysOfWeek?.value || "")
                                            .split(",")
                                            .filter(Boolean)
                                            .map(day => ({ value: day, label: day }))}
                                        onChange={(selected) =>
                                            handleChange(
                                                ListOfSettingsKey.user_sync_days_of_week,
                                                selected.map(opt => opt.value).join(",")
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        )}

                        {userSyncFrequency?.value === "monthly" && (
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Day of Month</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        max={28}
                                        value={userSyncDayOfMonth?.value || ""}
                                        onChange={(e) =>
                                            handleChange(ListOfSettingsKey.user_sync_day_of_month, e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                )}

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

export default UserSynch;