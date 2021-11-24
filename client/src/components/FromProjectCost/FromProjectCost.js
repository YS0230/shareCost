import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Container } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';

import { createProjectCost, updateProjectCost } from '../../actions/projectCosts';
import useStyles from './styles';
import { useHistory } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

import FormControl from '@material-ui/core/FormControl';
import MultiSelect from "react-multi-select-component";
import FormLabel from '@material-ui/core/FormLabel';

import * as api from '../../api/index.js';


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReplyIcon from '@material-ui/icons/Reply';

import CostDetailPay from './CostDetailPay/CostDetailPay'
import CostDetailJoin from './CostDetailJoin/CostDetailJoin'

const FromProjectCost = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  var today = new Date().toISOString().substring(0, 10);

  const prj_id = localStorage.getItem('prj_id');
  const pc_id = localStorage.getItem('pc_id');
  const initProjectCostData = { pc_name: '', pc_date: '', pc_amount: 0, pc_mem: user?.result?.mem_id, db_ProjectCost_CostDetail: [] };
  const [projectCostData, setProjectCostData] = useState(initProjectCostData);
  const [projectCost, setProjectCost] = useState(useSelector((state) => (pc_id ? state.projectCosts.projectCosts.find((projectCost) => projectCost.pc_id === pc_id) : null)));
  const dispatch = useDispatch();
  const classes = useStyles();

  const [selectedPay, setSelectedPay] = useState([]);
  const [selectedJoin, setSelectedJoin] = useState([]);
  const [projectMembers, setProjectＭembers] = useState([]);
  const history = useHistory();
  const customPayValueRenderer = (selected, _options) => {
    return selected.length
      ? "墊付成員 共" + selected.length + "位"
      : "墊付成員";
  };
  const customJoinValueRenderer = (selected, _options) => {
    return selected.length
      ? "消費成員 共" + selected.length + "位"
      : "消費成員";
  };
  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(({ label }) => label && label.match(re));
  }
  const getProjectCost = async (prj_id, pc_id) => {
    try {
      const { data } = await api.fetchProjectCost(prj_id, pc_id);
      setProjectCost(data);
    } catch (error) {
      console.log(error);
      toast.warn(error.response);
    }
  };
  useEffect(() => {
    if (projectCost) {
      setProjectCostData(projectCost);
      let selectItem = [];
      projectCost.db_ProjectCost_CostDetail && projectCost.db_ProjectCost_CostDetail.filter(f => f.pm_type === '1').map(data => {
        selectItem.push({
          'label': data.mem_name,
          'value': data.mem_id
        })
        return data;
      })
      setSelectedPay(selectItem);
      selectItem = [];
      projectCost.db_ProjectCost_CostDetail && projectCost.db_ProjectCost_CostDetail.filter(f => f.pm_type === '2').map(data => {
        selectItem.push({
          'label': data.mem_name,
          'value': data.mem_id
        })
        return data;
      })
      setSelectedJoin(selectItem);
    } else {
      getProjectCost(prj_id, pc_id);
    }
  }, [projectCost]);

  useEffect(() => {
    let addItem = [];
    selectedPay.map(data => {
      addItem.push({ 'mem_id': data.value, 'mem_name': data.label, 'pm_amt': projectCostData.db_ProjectCost_CostDetail.filter(f => f.mem_id === data.value && f.pm_type === '1')[0]?.pm_amt || 0, 'pm_type': '1' })
      return data;
    })
    selectedJoin.map(data => {
      let item = projectCostData.db_ProjectCost_CostDetail.filter(f => f.mem_id === data.value && f.pm_type === '2')[0];
      addItem.push({ 'mem_id': data.value, 'mem_name': data.label, 'pm_item': item?.pm_item, 'pm_amt': item?.pm_amt || 0, 'pm_type': '2' })
      return data;
    })
    setProjectCostData({ ...projectCostData, db_ProjectCost_CostDetail: addItem });

  }, [selectedPay, selectedJoin]);

  useEffect(() => {
    getProjectMembers(prj_id);
    //setProjectCostData(initProjectCostData);
  }, []);

  const getProjectMembers = async (prj_id) => {
    try {
      const { data } = await api.fetchProjectMembers(prj_id);
      setProjectＭembers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const clear = () => {
    setProjectCostData(initProjectCostData);
    setSelectedPay([]);
    setSelectedJoin([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let pay = SumDatareduce(projectCostData.db_ProjectCost_CostDetail.filter(f => f.pm_type === '1').map(item => item.pm_amt));
    let join = SumDatareduce(projectCostData.db_ProjectCost_CostDetail.filter(f => f.pm_type === '2').map(item => item.pm_amt));
    if(!pay){
      toast.warn('請選擇墊付成員');
    }else if(!join){
      toast.warn('請選擇參與成員');
    }
    else if (pay === join) {
      if (pc_id) {
        dispatch(updateProjectCost(prj_id, pc_id, { ...projectCostData, name: user?.result?.mem_name }, history));
      } else {
        dispatch(createProjectCost({ ...projectCostData, name: user?.result?.mem_name, prj_id: prj_id }, history));
        clear(true);
      }
    } else {
      toast.warn('墊付金額與消費金額不相等');
    }


  };

  const handelSetAmt = (mem_id, pm_amt, pm_type) => {
    var re = /^[0-9]+$/;
    if (pm_amt.length !== 0 && !re.test(pm_amt.replace(',', ''))) {
      toast.warn('請輸入數字')
    } else {
      console.log(pm_type);
      let amount = 0;
      const editItems = projectCostData.db_ProjectCost_CostDetail.map(item => {
        if (item.mem_id === mem_id && item.pm_type === pm_type) {
          console.log(pm_amt);
          item.pm_amt = parseInt(pm_amt.replace(',', '')) || 0;
        }
        if (item.pm_type === '1') {
          amount += item.pm_amt;
        }
        return item;
      })
      setProjectCostData({ ...projectCostData, pc_amount: amount, db_ProjectCost_CostDetail: editItems });
    }
  }
  const handelSetPm_item = (mem_id, pm_item, pm_type) => {
    const editItems = projectCostData.db_ProjectCost_CostDetail.map(item => {
      if (item.mem_id === mem_id && item.pm_type === pm_type) {
        item.pm_item = pm_item;
      }
      return item;
    })
    setProjectCostData({ ...projectCostData, db_ProjectCost_CostDetail: editItems });
  }

  const SumDatareduce = (arr) => {
    if (arr && arr.length > 0) {
      return arr.reduce((a, b) => a + b);
    }

  }
  if (!user?.result?.mem_name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          請先登入
        </Typography>
      </Paper>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      {console.log('testestest')}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Paper className={classes.paper}>
        <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
          <Typography variant="h6">{pc_id ? '編輯消費' : '新增消費'}</Typography>

          <TextField
            name="prj_name" variant="outlined" required label="消費店家" fullWidth={true}
            value={projectCostData.pc_name}
            onChange={(e) => setProjectCostData({ ...projectCostData, pc_name: e.target.value })}
          />
          <TextField
            name="pc_date" variant="outlined" label="消費日期" fullWidth={true} type="date" required
            value={projectCostData.pc_date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setProjectCostData({ ...projectCostData, pc_date: e.target.value })}
          />
          <FormLabel  className={classes.labelAmount} 
            children={'消費金額 NT$. ' + projectCostData.pc_amount} >
          </FormLabel>

          <FormControl fullWidth={true} >
            <MultiSelect
              options={projectMembers}
              value={selectedPay}
              onChange={setSelectedPay}
              className={classes.multiSelect1}
              selectAllLabel={'全選'}
              overrideStrings={{
                "selectSomeItems": "墊付成員",
                "allItemsAreSelected": "All items are selected.",
                "selectAll": "Select All",
                "search": "關鍵字搜尋",
                "clearSearch": "Clear Search"
              }}
              labelledBy={'Select'}
              valueRenderer={customPayValueRenderer}
              filterOptions={filterOptions}
            />
            <CostDetailPay
              handelSetAmt={handelSetAmt}
              costDetailPay={projectCostData.db_ProjectCost_CostDetail && projectCostData.db_ProjectCost_CostDetail.filter(f => f.pm_type === '1')}
            ></CostDetailPay>
            <FormLabel className={classes.labelPc_amtPay}>{'墊付金額 NT$. ' + SumDatareduce(projectCostData.db_ProjectCost_CostDetail?.filter(f => f.pm_type === '1').map(item => item.pm_amt))}</FormLabel>
          </FormControl>

          <FormControl fullWidth={true} >
            <MultiSelect
              options={projectMembers}
              value={selectedJoin}
              onChange={setSelectedJoin}
              className={classes.multiSelect2}
              selectAllLabel={'全選'}
              overrideStrings={{
                "selectSomeItems": "消費成員",
                "allItemsAreSelected": "All items are selected.",
                "selectAll": "Select All",
                "search": "關鍵字搜尋",
                "clearSearch": "Clear Search"
              }}
              labelledBy={'Select'}
              valueRenderer={customJoinValueRenderer}
              filterOptions={filterOptions}
            />
            <CostDetailJoin
              handelSetAmt={handelSetAmt}
              handelSetPm_item={handelSetPm_item}
              costDetailJoin={projectCostData.db_ProjectCost_CostDetail && projectCostData.db_ProjectCost_CostDetail.filter(f => f.pm_type === '2')}
            ></CostDetailJoin>
            <FormLabel className={classes.labelPc_amtPay}>{'消費金額 NT$. ' + SumDatareduce(projectCostData.db_ProjectCost_CostDetail?.filter(f => f.pm_type === '2').map(item => item.pm_amt))}</FormLabel>
          </FormControl>

          <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setProjectCostData({ ...projectCostData, selectedFile: base64 })} /></div>
          <Button type="submit" className={classes.buttonSubmit} variant="contained" color="primary" size="large" fullWidth={true}>{pc_id ? '存擋' : '建立'}</Button>
          <Button className={classes.buttonSubmit} variant="contained" color="secondary" size="small" onClick={() => { clear(false) }} fullWidth={true}>清除</Button>
          {false && <div>
            <Fab onClick={() => { clear(true); history.goBack(); localStorage.removeItem('pc_id'); }} className={classes.fab} color="primary" aria-label="add">
              <ReplyIcon style={{ fontSize: 40 }} />
            </Fab>
          </div>}
        </form>
      </Paper>
    </Container>

  );
};

export default FromProjectCost;
