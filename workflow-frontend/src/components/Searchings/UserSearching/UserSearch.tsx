import AsyncSelect from 'react-select/async';
import { searchUsers } from '../../../services/userService';
import type { GetSearchedUserDto } from './GetSearchedUserDto';

interface UserSearchProps {
    onUserSelect: (userId: string | null) => void;
}

const UserSearch = ({ onUserSelect }: UserSearchProps) => {

    const loadOptions = async (inputValue: string) => {
        if (inputValue.length < 3) return [];
        
        try {
            const data: GetSearchedUserDto[] = await searchUsers({ searchingPhrase: inputValue, responseLimit: 10 });
            return data.map(user => ({
                label: `${user.name} ${user.surname} (${user.email})`,
                value: user.userId
            }));
        } catch (error) {
            console.error("Error loading options:", error);
            return [];
        }
    };

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
            onChange={(selected) => { onUserSelect(selected?.value ?? null)}}
            placeholder="Search user..."
            isClearable
        />
    );
};

export default UserSearch;
