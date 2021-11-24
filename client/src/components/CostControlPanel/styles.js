import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    padding: '10px 50px',
  },
  FormGroup:{
    justifyContent: 'center',
  },
  FormControlLabel:{
    margin: '0px 4px 0px 0px',
  },
  prj_name:{
    fontSize: '23px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '-11px',
    marginRight: '16px',
    verticalAlign: 'middle',
    '-webkit-tap-highlight-color': 'transparent',
    'justify-content': 'center'
  }
}));
