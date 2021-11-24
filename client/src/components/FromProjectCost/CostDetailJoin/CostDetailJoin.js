import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import useStyles from './styles';

const CostDetailJoin = ({handelSetAmt,handelSetPm_item,costDetailJoin}) => {
  const classes = useStyles();
  const columns = [
    { id: 'name', label: '暱稱', minWidth: 50 },
    {
      id: 'pm_item',
      label: '項目',
      minWidth: 30,
    },
    {
      id: 'amt',
      label: '金額',
      minWidth: 45,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
  ];
  
  function createData(mem_id, name,pm_item, amt,pm_type) {
    console.log(pm_type);
    return { mem_id, name,pm_item, amt,pm_type };
  }
  const rows = [];
  costDetailJoin && costDetailJoin.map(item=>{
    rows.push( createData(item.mem_id,item.mem_name,item.pm_item,item.pm_amt,item.pm_type))
    return item;
  })
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" >
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {
                          (column.id === 'amt') ?
                            <TextField
                              name="amt"
                              required
                              InputProps={{startAdornment: <InputAdornment position="end">NT.</InputAdornment> }}
                              inputProps={{ min: 0, style: { textAlign: 'right' }}}
                              className={classes.textfield}
                              style={{margin:0}}
                              onChange={(e) => handelSetAmt(row.mem_id, e.target.value,row.pm_type)}
                              value={column.format && typeof value === 'number' ? column.format(value): value }
                            />
                            :
                            (column.id === 'pm_item')?
                            <TextField
                              name="pm_item"
                              required
                              
                              inputProps={{ min: 0, style: { textAlign: 'left' }}}
                              className={classes.textfield}
                              style={{margin:0}}
                              onChange={(e) => handelSetPm_item(row.mem_id, e.target.value,row.pm_type)}
                              value={ value }
                            />
                            :
                            column.format && typeof value === 'number' ? column.format(value) : value
                        }
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

export default CostDetailJoin;
