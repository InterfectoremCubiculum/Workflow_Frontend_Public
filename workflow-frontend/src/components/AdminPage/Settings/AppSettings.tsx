import { useEffect, useState } from "react";
import type { GetSettingDto } from "./GetSettingDto";
import { getAppSettings, updateAppSettings } from "../../../services/adminPanelService";
import Form from "react-bootstrap/esm/Form";
import { Button } from "react-bootstrap";
import type { UpdatedSettingDto } from "./UpdatedSettingDto";
import { ListOfSettingsKey } from "../../../enums/ListOfSettingsKey";
import { localToUtcHHmm, utcToLocalHHmm } from "../../../utility/dateUtils";

const AppSettings: React.FC = () => {
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
        <div>
            <h3>Application Settings</h3>
            <Form onSubmit={handleSubmit} className="p-4">
                {dailyWorkThreadSetting && (
                    <Form.Group className="mb-3">
                        <Form.Label>Daily work thread time creation</Form.Label>
                        <Form.Control type="time" value={dailyWorkThreadSetting.value} onChange={(e) => handleChange(dailyWorkThreadSetting.key, e.target.value)} />
                    </Form.Group>
                )}
                {workLogNotificationStartSetting && (
                    <Form.Group className="mb-3">
                        <Form.Label>Work log notification start</Form.Label>
                        <Form.Control type="time" value={workLogNotificationStartSetting.value} onChange={(e) => handleChange(workLogNotificationStartSetting.key, e.target.value)} />
                    </Form.Group>
                )}
                {workLogNotificationEndSetting && (
                    <Form.Group className="mb-3">
                        <Form.Label>Work log notification end</Form.Label>
                        <Form.Control type="time" value={workLogNotificationEndSetting.value} onChange={(e) => handleChange(workLogNotificationEndSetting.key, e.target.value)} />
                    </Form.Group>
                )}
                <Button variant="primary" type="submit" className="mt-3 me-1">
                    Submit
                </Button>
                <Button variant="danger" type="button" onClick={() => fetchSettings()} className="mt-3 ms-1">
                    Cancel
                </Button>
            </Form>
        </div>
    );
};

export default AppSettings;