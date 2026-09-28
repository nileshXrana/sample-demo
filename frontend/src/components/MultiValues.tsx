import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function Tags({ skills, setSkills }: { skills: string[]; setSkills: (skills: string[]) => void }) {

    return (
        <Autocomplete
            multiple
            id="tags-filled"
            options={skillsOptions.map((option) => option)}
            freeSolo
            value={skills}
            onChange={(event, newValue) => {
                setSkills(newValue);
            }}
            renderValue={(value: readonly string[], getItemProps) =>
                value.map((option: string, index: number) => {
                    const { key, ...itemProps } = getItemProps({ index });
                    return (
                        <Chip variant="outlined" label={option} key={key} {...itemProps} />
                    );
                })
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="add required skills"
                    placeholder="skills"
                />
            )}
        />
    );
}



const skillsOptions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'GraphQL',
    'RESTful APIs',
    'HTML',
];