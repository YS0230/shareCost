import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PinnedSubheaderList from '../PinnedSubheaderList/PinnedSubheaderList';
import { projectCostConfirm} from '../../actions/projectCosts';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogSlide = ({projectCost}) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handConfirmClick = async(e)=>{
    e.preventDefault();
    dispatch(projectCostConfirm(projectCost.prj_id,projectCost.pc_id));
    setOpen(false);
  }
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        內容
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{projectCost.pc_name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component={'span'}>
            <PinnedSubheaderList db_projectCost_costDetail={projectCost.db_ProjectCost_CostDetail}/>
          </DialogContentText>
        </DialogContent>
        {
          projectCost.db_ProjectCost_CostDetail.filter(f=>f.mem_id === user?.result?.mem_id && f.pm_confirm !== 'Y').length > 0 &&
          <DialogActions>
          <Button onClick={(e)=>{handConfirmClick(e)}} variant="outlined" color="primary">
              確認
            </Button>
        </DialogActions>
        }
      </Dialog>
    </div>
  );
}
export default AlertDialogSlide;