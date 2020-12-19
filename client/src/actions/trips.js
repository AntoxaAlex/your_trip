
import {
    NEW_TRIP_SUCCESS,
    NEW_TRIP_FAILED,
    GET_TRIP_BY_ID,
    PROFILE_ERROR,
    GET_ALL_MY_TRIPS,
    GET_COMMENT_BY_ID,
    COMMENT_FAILED,
    NEW_PROFILE,
    GET_CURRENT_TRIP,
    GET_ALL_TRIPS,
    NOT_READY_TRIP
} from "./types";
import axios from "axios";
import React from "react";
// import {setAlert} from "./alert";


//Get all own trips
export const getAllMyTrips = () => async dispatch =>{
    try {
        const res = await axios.get("/trips/me");
        console.log(res)
        dispatch({
            type: GET_ALL_MY_TRIPS,
            payload: res.data
        })
    }catch (e) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: e.response.data.msg, status: e.response.status}
        })
    }
}

//Get all user's trips
export const getAllUserTrips = (id) => async dispatch =>{
    try {
        const res = await axios.get(`/trips/all/${id}`);
        console.log(res)
        dispatch({
            type: GET_ALL_MY_TRIPS,
            payload: res.data
        })
    }catch (e) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: e.response.data.msg, status: e.response.status}
        })
    }
}

export const getAllTrips = () => async dispatch =>{
    try{
        const res = await axios.get("/trips/")
        dispatch({
            type: GET_ALL_TRIPS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

//Get trip by id
export const getTripById = (id) => async dispatch => {
    try{
        const res = await axios.get("/trips/"+id)
        dispatch({
            type: GET_TRIP_BY_ID,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: NEW_TRIP_FAILED,
        })
    }
}
//Get current trip
export const getCurrentTrip = () => async dispatch => {
    try{
        const res = await axios.get("/trips/current")
        if(res.data.status === "not ready"){
            dispatch({
                type: NOT_READY_TRIP,
                payload: res.data
            })
        } else {
            dispatch({
                type: GET_CURRENT_TRIP,
                payload: res.data
            })
        }
    }catch (e) {
        console.log(e)
        dispatch({
            type: NEW_TRIP_FAILED,
        })
    }
}

//Get current trip of user
export const getUserCurrentTrip = (id) => async dispatch => {
    try{
        const res = await axios.get(`/trips/${id}/current`)
        dispatch({
            type: GET_CURRENT_TRIP,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: NEW_TRIP_FAILED,
        })
    }
}


//Create new trip
export const createTrip = (
    id,
    dir,
    tripType,
    title,
    trip_description,
    assembledTeammates,
    sp_image,
    sp_title,
    sp_description,
    sp_latitude,
    sp_longitude,
    isSpReached,
    fd_image,
    fd_title,
    fd_description,
    fd_latitude,
    fd_longitude,
    isFdReached,
    campContent
) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    console.log(assembledTeammates)


    try {
            const spImageUrl = typeof sp_image === "string" ? sp_image : await axios.post("/trips/uploadImage", sp_image)
            const fdImageUrl = typeof fd_image === "string" ? fd_image : await axios.post("/trips/uploadImage", fd_image)

        const body = JSON.stringify({
            type:tripType,
            title,
            trip_description,
            team: assembledTeammates,
            st_point:{
                sp_image: typeof spImageUrl === "string" ? spImageUrl : spImageUrl.data,
                sp_title,
                sp_description,
                sp_latitude,
                sp_longitude,
                isSpReached
            },
            fn_destination: {
                fd_image: typeof fdImageUrl === "string" ? fdImageUrl : fdImageUrl.data,
                fd_title,
                fd_description,
                fd_latitude,
                fd_longitude,
                isFdReached
            },
            campContent
        })

        if(dir === "create"){
            console.log(body)
            const res = await axios.post("/trips", body, config);
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }else if(dir === "edit"){
            console.log("edit")
            const res = await axios.put("/trips/"+id, body, config);
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }
    }catch (e) {
        // const errors = e.response.data.errors;
        // console.log(errors);
        // errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        // );
        // dispatch({
        //     type: NEW_TRIP_FAILED
        // })
        console.log(e)
    }
}

//Reach point
export const reachPoint = (tripId, pointId) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({pointId})
    try {
        const res = await axios.put("/trips/"+tripId+"/reachPoint", body, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

//Immediately complete trip
export const completeTrip = (id) => async dispatch => {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+".000+00:00";
    const dateTime = date+'T'+time;
    console.log(dateTime)

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({
        isCompleted: true,
        to: dateTime
    })

    console.log(body)
    try {
        const res = await axios.put("/trips/"+id+"/complete", body, config);
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }
    catch (e) {
            console.log(e.message)
    }
}

//Delete trip
export const removeTrip = (id) => async dispatch =>{
    try {
        const res = await axios.delete("/trips/"+id)
        dispatch({
            type: NEW_PROFILE,
            payload: res.data
        })
    } catch (e) {
        console.log(e)
    }
}

//Get comment by id
export const getCommentById = (trip_id, comment_id) => async dispatch => {
    try{
        const res = await axios.get("/trips/show/"+trip_id+"/posts/"+comment_id)
        dispatch({
            type: GET_COMMENT_BY_ID,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: COMMENT_FAILED,
        })
    }
}

//Create comment
export const createComment = (text, id, profileImage, username) =>async dispatch=>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({
        username,
        profileImage,
        text
        // likes,
    })

    try {
        const res = await axios.post("/trips/show/"+id+"/posts", body, config)
        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }

}

//Edit comment
export const editComment = (text, trip_id, comment_id) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({text})

    try {
        const res = await axios.put("/trips/show/"+trip_id+"/posts/"+ comment_id, body, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
    }
}

export const createReply = (text, id, commentId, profileImage, username) =>async dispatch=>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({
        username,
        profileImage,
        text
        // likes,
    })

    try {
        const res = await axios.put("/trips/show/"+id+"/posts/" + commentId +"/reply", body, config)
        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }

}

//Manage likes

export const addLike = (tripId, commentId) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try{
        const res = await axios.put("/trips/show/"+tripId+"/posts/"+commentId+"/like", config)
        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

export const setRating = (val,tripId) => async dispatch =>{
    console.log(val, tripId)
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({val})

    try{
        const res = await axios.post("/trips/"+tripId+"/rating",body, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

export const removeCommentReply = (id, index, tripId, commentId,) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        if(id === "comment"){
            const res = await axios.delete("/trips/show/"+tripId+"/posts/"+commentId, config)
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }else if(id==="reply"){
            const res = await axios.delete("/trips/show/"+tripId+"/posts/"+commentId+"/reply/"+index, config)
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }
    }catch (e) {
        console.log(e.message)
    }
}

export const confirmTrip = (tripId) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.put("/trips/"+tripId+"/confirm", config)
        if(res.data.status === "you ready"){
            dispatch({
                type: NOT_READY_TRIP,
                payload: res.data
            })
        }else {
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }
        console.log(res.data)
    }catch (e) {
        console.log(e.message)
    }
}




