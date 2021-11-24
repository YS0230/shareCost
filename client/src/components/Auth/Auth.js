import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
//import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


//import Icon from './icon';
import { signin, signup } from '../../actions/auth';
//import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = { mem_name: '', mem_email: '', mem_pass: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (form.mem_pass === form.confirmPassword) {
        dispatch(signup(form, history));
      }
      else {
        toast.warn("兩組密碼不同!");
      }

    } else {
      dispatch(signin(form, history));
    }


  };

  //const googleSuccess = async (res) => {
  //  const result = res?.profileObj;
  //  const token = res?.tokenId;
  //
  //  try {
  //    dispatch({ type: AUTH, data: { result, token } });
  //
  //    history.push('/');
  //  } catch (error) {
  //    console.log(error);
  //  }
  //};
  //
  //const googleError = () => alert('Google Sign In was unsuccessful. Try again later');
  //const responseGoogle = (response) => {
  //  console.log(response);
  //};
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
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
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{isSignup ? '註冊' : '登入'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input name="mem_name" value={form.mem_name} label="暱稱" handleChange={handleChange} autoFocus />
              </>
            )}
            <Input name="mem_email" value={form.mem_email} label="信箱" handleChange={handleChange} type="email" />
            <Input name="mem_pass" value={form.mem_pass} label="密碼" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name="confirmPassword" value={form.confirmPassword} label="密碼確認" handleChange={handleChange} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? '註冊' : '登入'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? '已有帳號? 點我進行登入' : "還沒有帳號? 點我進行註冊"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
