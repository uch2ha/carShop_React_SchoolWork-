import React, {useState, useEffect, useRef} from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Addcar from "./Addcar";
import CarWasDeleted from "./CarWasDeleted";
import { PinDropSharp } from "@material-ui/icons";
import Editcar from "./Editcar";



export default function Carlist(){
    const [cars, setCars] = useState([]);
    const fref = useRef();
    

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const deleteCar = (link) => {
        //ask if you are really want to delete
        if(window.confirm("Are you sure?")){
            fetch(link, {method: "DELETE"})
            .then(res => fetchData())
            .catch(err => console.error(err))

            fref.current.toShow();
            

        }
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) =>{
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    

    const columns = [
        {
            Header: "Brand",
            accessor: "brand"
        },
        {
            Header: "Model",
            accessor: "model"
        },
        {
            Header: "Color",
            accessor: "color"
        },
        {
            Header: "Fuel",
            accessor: "fuel"
        },
        {
            Header: "Year",
            accessor: "year"
        },
        {
            Header: "Price",
            accessor: "price"
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            Cell: row => <Editcar updateCar={updateCar} car={row.original}/>
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: "_links.self.href",
            Cell: row => <Button color="secondary" variant="outlined" size="small" onClick={() => deleteCar(row.value)}>Delete</Button>
        }
    ]

    return (
        <div>
            <Addcar saveCar={saveCar}/>
            <ReactTable filterable={true} data={cars} columns={columns}/>
            <CarWasDeleted ref={fref}/>
        </div>
    )
}