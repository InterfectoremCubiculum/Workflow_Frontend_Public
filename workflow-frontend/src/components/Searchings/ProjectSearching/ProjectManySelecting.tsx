import AsyncSelect from 'react-select/async';
import type { GetSearchedProjectDto } from './GetSearchedProjectDto';
import { searchProjects } from '../../../services/projectService';

interface ProjectManySelectingProps {
    onProjectSelect: (Projects: GetSearchedProjectDto[]) => void;
}

const ProjectManySelecting = ({ onProjectSelect }: ProjectManySelectingProps) => {

    const loadOptions = async (inputValue: string) => {
        if (inputValue.length < 3) return [];
        
        try {
            const data: GetSearchedProjectDto[] = await searchProjects({ searchingPhrase: inputValue, responseLimit: 10 });
            return data.map(Project => ({
                label: `${Project.name}`,
                value: Project.id
            }));
        } catch (error) {
            console.error("Error loading options:", error);
            return [];
        }
    };
    const handleProjectSelect = async (selectedOptions: any) => {
        const selectedProjects: GetSearchedProjectDto[] = selectedOptions?.map((opt: any) => ({
            id: opt.value,
            name: opt.label.split(' ')[0],
        })) || [];
        onProjectSelect(selectedProjects);
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
                handleProjectSelect(selectedOptions)
            }}
            placeholder="Search Projects..."
            isClearable
        />
    );
};

export default ProjectManySelecting;
