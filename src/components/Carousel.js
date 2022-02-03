import { makeStyles } from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import AliceCarousel from 'react-alice-carousel';
import { NavLink } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';


const useStyle = makeStyles({
    carousel:{
        height:"80%",
        display:"flex",
        alignItems:"center",
    },
    carouselItems:{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        cursor:"pointer",
        textTransform:"uppercase",
        color:"white"
        
    }
})
export const  Comma = (value) => {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const Carousel = () => {

    const classes = useStyle();
    const [trending, settrending] = useState([]);
    const {symbol,currency} = CryptoState()
    useEffect(()=>{
        const fetchTrending = async () => {
            const data = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`)
            const res = await data.json();
            settrending(res);
        }
        fetchTrending();
        
       
    },[currency])

    const items = trending?.map((coin)=>{

        let profit = coin.price_change_percentage_24h > 0;
        return(
            <NavLink to={`/coins/${coin.id}`}  className={classes.carouselItems}>
                <img src={coin?.image} alt={coin.name} height="80" style={{marginBottom:10}}/>
                    <span>{coin?.symbol}
                    &nbsp;
                    <span style={{color:profit ? "rgb(14,203,129)" : "red"}}>{profit && "+"}{coin?.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                    </span >

                    <span style={{fontSize:"22", fontWeight:500}}>
                        {symbol}{" "}{Comma(coin?.current_price?.toFixed(2))}
                    </span>
            </NavLink>
        )
    })


    const responsive = {
        0:{
            items: 2
        },
        512:{
            items:4
        }
    }
    
    return (
        <div className={classes.carousel}>
            <AliceCarousel 
            infinite
            autoPlay
            autoPlayInterval={1000}
            disableButtonsControls
            disableDotsControls
            animationDuration = {1500}
            responsive = {responsive}
            items={items}
            />
        </div>
    )
}

export default Carousel
