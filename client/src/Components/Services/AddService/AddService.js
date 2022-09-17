import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { LoggedInContext, ToDoContext } from "../../../App";

const AddService = () => {
    const [loggedInUser, setLoggedInUser] = useContext(LoggedInContext);
    const [toDoitem, setToDoItem] = useContext(ToDoContext);
    const { register, handleSubmit } = useForm();
    //Send data to server
    const onSubmit = data => {
        if (loggedInUser.isSignedIn === true) {
            const eventData = {
                todoName: data.service_name,
                userName: loggedInUser.name,
                userEmail: loggedInUser.email,
                completed: false,
            }
            const url = '/api/addToDo';
            fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setToDoItem(eventData);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            console.log("You need to SignIn!");
        }
           
        

    };
    if (loggedInUser.isSignedIn === true){
        return (
            <div className="container-fluid row">
                <div className="col-md-12">
                    <div className="container mt-5">
                        <form onSubmit={handleSubmit(onSubmit)} className="text-center product-form">
                        <h2 className='text-info fw-bold'>Add New Task</h2>
                            <input {...register("service_name")} type="text" placeholder="Add To-Do" className="form-control" />
                            <br />
                            <input type="submit" className="btn btn-primary mt-4" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="container-fluid row">
                <div className="col-md-12">
                    <div className="container mt-5">
                        <form onSubmit={handleSubmit(onSubmit)} className="text-center product-form">
                        <h2 className='text-info fw-bold'>Add New Task</h2>
                            <input type="text" placeholder="SignIn to add new task" className="form-control" disabled/>
                            <br />
                            <input type="submit" className="btn btn-primary mt-4" disabled/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    
};

export default AddService;