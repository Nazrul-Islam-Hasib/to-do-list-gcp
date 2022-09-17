import React, { useContext } from 'react';
import { LoggedInContext } from '../../../../App';

const CompletedToDo = (props) => {
    const { userName, userEmail, todoName, completed, _id } = props.todo;
    const [loggedInUser, setLoggedInUser] = useContext(LoggedInContext);
    if (loggedInUser.email === userEmail && completed === true) {
        return (
          <>
            <tr>
              <td>{userName}</td>
              <td>{userEmail}</td>
              <td>{todoName}</td>
              <td>completed{completed}</td>
            </tr>
          </>
        );
      }
      else {
        return (
          <></>
        );
      }
};

export default CompletedToDo;