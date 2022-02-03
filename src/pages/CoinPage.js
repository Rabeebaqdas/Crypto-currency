import { Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CoinInfo from '../components/CoinInfo';
import ReactHTMLParser from 'react-html-parser';
import { Comma } from '../components/Carousel';
import { CryptoState } from '../CryptoContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useStyle = makeStyles((theme) => ({
    container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            alignItems: "center"
        }
    },
    sidebar: {
        width: "30%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 25,
        borderRight: "2px solid grey",
        [theme.breakpoints.down("md")]: {
            width: "100%"
        }
    },
    heading: {
        fontFamily: "montserrat",
        fontWeight: "bold",
        marginBottom: 20,
    },
    description: {
        width: "100%",
        fontFamily: "montserrat",
        padding: 25,
        paddingTop: 0,
        textAlign: "justify"
    },
    market: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
            display: "flex",
            alignItems: "center",
            flexDirection:"column"
            
        },
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
            alignItems: "start",
        },
    }
}))

const CoinPage = () => {
    const classes = useStyle();
    const [coin, setCoin] = useState([]);
    const { id } = useParams();

    const { symbol, currency, user, watchlist, setAlert } = CryptoState();

    useEffect(() => {
        const fetchCoin = async () => {
            const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
            const res = await data.json();
            setCoin(res);
        }
        fetchCoin();
    }, [])

    const inWatchlist = watchlist.includes(coin?.id);

    const addToWatchList = async() => {
        const coinRef = doc(db,"watchlist",user.uid);
        try{
            await setDoc(coinRef,
              {coins:watchlist ? [...watchlist,coin.id] : coin.id}
                );
                setAlert({
                    open:true,
                    message:`${coin.name} Added to the Watchlist !`,
                    type:"success"
                })
        } catch(error){
            setAlert({
                open:true,
                message:error.message,
                type:"error"
            })
        }

    }
    
    const removeFromWatchlist = async() => {
        const coinRef = doc(db,"watchlist",user.uid);
        try{
            await setDoc(coinRef,
              {coins:watchlist.filter((watch)=> watch !== coin.id) }
                );
                setAlert({
                    open:true,
                    message:`${coin.name} Removed from the Watchlist !`,
                    type:"success"
                })
        } catch(error){
            setAlert({
                open:true,
                message:error.message,
                type:"error"
            })
        }

        
    }


    if (!coin) {
        return (
            <LinearProgress style={{ backgroundColor: "gold" }} />
        );
    }
    return (
        <div className={classes.container}>
            <div className={classes.sidebar}>
                <img
                    src={coin?.image?.large}
                    alt={coin?.name}
                    height="200"
                    style={{ marginBottom: 20 }}
                />
                <Typography variant="h3" className={classes.heading}>
                    {coin?.name}
                </Typography>
                <Typography variant="subtitle1" className={classes.description}>
                    {ReactHTMLParser(coin?.description?.en.split(". ")[0])}
                </Typography>
                <div className={classes.marketData}>
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Rank:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography
                            variant="h5"
                            style={{
                                fontFamily: "Montserrat",
                            }}
                        >
                            {coin?.market_cap_rank}
                        </Typography>
                    </span>

                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Current Price:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography
                            variant="h5"
                            style={{
                                fontFamily: "Montserrat",
                            }}
                        >
                            {symbol}{" "}
                            {Comma(
                                coin?.market_data?.current_price[currency.toLowerCase()]
                            )}
                        </Typography>
                    </span>
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Market Cap:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography
                            variant="h5"
                            style={{
                                fontFamily: "Montserrat",
                            }}
                        >
                            {symbol}{" "}
                            {Comma(
                                coin?.market_data?.market_cap[currency.toLowerCase()]
                                    ?.toString()
                                    .slice(0, 6)
                            )}
                            M
                        </Typography>
                    </span>
                    {user && (<Button variant="outlined" style={{width:"100%" , height:40 , backgroundColor:inWatchlist?"red":"#EEBC1D" }} onClick={inWatchlist?removeFromWatchlist:addToWatchList}>
                       {inWatchlist ? "Remove from watchlist": "Add to watchlist"}
                    </Button>)}
                </div>
            </div>
            <CoinInfo id={id}/>
        </div>

    )

}
export default CoinPage;