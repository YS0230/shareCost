
import { fade, makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar:{
    borderRadius: 15,
    margin: '30px 0',
    padding: '10px 20px',
    backgroundColor: '#FFF',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'rgba(0,0,0, 1)',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: 'rgba(0,0,0, 1)',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(0,0,0, 1)',
  },
  inputRoot: {
    //color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    color: 'rgba(0,0,0, 1)',
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    color: 'rgba(0,0,0, 1)',
  },
  userName:{
    color: 'rgba(0,0,0, 1)',
  }
}));