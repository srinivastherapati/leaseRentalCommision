import * as React from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function FilterBox(props) {
    const [type, setType] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(null);

    const handleChange = (event) => {
        setType(event.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSearch = () => {
        if (!selectedDate) return;

        const isoDate = new Date(selectedDate).toISOString().split('T')[0]; // e.g., "2025-05-04"

        // Optionally include type if your API supports it in the future
        props.updateFilter(isoDate, type); // isoDate is used as `availableFrom`
    };

    return (
        <div className="w100 dflex jc-around" style={props.style}>
            <div className="search-box dflex ai-center">
                {/* <FormControl sx={{ width: "250px", backgroundColor: "white" }}>
                    <InputLabel id="apartment-type">Apartment Type</InputLabel>
                    <Select
                        labelId="apartment-type"
                        id="apartment-type-select"
                        value={type}
                        label="Apartment Type"
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>1 BHK</MenuItem>
                        <MenuItem value={2}>2 BHK</MenuItem>
                        <MenuItem value={3}>3 BHK</MenuItem>
                    </Select>
                </FormControl> */}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer sx={{ padding: "0px", backgroundColor: "white" }} components={['DatePicker']}>
                        <DatePicker
                            label="Move In Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </DemoContainer>
                </LocalizationProvider>

                <Button variant="contained" style={{ height: "100%", width: "20%" }} onClick={handleSearch}>
                    Search
                </Button>
            </div>
        </div>
    );
}

export default FilterBox;
