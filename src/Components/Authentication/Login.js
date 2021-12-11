import React, { useState } from 'react'
import { Box, Button, TextField } from '@material-ui/core';
import { CryptoState } from '../../CryptoContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const Login = ({ handleClose }) => {
    
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const {setAlert}= CryptoState();

    const handleSumbit = () => {
        if( !email || !password ){
            setAlert({
                open: true,
                message: "Please Fill All The Fields",
                type: "error"
            });
            return;
        }

        try {
            const result = signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log(result);

            setAlert({
                open: true,
                message: `Login Successful. Welcome ${result.user.email}`,
                type: "success",
            });

            handleClose();

        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error",
            });
            return;  
        }
    };

    

    return (
        <Box
            p={3}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
            <TextField
                variant="outlined"
                type="email"
                label="Enter Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                fullWidth
            />
            <TextField
                variant="outlined"
                type="password"
                label="Enter Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                fullWidth
            />
            <Button
                variant='contained'
                size='large'
                style={{ backgroundColor: "#EEBC1D" }}
                onClick={handleSumbit}
            >
                LOGIN
            </Button>
        </Box> 
    );
}

export default Login;
