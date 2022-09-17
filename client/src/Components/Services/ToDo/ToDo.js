import React, { useEffect, useContext, useState } from 'react';
import ToDoItem from './ToDoItem/ToDoItem';
import CompletedToDo from './CompletedToDo/CompletedToDo';
import { ToDoContext } from '../../../App';
const ToDo = () => {
    const [toDo, setToDo] = useState([]);
    const [toDoitem, setToDoItem] = useContext(ToDoContext);
    useEffect(()=>{
        fetch('/api/todo')
        .then(res => res.json())
        .then(data => setToDo(data))
    },[])
    
    const handleData = () => {
        console.log("child to parent");
        fetch('/api/todo')
        .then(res => res.json())
        .then(data => setToDo(data))
    }
    if(toDoitem.todoName){
        handleData();
        setToDoItem("");
    }
    return (
        <div className="container-fluid row text-center">
            <div className="col-md-12">
                <div className="container mt-5">
                <div className="row">
                <h2 className='text-info fw-bold'>Available Task</h2>
                    <table className="table table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Task</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                toDo.map(pd => <ToDoItem key={pd._id} todo={pd} handleData={handleData}></ToDoItem>)
                            }
                        </tbody>
                    </table>

                </div>
                <div className="row mt-5">
                    <h2 className='text-success fw-bold'>Completed Task</h2>
                    <table className="table table-bordered">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Task</th>
                                <th scope="col">Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                toDo.map(pd => <CompletedToDo key={pd._id} todo={pd} handleData={handleData}></CompletedToDo>)
                            }
                        </tbody>
                    </table>

                </div>
                </div>
            </div>
        </div>
    );
};

export default ToDo;