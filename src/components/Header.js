import { AppBar, Container, createTheme, ThemeProvider, makeStyles, MenuItem, Select, Toolbar, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { CryptoState } from '../CryptoContext';
import Authmodal from './Authmodal';
import UserSidebar from './UserSidebar';
const useStyle = makeStyles({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer"
  }
})

const Header = () => {

  const [curr, setcurr] = useState();
  useEffect(() => {
    const fetchcurr = async () => {
      const data = await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
      const res = await data.json();
      setcurr(res);

    }
    fetchcurr();
    
  }, [])

  const nagivate = useNavigate();
  const classes = useStyle();
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff"
      },
      type: 'dark'
    },

  });

  const { currency, setCurrency,user } = CryptoState();
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography className={classes.title} variant="h6" onClick={() => nagivate("/")}>
              Crypto Hunter
            </Typography>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" variant="outlined"
              style={{ width: 100, height: 40, marginRight: 15 }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              
          {
            curr && curr.map((e,i)=>(
              <MenuItem key={i} value={e.toUpperCase()}>{e.toUpperCase()}</MenuItem>
            ))
          }
            </Select>
         { user ? <UserSidebar /> :  <Authmodal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header;
