import React from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoginAlert = React.forwardRef(function LoginAlert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const Login=()=>{
    const navigate = useNavigate();

    const [loginData, setLoginData] = React.useState({
        "email": "",
        "password": ""
    });

    const [loginSnackbarData, setLoginSnackbarData] = React.useState({
        isOpenSnackbar: false,
        snackbarMessage: "",
        snackbarType: "info"
    });

    const [signingIn, setSigningIn] = React.useState(false);

    let loggedInUser;
    if (sessionStorage.userdetails) {
        loggedInUser = JSON.parse(sessionStorage.userdetails);
    }
    if (loggedInUser) {
        navigate('/');
    }

    const handleLoginCloseSnackbar = () => {
        setLoginSnackbarData({
            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarType: "info"
        });
    }

    const handleLogin = () => {
        let formData = new FormData();

        formData.append("email", loginData["email"]);
        formData.append("password", loginData["password"]);

        setSigningIn(true);
        fetch("http://localhost:9000/login",
        {
            method: "POST",
            body: formData
        }).then((res) => res.json()).then((data) => {
            console.log(data.message);
            if(data.success) {
                sessionStorage.setItem('userdetails',JSON.stringify(data["user"]));
                setLoginSnackbarData({
                    isOpenSnackbar: true,
                    snackbarMessage: data.message,
                    snackbarType: "success"
                });

                // let obj = JSON.parse(sessionStorage.userdetails);
                // console.log(obj)

                // let loggedInData = sessionStorage.getItem('userdetails');
                // if (loggedInData) {
                //     console.log(JSON.parse(loggedInData));
                // }
                
                setTimeout(function(){
                    navigate('/');
               }, 2000);
                
            } else {
                setLoginSnackbarData({
                    isOpenSnackbar: true,
                    snackbarMessage: data.message,
                    snackbarType: "error"
                });
            }
            setSigningIn(false);
        });        
    }

    const paperStyle={padding :40,height:'60vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}

    React.useEffect(()=> {
        return () => {
            setLoginData({
                "email": "",
                "password": ""
            });
        }
    }, []);

    console.log(loginData);

    const snackbarAction = (
        <React.Fragment>
          {/* <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button> */}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleLoginCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return(
        <>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}><AccountBoxIcon /></Avatar>
                     RIKTAM
                    <h2>Sign In</h2>
                </Grid>
                <TextField 
                    label='Email' 
                    placeholder='Enter email' 
                    variant="outlined" 
                    fullWidth 
                    required 
                    value={loginData["email"]}
                    style={{marginBottom: 20}}
                    onChange={(e)=> {
                        setLoginData({...loginData, "email": e.target.value})
                    }}
                />
                <TextField 
                    label='Password' 
                    placeholder='Enter password' 
                    type='password' 
                    variant="outlined" 
                    fullWidth 
                    required 
                    style={{marginBottom: 30}}
                    onChange={(e)=> {
                        setLoginData({...loginData, "password": e.target.value})
                    }}
                />
                <Button 
                    type='submit' 
                    color='primary' 
                    variant="contained" 
                    style={btnstyle} 
                    fullWidth
                    onClick={handleLogin}
                >
                    Sign in 
                    {signingIn &&
                    <CircularProgress style={{width: 20, height:20, marginLeft: 5}} color="inherit" />
                    }
                </Button>
                {/* <Typography >
                     <Link href="#" >
                        Forgot password ?
                </Link>
                </Typography> */}
                <Typography style={{marginTop: 10}}> Do you have an account ?
                     <Link href="/register" >
                        {" Sign Up "}
                    </Link>
                </Typography>
            </Paper>
        </Grid>
        <Snackbar 
            open={loginSnackbarData.isOpenSnackbar}
            autoHideDuration={6000}
            onClose={handleLoginCloseSnackbar}
            action={snackbarAction}
        >
            <LoginAlert onClose={handleLoginCloseSnackbar} severity={loginSnackbarData.snackbarType} sx={{ width: '100%' }}>
                {loginSnackbarData.snackbarMessage}
            </LoginAlert>
        </Snackbar>
        </>
    )
}

export default Login