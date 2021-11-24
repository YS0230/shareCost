
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  label: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(1 + 1),
    height: '100%'
  },
  container: {
    maxHeight: 240,
  },
  textfield: {
    height: 20
  }
}));
