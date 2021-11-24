import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: '120px',
    right: '50px',
    'z-index':999
  },
  fabReply: {
    position: 'fixed',
    bottom: '50px',
    right: '50px',
    'z-index':999
  }
}));
