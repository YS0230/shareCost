import React, { useState, } from 'react';
import { AppBar, FormGroup, FormControlLabel, Switch, Button } from '@material-ui/core';
import useStyles from './styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Link } from 'react-router-dom';

const CostControlPanel = ({ onlySelf, onlyUnConfirm, statusCode, setOnlySelf, setOnlyUnConfirm,setStatusCode}) => {
    const classes = useStyles();
    const [state, setState] = useState({
        onlySelf: onlySelf,
        onlyUnConfirm: onlyUnConfirm,
    });
    const [statusCodeState, setStatusCodeState] = useState(statusCode);
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(event.target.checked);
        if (event.target.name === 'onlySelf') {
            setOnlySelf(event.target.checked);
        }
        else if (event.target.name === 'onlyUnConfirm') {
            
            setOnlyUnConfirm(event.target.checked);
        }
    };
    const handleSelectChange = (event) => {
        setStatusCodeState(event.target.value)
        setStatusCode(event.target.value);
      };
    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <label className={classes.prj_name} >{localStorage.getItem('prj_name')}</label>
            <FormGroup row className={classes.FormGroup}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.onlySelf}
                            onChange={handleChange}
                            name="onlySelf"
                            color="primary"
                        />
                    }
                    label="僅顯示參與項目"
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
                                <option value={'110'}>確認中</option>
                                <option value={'199'}>確認完成</option>
                            </Select>
                        </FormControl>
                    }
                    className={classes.FormControlLabel}
                />
                <FormControlLabel
                    control={
                        <FormControl >
                            <Button component={Link} to='/finalTable' variant='outlined'>總表</Button>
                        </FormControl>
                    }
                    className={classes.FormControlLabel}
                />
            </FormGroup>
        </AppBar>
    );
};

export default CostControlPanel;
