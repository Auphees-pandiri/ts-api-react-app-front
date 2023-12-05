import React from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ApiClient from './Api/ApiClient';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



const RegisterAlert = React.forwardRef(function RegisterAlert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const Register = () => {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = React.useState({
        "name": "",
        "email": "",
        "address": "",
        "mobile": "",
        "dob": "",
        "password": ""
    });

    const [registerSnackbarData, setRegisterSnackbarData] = React.useState({
        isOpenSnackbar: false,
        snackbarMessage: "",
        snackbarType: "info"
      });

    const [isSigningup, setIsSigningup] = React.useState(false)

    let loggedInUser;
    if (sessionStorage.userdetails) {
        loggedInUser = JSON.parse(sessionStorage.userdetails);
    }
    if (loggedInUser) {
        navigate('/');
    }

    const handleRegisterCloseSnackbar = () => {
        setRegisterSnackbarData({
            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarType: "info"
        });
    }

    const handleChange = (prop, val) => {
        console.log(prop,val);
        let tempRegisterData = registerData;
        tempRegisterData[prop] = val;
        setRegisterData(tempRegisterData);
    }

    console.log(registerData)
    const paperStyle={padding :20,height:'100%',width:400, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}

    const handleSubmit = async () => {

        // const resp = await ApiClient.sendRequest("http://localhost:8000/register", "POST", {}, registerData);

        let formData = new FormData();

        formData.append("name", registerData["name"]);
        formData.append("email", registerData["email"]);
        formData.append("address", registerData["address"]);
        formData.append("mobile", registerData["mobile"]);
        formData.append("dob", registerData["dob"]);
        formData.append("password", registerData["password"]);

        setIsSigningup(true);
        fetch("http://localhost:9000/register",
        {
            method: "POST",
            body: formData
        }).then((res) => res.json()).then((data) => {
            console.log(data.message);
            if(data.success) {
                setRegisterSnackbarData({
                    isOpenSnackbar: true,
                    snackbarMessage: data.message,
                    snackbarType: "success"
                });
                setTimeout(function(){
                    navigate('/login');
               }, 2000);
                
            } else {
                setRegisterSnackbarData({
                    isOpenSnackbar: true,
                    snackbarMessage: data.message,
                    snackbarType: "error"
                });
            }
            setIsSigningup(false);
        });
    }

    React.useEffect(()=> {
        return () => {
            setRegisterData({
                "name": "",
                "email": "",
                "address": "",
                "mobile": "",
                "dob": "",
                "password": ""
            });
            setRegisterSnackbarData({
                isOpenSnackbar: false,
                snackbarMessage: "",
                snackbarType: "info"
            });
        }
    }, []);

    const snackbarAction = (
        <React.Fragment>
          {/* <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button> */}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleRegisterCloseSnackbar}
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
                    <h2>Sign Up</h2>
                </Grid>
                <TextField 
                    label='Name' 
                    placeholder='Enter name' 
                    variant="outlined" 
                    fullWidth 
                    required 
                    style={{marginBottom: 10}} 
                    value={registerData["name"]}
                    onChange={(e) => {
                        setRegisterData({...registerData, "name": e.target.value});
                    }}
                />
                <TextField 
                    label='Email' 
                    placeholder='Enter email' 
                    variant="outlined" 
                    fullWidth 
                    type="email"
                    required 
                    style={{marginBottom: 10}} 
                    onChange={(e) => {
                        setRegisterData({...registerData, "email": e.target.value});
                    }}
                    value={registerData["email"]}
                />
                <TextField 
                    label='Address' 
                    placeholder='Enter address' 
                    variant="outlined" 
                    fullWidth 
                    multiline 
                    rows={3} 
                    style={{marginBottom: 10}} 
                    onChange={(e) => {
                        setRegisterData({...registerData, "address": e.target.value});
                    }}
                    value={registerData["address"]}
                />
                <TextField 
                    label='Mobile' 
                    placeholder='Enter mobile no' 
                    variant="outlined" 
                    fullWidth 
                    style={{marginBottom: 10}} 
                    onChange={(e) => {
                        setRegisterData({...registerData, "mobile": e.target.value});
                    }} 
                    value={registerData["mobile"]}
                />
                <TextField 
                    label='DOB' 
                    placeholder='Enter dob' 
                    variant="outlined" 
                    fullWidth 
                    style={{marginBottom: 10}} 
                    onChange={(e) => {
                        setRegisterData({...registerData, "dob": e.target.value});
                    }} 
                    value={registerData["dob"]}
                />
                <TextField 
                    label='Password' 
                    placeholder='Enter password' 
                    type='password' 
                    variant="outlined" 
                    fullWidth 
                    required 
                    style={{marginBottom: 30}} 
                    onChange={(e) => {
                        setRegisterData({...registerData, "password": e.target.value});
                    }} 
                    value={registerData["password"]}
                />
                <Button 
                    type='submit' 
                    color='primary' 
                    variant="contained" 
                    style={btnstyle} 
                    fullWidth
                    onClick={handleSubmit}
                >
                    Sign Up
                </Button>
                <Typography style={{marginTop: 10}}> Already have an account ? 
                     <Link href="/login" >
                        {" Sign In"}
                    </Link>
                </Typography>
            </Paper>
        </Grid>
        <Snackbar 
            open={registerSnackbarData.isOpenSnackbar}
            autoHideDuration={6000}
            onClose={handleRegisterCloseSnackbar}
            action={snackbarAction}
        >
            <RegisterAlert onClose={handleRegisterCloseSnackbar} severity={registerSnackbarData.snackbarType} sx={{ width: '100%' }}>
                {registerSnackbarData.snackbarMessage}
            </RegisterAlert>
        </Snackbar>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isSigningup}
        >
            <CircularProgress style={{marginRight: 5}} color="inherit" /> signing up...
        </Backdrop>
        </>
    )
}

export default Register