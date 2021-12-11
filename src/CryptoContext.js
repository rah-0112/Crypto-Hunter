import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from './firebase';

const Crypto = createContext();

const CryptoContext = ({children}) => {

    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹");
    const [user, setuser] = useState(null);
    const [coins, setcoins] = useState([]);
    const [alert, setAlert] = useState({
        open:false,
        message: "",
        type:"success",
    });
    const [watchlist, setwatchlist] = useState([]);

    useEffect(() => {
        if(user) {
            const coinRef = doc(db, "watchlist", user?.uid);

            var unsubscribe = onSnapshot(coinRef, (coin) => {
                if (coin.exists()) {
                    console.log(coin.data().coins);
                    setwatchlist(coin.data().coins);
                }
                else{
                    console.log("No Items in Watchlist");
                }
            });

            return () => {
                unsubscribe();
            };
        }
    }, [user]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) setuser(user);
            else setuser(null);

            console.log(user);
        });
    }, [])

    useEffect (() => {
        if(currency === "INR") setSymbol("₹");
        else if(currency === "USD") setSymbol("$");
    }, [currency]);

    return (
        <Crypto.Provider 
            value={{
                currency,
                symbol,
                setCurrency,
                alert,
                setAlert,
                user,
                watchlist,
                coins,
                setcoins
            }}
        >
            {children}
        </Crypto.Provider>
    )
}

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
};