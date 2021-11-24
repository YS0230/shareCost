import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as api from '../../api/index.js';

const calculate = (cols,rows,setColumns,setRows)=>{
  console.log(cols.data);
  console.log(rows.data);
  var colsData = JSON.parse(JSON.stringify(cols.data));
  var rowsData = JSON.parse(JSON.stringify(rows.data));

  var pid = [];
  var money = [];
  colsData.sort(function (a, b) {
    return a.value - b.value;
  });

  const columns = [{ id: '0', label: '左給右', minWidth: 30 }];
  colsData.map((item)=>{
    columns.push(createColumn(item.value,item.label));
    pid.push({index:item.value,label:item.label});
    money.push(0);
    }
  )
  setColumns(columns);
  pid.map(pidItem=>{
    rowsData.map(dateItem=>{
      dateItem.db_ProjectCost_CostDetail.filter(f=>f.pm_type === '2' && pidItem.index === f.mem_id).map(targrt=>{
        money[pid.indexOf(pidItem)] -= parseInt(targrt.pm_amt)
      })
    })
  })
 
  pid.map(pidItem=>{
    rowsData.map(dateItem=>{
      dateItem.db_ProjectCost_CostDetail.filter(f=>f.pm_type==='1' && pidItem.index === f.mem_id).map(targrt=>{
        money[pid.indexOf(pidItem)] += parseInt(targrt.pm_amt)
      })
    })
  })
  var creditors = [];
  var debts = [];
  for (var i = 0; i < pid.length; i++) {
      var person = new Object();
      person.pid = pid.indexOf(pid[i])+1;
      person.money = Math.abs(money[i]);
      if (money[i] > 0) creditors.push(person);
      if (money[i] < 0) debts.push(person);
  }

  var rows = [];
  for (var i = 0; i < pid.length; i++) {
      var row = [pid[i].label];
      for (var j = 0; j < pid.length; j++) row.push(0);
      rows.push(row);
  }
  for (var i = 0; i < debts.length; i++) {
      var money = debts[i].money;
      for (var j = 0; j < creditors.length; j++) {
          if (money == 0 || creditors[j].money == 0) continue;
          if (money >= creditors[j].money) {
              console.log(debts[i].pid + '給' + creditors[j].pid + ': ' + creditors[j].money + '元');
              rows[debts[i].pid - 1][creditors[j].pid ] = creditors[j].money;
              money -= creditors[j].money;
              creditors[j].money = 0;
          }
          else if (money < creditors[j].money) {
              console.log(debts[i].pid + '給' + creditors[j].pid + ': ' + money + '元');
              rows[debts[i].pid - 1][creditors[j].pid ] = money;
              creditors[j].money -= money;
              money = 0;
          }
      }
  }
  console.log(rows)
  //rows.map((row)=>rows.push(createRow(row)))
  setRows(rows)

}
function createColumn(id, name) {
  return ({ 
    id:id,
    label:name,  
    minWidth: 30,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),});
}
function createRow(row) {
  const tmp = [];
  row.map(item => tmp.push(item))
  return tmp;
}


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const FinalTable = () =>{
  const classes = useStyles();
  const [columns,setColumns] = useState([])
  const [rows,setRows] = useState([])
  const prj_id = localStorage.getItem('prj_id');
  let colsData=[];
  let rowsData=[];
  useEffect(() => {
    getSource(prj_id)
  }, []);

  const getSource = async (prj_id) => {
    try {
      //const { projectCost } = await api.fetchProjectCosts(prj_id);
      //const { projectMember } = await api.fetchProjectMembers(prj_id);
      calculate(await api.fetchProjectMembers(prj_id),await api.fetchProjectCosts(prj_id),setColumns,setRows);
      //console.log(prj_id)
      //console.log(projectMember)
      //colsData=projectCost;
      //rowsData=projectMember;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {
                  columns.map((column, index) => {
                    const value = row[index];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
export default FinalTable;
