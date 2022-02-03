import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import Login from './Login';
import SignUp from './SignUp';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { auth, googleAuthProvider } from '../firebase';
import { CryptoState } from '../CryptoContext';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: 400, 
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
        color: "white",
        borderRadius: 10
    },
    google:{
        padding:24,
        paddingTop:0,
        display:"flex",
        flexDirection:"column",
        gap:20,
     fontWeight:500,
     textShadow:"0 0 5px black",
        textAlign:"center",
        fontSize:20
    }
}));

export default function Authmodal() {
    const [value, setValue] = useState(0);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const {setAlert} = CryptoState();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const loginWithGoogle = async() => {
    try{
        const result = await signInWithPopup(auth,googleAuthProvider);
        setAlert({
            open:true,
            message:`Login Successfull. Welcome  ${result.user.email}`,
            type:"success"
        })
        handleClose();
    }
    catch (error){
        setAlert({
            open:true,
            message:error.message,
            type:"error"
        })
        return;
    }
    }

    return (
        <div>
            <Button variant="contained"
                style={{
                    width: 85,
                    height: 40,
                    backgroundColor: "#EEBC1D"
                }}
                onClick={handleOpen}
            >
                Login
            </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <AppBar position="static" style={{ backgroundColor: "transparent", color: "white" }}>
                            <Tabs value={value} onChange={handleChange} style={{ borderRadius: 10,  alignSelf:"center" }} aria-label="simple tabs example">
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>
                        </AppBar>
                        {value === 0 && <Login  handleClose={handleClose} /> }
                        {value === 1 && <SignUp handleClose={handleClose} /> }
                        <Box className={classes.google}>
                        <span>OR</span>
                        <GoogleButton style={{width:"100%"}} onClick={loginWithGoogle} />
                        </Box>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
