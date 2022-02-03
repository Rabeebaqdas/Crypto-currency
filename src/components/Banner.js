import { Container, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import Carousel from './Carousel';

const useStyle = makeStyles({
    banner:{
        backgroundImage:"url(./banner2.jpg)",
    },
    bannerContent:{
        display:"flex",
        height:400,
        flexDirection:"column",
        paddingTop:25,
        justifyContent:"space-around"

    },
    tagline:{
        display:"flex",
        height:"40%",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",

    }
   
})

const Banner = () => {
    const classes = useStyle();
    return (
        <div className={classes.banner}>
        <Container className={classes.bannerContent}>
            <div  className={classes.tagline}>
            <Typography  variant="h2" style={{fontWeight:"bold", fontFamily:"Montserrat",marginBottom:15}}>
                Crypto Hunter
            </Typography>
            <Typography variant="subtitle2" style={{color:"darkgray",textTransform:"capitalize",fontFamily:"Montserrat"}}>
                get all the info regrading your favorite crypto currency
            </Typography>
            </div>
            <Carousel />
        </Container>   
        </div>
    )
}

export default Banner