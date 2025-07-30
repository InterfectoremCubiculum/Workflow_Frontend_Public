import AsyncSelect from 'react-select/async';
import type { GetSearchedTeamDto } from './GetSearchedTeamDto';
import { searchTeams } from '../../../services/teamService';

interface TeamManySelectingProps {
    onTeamSelect: (teams: GetSearchedTeamDto[]) => void;
}

const TeamManySelecting = ({ onTeamSelect }: TeamManySelectingProps) => {

    const loadOptions = async (inputValue: string) => {
        if (inputValue.length < 3) return [];
        
        try {
            const data: GetSearchedTeamDto[] = await searchTeams({ searchingPhrase: inputValue, responseLimit: 10 });
            return data.map(team => ({
                label: `${team.name}`,
                value: team.id
            }));
        } catch (error) {
            console.error("Error loading options:", error);
            return [];
        }
    };
    const handleTeamSelect = async (selectedOptions: any) => {
        const selectedTeams: GetSearchedTeamDto[] = selectedOptions?.map((opt: any) => ({
            id: opt.value,
            name: opt.label.split(' ')[0],
        })) || [];
        onTeamSelect(selectedTeams);
    }
    return (
        <AsyncSelect
            styles={{
                menu: (provided: any) => ({
                    ...provided,
                    zIndex: 1000
                })
            }}
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            isMulti
            onChange={(selectedOptions) => {
                handleTeamSelect(selectedOptions)
            }}
            placeholder="Search teams..."
            isClearable
        />
    );
};

export default TeamManySelecting;
