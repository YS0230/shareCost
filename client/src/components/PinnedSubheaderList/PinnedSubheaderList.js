import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  self:{
    color:'#FF0000',
  }
}));

const PinnedSubheaderList = ({db_projectCost_costDetail}) => {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const payList = db_projectCost_costDetail.filter(f=>f.pm_type === '1');
  const joinList = db_projectCost_costDetail.filter(f=>f.pm_type === '2');
  const lists =[{id:'1',title:'墊付者',items:payList},{id:'2',title:'消費者',items:joinList}]
  return (
    <List className={classes.root} subheader={<li />}>
      {lists.map((list) => (
        <li key={`section-${list.id}`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader>{list.title}</ListSubheader>
            {list.items.map((item) => (
              <ListItem key={`item-${item.pc_id}-${item.pm_type}-${item.mem_id}`}>
                <ListItemText className={item.mem_id === user?.result?.mem_id ? classes.self:""} primary={`${item.mem_name} ${item.pm_item}  ${item.pm_amt} 元`}  />
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}
export default PinnedSubheaderList;
