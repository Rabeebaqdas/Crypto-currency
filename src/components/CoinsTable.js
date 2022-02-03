import { Container, createTheme, Table, TableCell, TableContainer, TableBody, TableHead, TableRow, TextField, ThemeProvider, Typography, LinearProgress, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { CryptoState } from '../CryptoContext';
import { Comma } from './Carousel';
import Pages from './Pagination';

const useStyle = makeStyles({
    rows: {
        backgroundColor:"#16171a",
        cursor: "pointer",
        fontFamily:"Montserrat",
        "&:hover":{
            backgroundColor:"#131111"
        }
    }
})


const CoinsTable = () => {

    const classes = useStyle();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [page,setpage] = useState(1);
    const { symbol,coins,loading } = CryptoState();

    const dark = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: "dark"
        }
    })

    const handleSearch = () => {
        return coins.filter((coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    };
    return (
        <ThemeProvider theme={dark}>
            <Container style={{ textAlign: "center" }}>
                <Typography variant="h4" style={{ fontFamily: "Montserrat", margin: 18 }}>
                    Cryptocurrency Prices By Market Cap
                </Typography>
                <TextField label="Search for a Crypto Currency..." variant="outlined"
                    style={{ marginBottom: 20, width: "100%" }} onChange={(e) => setSearch(e.target.value)} />

                <TableContainer >
                    {
                        loading ? (
                            <LinearProgress style={{ backgroundColor: "gold" }} />
                        )
                            :
                            (
                                <Table aria-label="simple table">
                                    <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                        <TableRow>
                                            <TableCell style={{ color: "black", fontWeight: "700", fontFamily: "montserrat" }}>Coin</TableCell>
                                            <TableCell style={{ color: "black", fontWeight: "700", fontFamily: "montserrat" }} align="right">Price</TableCell>
                                            <TableCell style={{ color: "black", fontWeight: "700", fontFamily: "montserrat" }} align="right">24h Change</TableCell>
                                            <TableCell style={{ color: "black", fontWeight: "700", fontFamily: "montserrat" }} align="right">Market Cap</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {
                                            handleSearch().slice((page-1)*10 , (page-1)*10+10).map((row) => {
                                                let profit = row.price_change_percentage_24h > 0;
                                                return (
                                                    <TableRow className={classes.rows} key={row.name} onClick={() => navigate(`/coins/${row?.id}`)}>
                                                        <TableCell component="th" scope="row" style={{ display: "flex", gap: 15 }}>
                                                            <img src={row.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <span style={{ textTransform: "uppercase", fontSize: 22 }}>{row.symbol}</span>
                                                                <span style={{ color: "darkgray" }}>{row.name}</span>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell align="right"> 
                                                            {symbol} {" "} {Comma(row.current_price.toFixed(2))}
                                                        </TableCell>
                                                        <TableCell align="right" style={{color:profit  ? "rgb(14,203,129)" : "red" , fontWeight:500}}>
                                                        {profit && "+"}{row?.price_change_percentage_24h.toFixed(2)}%
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {symbol}{" "}{Comma(row.market_cap.toString().slice(0,6))}M
                                                        </TableCell>
                                                    </TableRow>         
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            )
                    }

                </TableContainer>
                   {handleSearch()?(<Pages setpage={setpage} handleSearch={handleSearch}/>): ""}
            </Container>
        </ThemeProvider>
    )
}

export default CoinsTable
