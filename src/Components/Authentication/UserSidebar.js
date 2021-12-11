import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { CryptoState } from '../../CryptoContext';
import { Avatar } from '@material-ui/core';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { numberWithCommas } from '../Banner/Carousel';
import { AiFillDelete } from 'react-icons/ai';
import { doc, setDoc } from 'firebase/firestore';

const useStyles = makeStyles({
  container: {
      width: 350,
      padding: 25,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "monospace",
  },
  profile:{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      height: "92%",    
  },
  picture: {
      width: 200,
      height: 200,
      cursor: "pointer",
      backgroundColor: "#EEBC1D",
      objectFit: "contain",
  },
  logout: {
      height: "8%",
      backgroundColor: "#EEBC1D",
      width: "100%",
      marginTop: 20,
  },
  watchlist:{
      flex: 1,
      width: "100%",
      backgroundColor: "grey",
      borderRadius: 10,
      padding:15,
      paddingTop: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      overflowY: "scroll",
  },
  coin: {
      padding: 10,
      borderRadius: 5,
      color: "black",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#EEBC1D",
      boxShadow: "0 0 3px black",
    },
});

export default function UserSidebar() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false,
    });

    const {user, setAlert, watchlist, coins, symbol} = CryptoState();

    const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
    };

    const removeFromWatchlist = async(coin) => {
        const coinRef = doc(db, "watchlist", user.uid);

        try {
            await setDoc(
                coinRef,
                {
                coins: watchlist.filter((watch) => watch !== coin?.id),
                },
                { merge: "true" }
            );

            setAlert({
                open: true,
                message: `${coin.name} Removed From WatchList !`,
                type: "success",
            });
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error",
            });
            return;
        }
    }

    const LogOut = () => {
        signOut(auth);

        setAlert({
            open: true,
            type: "success",
            message: "Logout SuccesFull !",
        });

        toggleDrawer();
    };    


    return (
        <div>
        {['right'].map((anchor) => (
            <React.Fragment key={anchor}>
                <Avatar 
                    onClick={toggleDrawer(anchor, true)}
                    style={{
                        height: 38,
                        width: 38,
                        cursor: "pointer",
                        backgroundColor: "#EEBC1D",
                    }}
                    src={user.photoURL ? user.photoURL : "https://www.iconpacks.net/icons/2/free-cryptocurrency-coin-icon-2422-thumb.png"}
                    alt={user.displayName}
                />
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
            >
                <div className={classes.container}>
                    <div className={classes.profile}>
                        <Avatar 
                            onClick={toggleDrawer(anchor, true)}
                            src={user.photoURL ? user.photoURL : "https://www.iconpacks.net/icons/2/free-cryptocurrency-coin-icon-2422-thumb.png"}
                            alt={user.displayName}
                            className={classes.picture}
                        />
                        <span
                            style={{
                                width: "100%",
                                fontSize: 25,
                                textAlign: "center",
                                fontWeight: "bolder",
                                wordWrap: "break-word",
                            }}
                        >
                            {user.displayName || user.email}
                        </span>
                        <div className={classes.watchlist}>
                            <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                                WatchList
                            </span>

                            {coins.map((coin) => {
                                if(watchlist.includes(coin.id))
                                {
                                    return(
                                        <div className={classes.coin}>
                                            <span>{coin.name}</span>
                                            <span style={{ display: "flex", gap: 8 }}>
                                                { symbol }
                                                {numberWithCommas(coin.current_price.toFixed(2))}
                                                <AiFillDelete
                                                    style={{ cursor: 'pointer' }}
                                                    fontSize="16"
                                                    onClick={() => removeFromWatchlist(coin)}
                                                />
                                            </span>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <Button
                        variant='contained'
                        className={classes.logout}
                        onClick={LogOut}
                    >
                        Log Out
                    </Button>
                </div>
            </Drawer>
            </React.Fragment>
        ))}
        </div>
    );
    }
