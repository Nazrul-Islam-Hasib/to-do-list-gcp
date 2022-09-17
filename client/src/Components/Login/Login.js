import React, { useContext, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseConfig from './firebase.config';
import firebase from "firebase/compat/app";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { LoggedInContext } from '../../App';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css'
import Header from '../Header/Header';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const customAuth = getAuth();

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(LoggedInContext);
    const navigate = useNavigate();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    //Toggle signIn/signup
    const [newUser, setNewUser] = useState(false)
    const accountToggle = () => {
        if(newUser === false){
            setNewUser(true);
        }
        else{
            setNewUser(false);
        }
    }

    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        success: false
    });


    //Google signin
    const provider = new GoogleAuthProvider();
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((res) => {
                console.log(res.user)
                const { displayName, email } = res.user
                const newUserInfo = { ...user };
                newUserInfo.error = '';
                newUserInfo.success = true;
                newUserInfo.isSignedIn = true;
                newUserInfo.name = displayName;
                newUserInfo.email = email;
                setUser(newUserInfo);
                setLoggedInUser(newUserInfo);
                navigate(from);
            }).catch((error) => {
                console.log(error);
            });
        }
        //get value from form field
        const handleBlur = (e) => {
            let isFormValid;
            if (e.target.name === 'name') {
                isFormValid = e.target.value.length > 5;
                const newUserInfo = { ...user };
                newUserInfo.error = 'Name length is short';
                setUser(newUserInfo);
            }
            if (e.target.name === 'email') {
                isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
                const newUserInfo = { ...user };
                newUserInfo.error = 'email not valid';
                setUser(newUserInfo);
            }
            if (e.target.name === 'password') {
                const isPasswordValid = e.target.value.length > 5;
                const hasNumber = /\d{1}/.test(e.target.value);
                isFormValid = isPasswordValid;
                const newUserInfo = { ...user };
                newUserInfo.error = 'Password length is short';
                setUser(newUserInfo);
            }
            if (e.target.name === 'confirmPassword') {
                const isPasswordValid = e.target.value.length > 5;
                isFormValid = isPasswordValid;
                const newUserInfo = { ...user };
                if(newUserInfo.password === e.target.value){
                    isFormValid = true;
                    newUserInfo.error = 'Password don"t match';
                    setUser(newUserInfo);
                }
                
            }
            if (isFormValid) {
                const newUserInfo = { ...user };
                newUserInfo.error = '';
                newUserInfo[e.target.name] = e.target.value;
                setUser(newUserInfo);
            }
        }
    
        const handleSubmit = (e) => {
            //Error message if the form is not complete
            if(newUser){
                if(user.email === '' || user.password === '' || user.name === '' || user.confirmPassword === ''){
                    const newUserInfo = { ...user };
                    newUserInfo.error = 'Please complete the form';
                    setUser(newUserInfo);
                }
                if( user.password !== user.confirmPassword ){
                    const newUserInfo = { ...user };
                    newUserInfo.error = 'Password don"t match';
                    setUser(newUserInfo);
                }
            }
            else{
                if(user.email === '' || user.password === ''){
                    const newUserInfo = { ...user };
                    newUserInfo.error = 'Please complete the form';
                    setUser(newUserInfo);
                }
            }
    
            //Sign up 
            if (newUser && user.email && user.password && user.confirmPassword) {
                if(user.password === user.confirmPassword){
                    createUserWithEmailAndPassword(customAuth, user.email, user.password)
                    .then((userCredential) => {
                        const newUserInfo = { ...user };
                        newUserInfo.error = '';
                        newUserInfo.success = true;
                        setUser(newUserInfo);
                        setUserName(user.name);
                    })
                    .catch((error) => {
                        const newUserInfo = { ...user };
                        newUserInfo.error = error.message;
                        newUserInfo.success = false;
                        setUser(newUserInfo);
                    });
                }
            }
    
            //Sign In
            if (!newUser && user.email && user.password) {
                signInWithEmailAndPassword(customAuth, user.email, user.password)
                    .then((res) => {
                        console.log(res.user)
                        const { displayName, email } = res.user
                        const newUserInfo = { ...user };
                        newUserInfo.error = '';
                        newUserInfo.success = true;
                        newUserInfo.isSignedIn = true;
                        newUserInfo.name = displayName;
                        newUserInfo.email = email;
                        setUser(newUserInfo);
                        setLoggedInUser(newUserInfo);
                        navigate(from);
                    })
                    .catch((error) => {
                        const newUserInfo = { ...user };
                        newUserInfo.error = error.message;
                        newUserInfo.success = false;
                        setUser(newUserInfo);
                    });
            }
            e.preventDefault();
        }
    
        // Update/set username in firebase
        const setUserName = name => {
            let user = getAuth().currentUser;
            updateProfile(user, {
                displayName: name
              }).then(() => {
                const newUserInfo = { ...user };
                newUserInfo.error = '';
                newUserInfo.success = true;
                setUser(newUserInfo);
              }).catch((error) => {
                console.log(error);
              });
        }
    return (
        <div>
            <Header></Header>
            <div className="container">
                <div className="row text-center justify-content-center">
                <div className="col-md-8">
                        <div className="form-content">
                            {
                                newUser ? <p>Already have an account? <span onClick={accountToggle}>Sign In</span></p>
                                :  <p>Don't have an account? <span onClick={accountToggle}>Create account</span></p>
                            }
                            
                            <form>
                                <div className="mb-3">
                                    {newUser && <input type="text" name="name" className="form-control" placeholder="Name" required onBlur={handleBlur} />}
                                </div>
                                <div className="mb-3">
                                    <input type="email" name="email" className="form-control" placeholder="Email" required onBlur={handleBlur} />
                                </div>
                                <div className="mb-3">
                                    <input type="password" name="password" className="form-control" placeholder="Password" required onBlur={handleBlur} />
                                </div>
                                {
                                    newUser ? <div className="mb-3">
                                    <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" required onBlur={handleBlur} />
                                </div> : ''
                                }
                                
                                <button className="btn btn-primary" onClick={handleSubmit}>{newUser ? 'Sign Up' : 'Sign In'}</button>
                            </form>
                            <p className="text-danger">{user.error}</p>
                            {user.success && <p className="text-success">User {newUser ? 'Created' : 'Logged In'} successfully</p>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="login-form text-center">
                            <h4>Don't have an account? Sign in with google</h4>
                            <button className="btn btn-outline-info" onClick={handleGoogleSignIn}>
                                <FontAwesomeIcon icon={faGoogle} /> Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;