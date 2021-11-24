import React from 'react';
import { Grid, CircularProgress, Typography, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Project from './Project/Project';
import useStyles from './styles';

const Projects = ({ onlySelfProject,onlyUnConfirm,statusCode }) => {
  const projects = useSelector((state) => state.projects.projects);
  const search = useSelector((state) => state.projects.search);
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  if (!projects.length) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          尚無行程紀錄！
        </Typography>
      </Paper>
    );
  }


  projects.sort(function (a, b) {
    return new Date(b.prj_sdate) - new Date(a.prj_sdate);
  });
  return (
      !projects.length ? <CircularProgress className={classes.progress} /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        
        { projects.filter(project=>(onlySelfProject ? user?.result?.mem_id === project?.prj_mem : true) && 
                                   (onlyUnConfirm ? project.db_Project_ProjectMember.filter(member=> member.mem_id === user?.result?.mem_id && member.pm_confirm === 'N').length >0 : true) && 
                                   ((search.length >0) ? project.prj_name.includes(String(search)) : true)  &&
                                   ((statusCode !== '0')? project.prj_status === statusCode : true)
        ).map((project) => (
          <Grid key={project.prj_id} item xs={12} sm={6} md={6}>
            <Project project={project} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Projects;
