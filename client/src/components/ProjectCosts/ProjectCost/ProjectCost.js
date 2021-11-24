import React from 'react';
import { Card, CardActions, CardMedia, Button, Typography } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deleteProjectCost } from '../../../actions/projectCosts';
import useStyles from './styles';
import { codeTrans } from '../../../statusCode/statusCodeTrans';
import Chip from '@material-ui/core/Chip';
import AlertDialogSlide from '../../AlertDialogSlide/AlertDialogSlide';
import Swal from 'sweetalert2'

const ProjectCost = ({ projectCost }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const getFields = (input, field) => {
    var output = [];
    for (var i = 0; i < input.length; ++i) {
      output.push(input[i][field]);
    }
    return output;
  }
  
  const confirmDialog = ()=>{
     Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProjectCost(projectCost.prj_id, projectCost.pc_id, projectCost.pc_name));
      }
    })
  }
  
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={projectCost.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={projectCost.pc_name} />
      <div className={classes.overlay}>
        <Typography variant="body2">{moment(projectCost.pc_date).fromNow()}</Typography>
      </div>
      <div className={classes.overlay2}>
        <Button component={Link} to='/fromProjectCost' onClick={() => { localStorage.setItem('pc_id', projectCost.pc_id) }} style={{ color: 'white' }} size="small">
          <MoreHorizIcon fontSize="default" />
        </Button>
      </div>
      
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">
          {'墊付人員：'}{projectCost.db_ProjectCost_CostDetail &&
            getFields(projectCost.db_ProjectCost_CostDetail.filter(f=>f.pm_type==='1' && f.pm_confirm ==='Y'), 'mem_name')
              .map((item) => `✅${item} `)}
              {projectCost.db_ProjectCost_CostDetail &&
            getFields(projectCost.db_ProjectCost_CostDetail.filter(f=>f.pm_type==='1' && f.pm_confirm !=='Y'), 'mem_name')
              .map((item) => `${item} `)}
        </Typography>
        <div>
          <Chip className={classes.chip} variant="outlined" size="small" label={codeTrans(projectCost.pc_status)} />
        </div>
      </div>
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">
          {'參與人員：'}{projectCost.db_ProjectCost_CostDetail &&
            getFields(projectCost.db_ProjectCost_CostDetail.filter(f=>f.pm_type==='2' && f.pm_confirm === 'Y'), 'mem_name')
              .map((item) => `✅${item} `)}
              {projectCost.db_ProjectCost_CostDetail &&
            getFields(projectCost.db_ProjectCost_CostDetail.filter(f=>f.pm_type==='2' && f.pm_confirm !== 'Y'), 'mem_name')
              .map((item) => `${item} `)}
        </Typography>
      </div>
      <Typography className={classes.title} gutterBottom variant="h5" component="h2">{projectCost.pc_name}</Typography>
      <CardActions className={classes.cardActions}>
      <AlertDialogSlide projectCost={projectCost} />
        <Button size="small" color="secondary" onClick={(e) => { confirmDialog() }} >
          <DeleteIcon fontSize="small" /> 刪除
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCost;
