import AsyncSelect from 'react-select/async';
import type { GetSearchedTeamDto } from './GetSearchedTeamDto';
import { searchTeams } from '../../../services/teamService';

interface TeamSelectingProps {
    onTeamSelect: (team: GetSearchedTeamDto) => void;
}

const TeamSelecting = ({ onTeamSelect }: TeamSelectingProps) => {

    const loadOptions = async (inputValue: string) => {
        if (inputValue.length < 3) return [];

        try {
            const data: GetSearchedTeamDto[] = await searchTeams({
                searchingPhrase: inputValue,
                responseLimit: 10,
            });

            return data.map(team => ({
                label: team.name,
                value: team.id,
            }));
        } catch (error) {
            console.error("Error loading options:", error);
            return [];
        }
    };

    const handleTeamSelect = (selectedOption: any) => {
        if (!selectedOption) return;

        const selectedTeam: GetSearchedTeamDto = {
            id: selectedOption.value,
            name: selectedOption.label,
        };

        onTeamSelect(selectedTeam);
    };

    return (
        <AsyncSelect
            styles={{
                menu: (provided: any) => ({
                    ...provided,
                    zIndex: 1000,
                }),
            }}
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onChange={handleTeamSelect}
            placeholder="Search teams..."
            isClearable
        />
    );
};

export default TeamSelecting;
