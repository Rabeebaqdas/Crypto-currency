import React from 'react'
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
    Pagination:{
        "& .MuiPaginationItem-root":{
        color:"gold"
        }
    }
})
const Pages = ({setpage,handleSearch}) => {
    const classes = useStyle();
    const handleChange = (page) => {
        setpage(page);
        window.scroll(0,450);
    }
    return (
        <div>
            <Pagination style={{
                padding:20,
                display:"flex",
                justifyContent:"center",
                width:"100%",
                color:"gold"
            }}  count={(handleSearch().length/10).toFixed(0)} classes={{ul: classes.Pagination}}  onClick={(e)=>handleChange(e.target.textContent)}/>
        </div>
    )
}

export default Pages;
