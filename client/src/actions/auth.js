import axios from "axios";
import {setAlert} from "./alert";
import {REGISTER_FAILED, REGISTER_SUCCESS, USER_LOADED, AUTH_ERR, LOGIN_FAILED, LOGIN_SUCCESS, LOGOUT} from "./types";
import setAuthToken from "../utils/setAuthToken";


//Load user
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }
    
    try {
        const res = await axios.get("/auth");

        dispatch({
            type:USER_LOADED,
            payload: res.data
        })
    }catch (e) {
        dispatch({
            type: AUTH_ERR
        })
    }
}

//Register user
export const register = (name, email, password) => async dispatch =>{
    const config = {
        headers:{
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({name, email, password});
    
    try {
        const res = await axios.post("/user", body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }catch (e) {
        const errors = e.response.data.errors;
        console.log(errors);
        errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        );
        dispatch({
            type: REGISTER_FAILED
        })
    }
}

//Login user
export const login = (email, password) => async dispatch =>{
    const config = {
        headers:{
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post("/auth", body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }catch (e) {
        const errors = e.response.data.errors;
        console.log(errors);
        errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        );
        dispatch({
            type: LOGIN_FAILED
        })
    }
}

//Logout
export const logout = ()=> async dispatch =>{
    dispatch({
        type: LOGOUT
    })
}