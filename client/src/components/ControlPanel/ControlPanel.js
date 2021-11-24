import React, { useState, } from 'react';
import { AppBar, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import useStyles from './styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const ControlPanel = ({ onlySelfProject, onlyUnConfirm,statusCode, setOnlySelfProject, setonlyUnConfirm,setStatusCode}) => {
    const classes = useStyles();
    const [state, setState] = useState({
        onlySelfProject: onlySelfProject,
        onlyUnConfirm: onlyUnConfirm,
    });
    const [statusCodeState, setStatusCodeState] = useState(statusCode);
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        if (event.target.name === 'onlySelfProject') {
            setOnlySelfProject(event.target.checked);
        }
        else if (event.target.name === 'onlyUnConfirm') {
            setonlyUnConfirm(event.target.checked);
        }
    };
    const handleSelectChange = (event) => {
        setStatusCodeState(event.target.value)
        setStatusCode(event.target.value);
      };
    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <FormGroup row className={classes.FormGroup}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.onlySlefProject}
                            onChange={handleChange}
                            name="onlySelfProject"
                            color="primary"
                        />
                    }
                    label="僅顯示個人建立行程"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.onlyUnConfirm}
                            onChange={handleChange}
                            name="onlyUnConfirm"
                            color="primary"
                        />
                    }
                    label="僅顯示待確認項目"
                />
                <FormControlLabel
                    control={
                        <FormControl >
                            <InputLabel htmlFor="age-native-simple">狀態</InputLabel>
                            <Select
                                native
                                value={statusCodeState}
                                onChange={handleSelectChange}
                                inputProps={{
                                    name: 'statusCode',
                                    id: 'age-native-simple',
                                }}
                            >
                                <option value={'0'}>全部</option>
                                <option value={'010'}>參與確認中</option>
                                <option value={'020'}>帳務確認中</option>
                                <option value={'090'}>結束確認中</option>
                                <option value={'099'}>結束</option>
                            </Select>
                        </FormControl>
                    }
                    className={classes.FormControlLabel}
                />
            </FormGroup>

        </AppBar>
    );
};

export default ControlPanel;
