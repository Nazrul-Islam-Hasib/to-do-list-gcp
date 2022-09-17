import React, { useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { LoggedInContext } from '../../../../App';
import { useForm } from "react-hook-form";
import './ToDoItem.css'
const ToDoItem = (props) => {
  const { userName, userEmail, todoName, completed, _id } = props.todo;
  const handleData = props.handleData;
  const [loggedInUser, setLoggedInUser] = useContext(LoggedInContext);
  // Modal
  const [deleteModal, setDeleteModal] = useState(false);

  const deleteModalClose = () => setDeleteModal(false);
  const deleteModalOpen = () => setDeleteModal(true);

  const [updateModal, setUpdateModal] = useState(false);

  const updateModalClose = () => setUpdateModal(false);
  const updateModalOpen = () => setUpdateModal(true);
  // Modal
  const { register, handleSubmit } = useForm();

  const updateService = data => {
    const updateData = {
      updatedToDo: data.updatedData
    }
    const url = `/api/update/${_id}`
    fetch(url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
      .then(res => res.json())
      .then(data => {
        if (data === true) {
          console.log(data, 'updated successfully!')
          handleData();
        } else {
          console.log(data, 'Not updated!')
        }
      })
      updateModalClose();
  }


  const handleChange = (e) => {
    console.log(e.target.value);
    const id = e.target.value;
    const updateData = {
      updatedToDo: true
    }
    const url = `/api/updateStatus/${id}`
    fetch(url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
      .then(res => res.json())
      .then(data => {
        if (data === true) {
          console.log(data, 'updated successfully!')
          handleData();
        } else {
          console.log(data, 'Not updated!')
        }
      })
  }

  
  const deleteservice = (id) => {
    const url = `/api/delete/${id}`
    fetch(url, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data === true) {
          // window.location.reload(true);
          console.log(data, 'Deleted successfully!')
          handleData();
        } else {
          console.log(data, 'Not deleted!')
        }
      })
    deleteModalClose();
  }



  if (loggedInUser.email === userEmail && completed === false) {
    return (
      <>
        <tr>
          <td>{userName}</td>
          <td>{userEmail}</td>
          <td>{todoName}</td>
          <td><FontAwesomeIcon icon={faPencil} className='trash-icon' onClick={updateModalOpen} /> <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={deleteModalOpen} />
          <input className="form-check-input ms-2" type="checkbox" value={_id} id="flexCheckDefault" onChange={handleChange}/></td>
        </tr>

        <Modal show={deleteModal} onHide={deleteModalClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete the task: {todoName}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={deleteModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { deleteservice(_id) }}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={updateModal} onHide={updateModalClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Update Task: {todoName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(updateService)} className="text-center product-form">
              <input {...register("updatedData", { value: `${todoName}` })} type="text" className="form-control" />
              <br />
              <input type="submit" className="btn btn-success mt-4" />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={updateModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  else {
    return (
      <></>
    );
  }
};

export default ToDoItem;