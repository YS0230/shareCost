import React from 'react';
import { Card, CardActions, CardMedia, Button, Typography } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom'
import { deleteProject,projectMemberConfirm,projectMemberCancel} from '../../../actions/projects';
import useStyles from './styles';
import Chip from '@material-ui/core/Chip';
import { codeTrans } from '../../../statusCode/statusCodeTrans'
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'

const Project = ({ project }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  
  const handConfirmClick = async(e,prj_id)=>{
    e.preventDefault();
    dispatch(projectMemberConfirm(prj_id));
    
  }
  const handCancelClick = async(e,prj_id)=>{
    e.preventDefault();
    dispatch(projectMemberCancel(prj_id));
    
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
      dispatch(deleteProject(project.prj_id, project.prj_name));
     }
   })
 }
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={project.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={project.prj_name} />
      <div className={classes.overlay}>
        <Typography variant="body2">{moment(project.prj_sdate).fromNow()}</Typography>
      </div>
      {(user?.result?.googleId === project?.prj_mem || user?.result?.mem_id === project?.prj_mem) && (
        <div className={classes.overlay2}>
          <Button component={Link} to='/fromProject' onClick={(e) => { localStorage.setItem('prj_id', project.prj_id) }} style={{ color: 'white' }} size="small">
            <MoreHorizIcon fontSize="default" />
          </Button>
        </div>
      )}
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">{project.db_Project_ProjectMember && project.db_Project_ProjectMember.map((item) => `#${item.mem_name} `)}</Typography>
        <div>
          {project.prj_status ==='090' &&
            <Chip className={classes.chip} variant="outlined" size="small" label={codeTrans(project.prj_status)} />
          }
        </div>
      </div>
      <Typography className={classes.title} gutterBottom variant="h5" component="h2">{project.prj_name}</Typography>
      <CardActions className={classes.cardActions}>
        {
          project.db_Project_ProjectMember.filter(f=>f.mem_id===user?.result?.mem_id && f.pm_confirm==='N').length>0 ?
          <div>
            <Button onClick={(e)=>{handConfirmClick(e,project.prj_id)}} variant="outlined" color="primary">
              確認
            </Button>
            <Button onClick={(e)=>{handCancelClick(e,project.prj_id)}} variant="outlined" color="secondary">
              退出
            </Button>
          </div>
          :
          <div>
            {(user?.result?.googleId === project?.prj_mem || user?.result?.mem_id === project?.prj_mem) && (
            <Button size="small" color="secondary" onClick={(e) => {  confirmDialog() }} >
              <DeleteIcon fontSize="small" /> 刪除
            </Button>
            )}
            <Button component={Link} to='/consumption' onClick={(e) => { localStorage.setItem('prj_id', project.prj_id);localStorage.setItem('prj_name', project.prj_name)} } variant="outlined">內容</Button>
          </div>
        }
        
        </CardActions>
    </Card>
  );
};

export default Project;
