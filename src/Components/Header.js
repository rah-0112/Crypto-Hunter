import { AppBar, Container, createTheme, makeStyles, 
        MenuItem, Select, ThemeProvider, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';

const useStyles = makeStyles(() => ({
    title:{
        flex: 1,
        color: "gold",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        cursor: "pointer",
    }
}))

const Header = () => {

    const classes = useStyles();
    const history = useHistory(); // pushes to particular page - react hook

    const { currency, setCurrency, user } = CryptoState();

    console.log(currency);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
        <AppBar color="transparent" position="static">
            <Container>
                <Toolbar>
                    <Typography className={classes.title} 
                    onClick={() => history.push("/")}
                    variant='h6'
                    >Crypto Hunter</Typography>

                    <Select variant='outlined' style={{
                        width: 100,
                        height: 40,
                        marginRight: 15}}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="INR">INR</MenuItem>
                    </Select>

                    { user ? <UserSidebar /> : <AuthModal />}

                </Toolbar>
            </Container>
        </AppBar>
        </ThemeProvider>
    );
}

export default Header;
