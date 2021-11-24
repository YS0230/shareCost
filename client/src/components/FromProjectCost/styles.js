
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
  fab: {
    position: 'fixed',
    bottom: '50px',
    right: '50px'
  },
  multiSelect1: {
    margin: theme.spacing(1),
    zIndex: 4,
  },
  multiSelect2: {
    margin: theme.spacing(1),
    zIndex: 3,
  },
  labelAmount: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(1),
    textAlign: 'left',
    width: '100%'
  },
  label: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(1+1),
  },
  labelPc_amtPay:{
    margin: theme.spacing(1),
    marginRight: theme.spacing(1+1),
    textAlign: 'right',
  }
}));
