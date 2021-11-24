import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Container } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';

import { createProject, updateProject } from '../../actions/projects';
import useStyles from './styles';
import { useHistory } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

import FormControl from '@material-ui/core/FormControl';
import MultiSelect from "react-multi-select-component";
import FormLabel from '@material-ui/core/FormLabel';

import * as api from '../../api/index.js';


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReplyIcon from '@material-ui/icons/Reply';


const FromProject = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const prj_id = localStorage.getItem('prj_id');
  console.log(prj_id);
  //var today = new Date().toISOString().substring(0, 10).toString();
  const initProjectData = { prj_name: '', prj_sdate: '', prj_edate: '', db_Project_ProjectMember: [{ 'mem_id': user?.result?.mem_id,'pm_confirm':'Y'}]}
  const [projectData, setProjectData] = useState(initProjectData);
  const [project,setProject] =useState(useSelector((state) => (prj_id ? state.projects.projects.find((project) => project.prj_id === prj_id) : null)));
  console.log(useSelector((state)=>state));
  const dispatch = useDispatch();
  const classes = useStyles();
  

  const [selected, setSelected] = useState([]);
  const [selectedText, setselectedText] = useState('');
  const [members, setＭembers] = useState([]);
  const history = useHistory();

  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? "共" + selected.length + "位"
      : "選擇成員";
  };
  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(({ label }) => label && label.match(re));
  }

  useEffect(() => {
    if (project) {
      setProjectData(project);
      let selectItem = [];
        project.db_Project_ProjectMember && project.db_Project_ProjectMember.filter(item => item.mem_id !== user?.result?.mem_id).map(data => {
        selectItem.push({ 'label': data.mem_name,
        'value': data.mem_id})
        return data;
      })
      setSelected(selectItem);
    }else{
      getProject(prj_id);
    }
  }, [project,prj_id,user.result.mem_id]);

  const getProject = async(prj_id)=>{
    try{
      const {data} = await api.fetchProject(prj_id);
      setProject(data);
    }catch(error){
      console.log(error);
      toast.warn(error.respanse);
    }
  }
  useEffect(() => {
    var selectedTextTemp = '';
    let addItem = [];
    selected.map(data => {
      selectedTextTemp += '#' + data.label + ' ';
      addItem.push({ 'mem_id': data.value })
      return data;
    })
    setselectedText(selectedTextTemp);
    
    if(projectData !== initProjectData){
      addItem.push({ 'mem_id': user?.result?.mem_id })
      setProjectData({...projectData, db_Project_ProjectMember: addItem});
    }
    
  }, [selected]);

  useEffect(() => {
    getMembers()
  }, []);

  const getMembers = async () => {
    try {
      const { data } = await api.fetchMembers();
      setＭembers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const clear = () => {
    console.log(history);
    setProjectData(initProjectData);
    setSelected([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(projectData)
    if (prj_id) {
      dispatch(updateProject(prj_id, { ...projectData, name: user?.result?.mem_name },history));
      clear(true);
    } else {
      dispatch(createProject({ ...projectData, name: user?.result?.mem_name }, history));
      clear(true);
    }
  };

  if (!user?.result?.mem_name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          請先登入
        </Typography>
      </Paper>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
<ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Paper className={classes.paper}>
        <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
          <Typography variant="h6">{prj_id ? '編輯行程' : '新增行程'}</Typography>

          <TextField
            name="prj_name"
            variant="outlined"
            required
            label="行程名稱"
            fullWidth
            value={projectData.prj_name} onChange={(e) => setProjectData({ ...projectData, prj_name: e.target.value })}
          />
          <TextField
            name="prj_sdate"
            variant="outlined"
            label="起始日期"
            fullWidth
            type="date"
            value={projectData.prj_sdate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProjectData({ ...projectData, prj_sdate: e.target.value })}
            required
          />
          <TextField
            name="prj_edate"
            variant="outlined"
            label="結束日期"
            fullWidth
            type="date"
            value={projectData.prj_edate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProjectData({ ...projectData, prj_edate: e.target.value })}
            required
          />
          <FormControl fullWidth >
            <MultiSelect
              options={members.filter(item => item.value != user?.result?.mem_id)}
              value={selected}
              onChange={setSelected}
              className={classes.multiSelect}
              selectAllLabel={'全選'}
              overrideStrings={{
                "selectSomeItems": "選擇成員",
                "allItemsAreSelected": "All items are selected.",
                "selectAll": "Select All",
                "search": "關鍵字搜尋",
                "clearSearch": "Clear Search"
              }}
              labelledBy={'Select'}
              valueRenderer={customValueRenderer}
              filterOptions={filterOptions}
            />
            <FormLabel className={classes.label}>{selectedText}</FormLabel>
          </FormControl>

          <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setProjectData({ ...projectData, selectedFile: base64 })} /></div>
          <Button type="submit" className={classes.buttonSubmit} variant="contained" color="primary" size="large" fullWidth>{prj_id ? '存擋' : '建立'}</Button>
          <Button className={classes.buttonSubmit} variant="contained" color="secondary" size="small" onClick={() => { clear() }} fullWidth>清除</Button>
          
          {false && <div>
            <Fab onClick={() => { clear();history.goBack(); }} className={classes.fab} color="primary" aria-label="add">
            <ReplyIcon style={{ fontSize: 40 }} />
          </Fab>
            </div>}
            
        </form>
      </Paper>
    </Container>

  );
};

export default FromProject;
