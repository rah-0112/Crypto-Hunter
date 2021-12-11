import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../../firebase';

const Signup = ({ handleClose }) => {
    
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    
    const {alert,setAlert} = CryptoState();

    const handleSumbit = async() => {
        if(password !== confirmpassword){
            setAlert({
                open: true,
                message: 'Passwords Do Not Match',
                type: "error" 
            });
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log(result);

            setAlert({
                open: true,
                message: `Sign Up Successful. Welcome ${result.user.email}`,
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
            <TextField
                variant="outlined"
                type="password"
                label="Confirm Password"
                value={confirmpassword}
                onChange={(e) => setconfirmpassword(e.target.value)}
                fullWidth
            />
            <Button
                variant='contained'
                size='large'
                style={{ backgroundColor: "#EEBC1D" }}
                onClick={handleSumbit}
            >
                    SIGN UP
            </Button>
        </Box>
    );
}

export default Signup
