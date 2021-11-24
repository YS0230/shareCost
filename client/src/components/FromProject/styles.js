
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
  multiSelect: {
    margin: theme.spacing(1),
  },
  label: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(1+1),
  }
}));