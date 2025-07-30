import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import UserSummaryComponent from "./User/UserSummaryComponent";
import TeamsSummaryComponent from "./Team/TeamSummaryComponent";
import ProjectSummaryComponent from "./Project/ProjectSummaryComponent";

const SummaryPage: React.FC = () => {
    const [summaryType, setSummaryType] = useState<"User" | "Team" | "Project" | null>(null);
    

    return (
        <div className="mt-3 mb-3 d-flex flex-column align-items-center">
            <ToggleButtonGroup 
                type="radio" 
                name="summaryType"
                value={summaryType}
                className="mb-2" 
                onChange={(value) => {setSummaryType(value as "User" | "Team" | "Project")}}
            >
                <ToggleButton value={"User"} id="tbg-check-1">
                    User
                </ToggleButton>
                <ToggleButton value={"Team"} id="tbg-check-2">
                    Team
                </ToggleButton>
                <ToggleButton value={"Project"} id="tbg-check-3">
                    Project
                </ToggleButton>
            </ToggleButtonGroup>
            <div className="mt-3">
                {summaryType === "User" && <UserSummaryComponent/>}
                {summaryType === "Team" && <TeamsSummaryComponent/>}
                {summaryType === "Project" && <ProjectSummaryComponent/>}
                {!summaryType && <p>Please select a summary type.</p>}
            </div>
        </div>
    );
};

export default SummaryPage;