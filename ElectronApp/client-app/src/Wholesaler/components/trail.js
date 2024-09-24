import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
//import { Pagination } from "@mui/material";


function Pages(){

   const [items,setItems]= useState([]);
   const [pageCount,setpageCount]= useState(0);

   useEffect(()=>{
    //  const getData = async ()=>{
    //     const res = await fetch (
            
    //     const data = await res.json();
    //     setItems(data);
    //  }
    //getData();
   },[]);
     const handlepageclick =(data)=>{
        console.log(data.selected)
     }
   return (
    <div>
        <ReactPaginate
            pageCount={pageCount}
            previousLabel={'Previous'}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            breakLabel ={'...'}
            containerClassName={'pagination justify-content-center'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLinkClassName={'page-link'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}

            onPageChange={handlepageclick}
        
        /> 
    </div>
   )   



}

export default Pages;










{/* <Pagination count={10} page={1} onChange={(event, value) => console.log(value)} />
         */}