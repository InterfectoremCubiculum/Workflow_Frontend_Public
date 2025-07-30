import AsyncSelect from 'react-select/async';
import type { GetSearchedProjectDto } from './GetSearchedProjectDto';
import { searchProjects } from '../../../services/projectService';

interface ProjectSelectingProps {
    onProjectSelect: (project: GetSearchedProjectDto) => void;
}

const ProjectSelecting = ({ onProjectSelect }: ProjectSelectingProps) => {
    const loadOptions = async (inputValue: string) => {
        if (inputValue.length < 3) return [];

        try {
            const data: GetSearchedProjectDto[] = await searchProjects({
                searchingPhrase: inputValue,
                responseLimit: 10,
            });

            return data.map(project => ({
                label: project.name,
                value: project.id.toString(),
            }));
        } catch (error) {
            console.error('Error loading options:', error);
            return [];
        }
    };

    const handleProjectSelect = (selectedOption: any) => {
        if (!selectedOption) return;

        const selectedProject: GetSearchedProjectDto = {
            id: selectedOption.value,
            name: selectedOption.label,
        };

        onProjectSelect(selectedProject);
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
            onChange={handleProjectSelect}
            placeholder="Search project..."
            isClearable
        />
    );
};

export default ProjectSelecting;
