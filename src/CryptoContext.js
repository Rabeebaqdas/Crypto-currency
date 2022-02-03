import { onAuthStateChanged } from '@firebase/auth';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth,db } from './firebase';
import { doc,onSnapshot } from 'firebase/firestore';


const Context = createContext();

const CryptoContext = ({ children }) => {
    const [currency,setCurrency] = useState("USD");
    const [symbol,setSymbol] = useState("$");
    const [user, setUser] = useState(null);
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [watchlist,setWatchlist] = useState([]);
    const [alert,setAlert] = useState({open:false,message:"",type:""});


    useEffect(()=>{
    if(user){
        const coinRef = doc(db,"watchlist",user.uid);

        var unsubscribe = onSnapshot(coinRef,coin=>{
            if(coin.exists()){
                setWatchlist(coin.data().coins);
            }else{
                console.log("No item in watchlist");
            }
        })
        return () => {
            unsubscribe();
        }
    }

    },[user])

     
    useEffect(() => {
        const fetchCoins = async () => {
            setLoading(true);
            const data = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
            const res = await data.json();
            setCoins(res);
            setLoading(false);
        }
        fetchCoins()
    }, [currency])

    
    useEffect(()=>{
        onAuthStateChanged(auth,user=>{
            if(user) {
                setUser(user);
            }else{
                setUser(null);
            }
        })
    },[])
    useEffect(()=>{
        if(currency === "USD") setSymbol("$")
        else if (currency === "PKR") setSymbol("Rs. ")
        else setSymbol(currency + " ")
    },[currency])
    return (
        <Context.Provider value={{currency,symbol,setCurrency,alert,setAlert,user,watchlist,coins,loading}}>
            {children}
        </Context.Provider>
    )
}

export default CryptoContext;

export const CryptoState = () => {
  return  useContext(Context);
}
