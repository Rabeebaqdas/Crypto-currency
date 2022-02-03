import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Avatar } from '@material-ui/core';
import { CryptoState } from '../CryptoContext';
import { signOut } from '@firebase/auth';
import { auth, db } from '../firebase';
import { Comma } from './Carousel';
import { AiFillDelete } from 'react-icons/ai'
import { doc, setDoc } from '@firebase/firestore';


const useStyles = makeStyles({
    container: {
        width: 350,
        padding: 25,
        display: "flex",
        height: "100%",
        flexDirection: "column",
        fontFamily: "Monospace"

    },
    profile: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: "20px",

    },
    picture: {
        width: 200,
        height: 200,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "contain"
    },
    Logout: {
        height: "8%",
        width: "100%",
        backgroundColor: "#EEBC1D",
        marginTop: 20,
        "&:hover": {
            backgroundColor: "#EEBC1D",
        }
    },
    watchlist: {
        display: "flex",
        height: "40%",
        position: "fixed",
        bottom: 85,
        width: "20%",
        backgroundColor: "grey",
        borderRadius: 10,
        padding: 15,
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        fontWeight: "bold",
        overflowY: "scroll",

    },
    coin: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#EEBC1D",
        boxShadow: "0 0 3px black",

    }
});

export default function UserSidebar() {

    const { user, setAlert, coins, watchlist, symbol,value } = CryptoState();
    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };


    const logout = () => {
        signOut(auth);
        setAlert({
            open: true,
            message: "Logout Successfull",
            type: "success"
        })
        toggleDrawer(false);
    }


    const remove = async (coin) => {
        const coinRef = doc(db, "watchlist", user.uid);
        try {
            await setDoc(coinRef,
                { coins: watchlist.filter((watch) => watch !== coin.id) }
            );
            setAlert({
                open: true,
                message: `${coin.name} Removed from the Watchlist !`,
                type: "success"
            })
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error"
            })
        }


    }

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Avatar
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        onClick={toggleDrawer(anchor, true)}
                        style={{ height: 38, width: 38, cursor: "pointer", backgroundColor: "#EEBC1D" }} />
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        <div className={classes.container}>
                            <div className={classes.profile}>
                                <Avatar
                                    alt={user.displayName || user.email}
                                    src={user.photoURL}
                                    className={classes.picture}
                                />
                                <span style={{
                                    width: '100%',
                                    fontSize: 25,
                                    textAlign: "center",
                                    fontWeight: "bolder",
                                    wordWrap: "break-word"
                                }}>
                                    {user.displayName || user.email}
                                </span>
                                <div className={classes.watchlist}>
                                    <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>Watch List</span>
                                    {
                                        coins.map((coin) => {
                                            if (watchlist.includes(coin.id)) {
                                                return (
                                                    <div className={classes.coin}>
                                                        <span>{coin.name}</span>
                                                        <span style={{ display: "flex", gap: 8 }}>
                                                            {symbol}{Comma(coin.current_price.toFixed(2))}
                                                            <AiFillDelete style={{ cursor: "pointer", fontSize: 16 }} onClick={() => remove(coin)} />
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                            

                                </div>
                            </div>
                            <Button variant="contained" className={classes.Logout} onClick={logout}>Log Out</Button>
                        </div>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
