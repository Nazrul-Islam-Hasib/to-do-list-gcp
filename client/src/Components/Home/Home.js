import React from 'react';
import Header from '../Header/Header';
import AddService from '../Services/AddService/AddService';
import ToDo from '../Services/ToDo/ToDo';
import './Home.css'
const Home = () => {
    return (
        <div className="home-content">
            <Header></Header>
            <AddService></AddService>
            <ToDo></ToDo>
        </div>
    );
};

export default Home;