import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid , Typography, Paper,CircularProgress} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getProjectCosts } from '../../actions/projectCosts';
import ProjectCosts from '../ProjectCosts/ProjectCosts'
import CostControlPanel from '../CostControlPanel/CostControlPanel'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStyles from './styles';


const Consumption = () => {
  const [isLoading, setisLoading] = useState(true);
  const dispatch = useDispatch();
  const [onlySelf, setOnlySelf] = useState(false);
  const [onlyUnConfirm, setOnlyUnConfirm] = useState(false);
  const [statusCode, setStatusCode] = useState('0')
  const prj_id = localStorage.getItem('prj_id');
  const user = JSON.parse(localStorage.getItem('profile'));

  const classes = useStyles();

  useEffect(() => {
    dispatch(getProjectCosts(prj_id,setisLoading));
  }, [dispatch]);
  
  if (!user?.result?.mem_name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          請登入。
        </Typography>
      </Paper>
    );
  }

  return (
    (isLoading ? <CircularProgress className={classes.progress} />: <Container>
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
      <Grow in>
        <Container>
          {console.log('home')}
          <Grid container justify="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={12}>
              <CostControlPanel onlySelf={onlySelf} setOnlySelf={setOnlySelf} onlyUnConfirm={onlyUnConfirm} setOnlyUnConfirm={setOnlyUnConfirm} statusCode={statusCode} setStatusCode={setStatusCode} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <ProjectCosts onlySelf={onlySelf} onlyUnConfirm={onlyUnConfirm} statusCode={statusCode} />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </Container>
    ));
};

export default Consumption;
