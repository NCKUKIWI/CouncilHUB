import Request from '../services/http-request'

/*
    @param {} studentID
    @param {} department
    @param {} grade
    @param {} email
    @param {} name
    @param {} password
    @param {} position
*/

export const signUp = ({studentID, department, grade, email, name, password, position}) => {
    return Request({
        url: "user/signUp",
        data: {
            "studentID": studentID,
            "department": department,
            "grade": grade,
            "email": email,
            "name": name,
            "password": password,
            "position": position,
        },
        method: 'post',
    })
}

/*
    @param {string} studentID
    @param {string} password
*/

export const login = (studentID, password) => {
    return Request({
        url:"user/login",
        data: {
            "studentID": studentID,
            "password": password,
        },
        method: 'post'
    })
}

export const changeRole = (studentID) => {
    return Request({
        url: "user/changeRole",
        data: {
            "studentID": studentID,
        },
        method: 'post'
    })
}

export const deleteRole = (studentID) => {
    return Request({
        url: "user/deleteRole",
        data: {
            "studentID": studentID,
        },
        method: 'post'
    })
}