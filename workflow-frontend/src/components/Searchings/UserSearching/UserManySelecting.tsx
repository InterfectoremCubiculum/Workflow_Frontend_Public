    import AsyncSelect from 'react-select/async';
    import { searchUsers } from '../../../services/userService';
    import type { GetSearchedUserDto } from './GetSearchedUserDto';

    interface UserManySelectingProps {
        onUserSelect: (users: GetSearchedUserDto[]) => void;
    }

    const UserManySelecting = ({ onUserSelect }: UserManySelectingProps) => {

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
        const handleUserSelect = async (selectedOptions: any) => {
            const selectedUsers: GetSearchedUserDto[] = selectedOptions?.map((opt: any) => ({
                userId: opt.value,
                name: opt.label.split(' ')[0],
                surname: opt.label.split(' ')[1],
                email: opt.label.split('(')[1].replace(')', '')
            })) || [];
            onUserSelect(selectedUsers);
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
                    handleUserSelect(selectedOptions)
                }}
                placeholder="Search users..."
                isClearable
            />
        );
    };

    export default UserManySelecting;
