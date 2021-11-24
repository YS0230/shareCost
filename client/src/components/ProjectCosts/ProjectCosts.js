import React from 'react';
import { Grid, CircularProgress, Typography, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';

import ProjectCost from './ProjectCost/ProjectCost';
import useStyles from './styles';

const ProjectCosts = ({ onlySelf,onlyUnConfirm,statusCode}) => {
  const projectCosts = useSelector((state) => state.projectCosts.projectCosts);
  const classes = useStyles();
  const search = useSelector((state) => state.projects.search);
  const user = JSON.parse(localStorage.getItem('profile'));

  if (!projectCosts.length) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          尚無消費紀錄！
        </Typography>
      </Paper>
    );
  }

  projectCosts.sort(function (a, b) {
    return new Date(b.pc_date) - new Date(a.pc_date);
  });
  return (
      !projectCosts.length ? <CircularProgress className={classes.progress} /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        { projectCosts.filter(projectCost=>(onlySelf ? projectCost.db_ProjectCost_CostDetail.filter(detail=> detail.mem_id === user?.result?.mem_id).length >0 : true) && 
                                   (onlyUnConfirm ? projectCost.db_ProjectCost_CostDetail.filter(detail=> detail.mem_id === user?.result?.mem_id && detail.pm_confirm === 'N').length >0 : true) && 
                                   ((search.length >0) ? projectCost.pc_name.includes(String(search)) : true)  &&
                                   ((statusCode !== '0')? projectCost.pc_status === statusCode : true)
        ).sort(function (a, b) {
          console.log('a:'+a.prj_sdate);
          console.log('b:'+b.prj_sdate);
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.prj_sdate) - new Date(a.prj_sdate);
        }).map((projectCost) => (
            <Grid key={projectCost.pc_id} item xs={12} sm={6} md={6}>
              <ProjectCost projectCost={projectCost} />
            </Grid>
          ))
        }
      </Grid>
    )
  );
};

export default ProjectCosts;
