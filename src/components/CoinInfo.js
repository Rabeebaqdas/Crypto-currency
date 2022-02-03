import { CircularProgress, createTheme , makeStyles, ThemeProvider} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import { CryptoState } from '../CryptoContext'
import { chartDays } from './days';
import SelectButton from './SelectButton';
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  } from 'chart.js';
  
  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
  );
  
const useStyle = makeStyles((theme)=>({
    container:{
        width:"75%",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        marginTop:25,
        padding:40,

        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
        },
    },
}))
const CoinInfo = ({id}) => {
    const classes = useStyle();
    const [chart,setchart] = useState([])
    const [day,setday] = useState(1)
    const {currency} = CryptoState()
    useEffect(()=>{
        const fetchGraph = async() => {
            const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${day}`)
            const res = await data.json();
            setchart(res.prices);
        }   
        fetchGraph();
    },[currency,day])


    const data={
        labels:chart?.map((e)=>{
            let date = new Date(e[0]);
            let time = date.getHours() > 12 
            ?
             `${date.getHours() - 12}:${date.getMinutes()}PM` 
            :
            `${date.getHours()}:${date.getMinutes()}AM`
            return day === 1 ? time : date.toLocaleDateString()
        }),
        datasets:[
            {
                data: chart?.map((e)=>e[1]),
                label: day === 1 ? `Price (Past ${day} Day) in ${currency}` : `Price (Past ${day} Days) in ${currency}`,
                borderColor:"#EEBC1D"
            }
        ],
};
  const  options={
        elements: {
          point: {
            radius: 1,
          },
        },
      }

    const dark = createTheme({
        palette:{
            primary:{
                main:"#fff"
            },
            type:"dark"
        }
    })
    return (
            <ThemeProvider theme={dark}>
            <div className={classes.container}>
                {
                    !chart ? (
                        <CircularProgress style={{color:"gold"}} size = {250} thickness = {1} />
    )
    :
    <>  
    <Line data={data} options={options} />
    <div style={{display:"flex",marginTop:20,justifyContent:"space-around",width:"100%"}}>
    {
    chartDays.map((e)=>(
        <SelectButton key={e.value} onClick={()=>setday(e.value)} selected={e.value === day}>
            {e.label}
        </SelectButton>
    ))
        }
    </div>
    </>
                }
            </div>
        </ThemeProvider>
    )
}

export default CoinInfo
