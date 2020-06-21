import Request from '../services/http-request'

/*
    @param {int} proposalID
    @param {string} sponsor
*/

export const delibrationID = (delibrationID) => {
    return Request({
        url: "proposal/" + delibrationID,
        method: 'get'
    })
}

export const proposalID = (delibrationID, proposalID) => {
    return Request({
        url: "proposal/" + delibrationID + "/" + proposalID,
        method: 'get'
    })
}

export const createVote = () => {
    return Request({
        url: "proposal/createVote",
        method: 'get'
    })
}

export const vote = (caseID, studentID, result) => {
    return Request({
        url: "proposal/vote",
        data: {
            "caseID": caseID,
            "studentID": studentID,
            "result": result,
        },
        method: 'post'
    })
}

export const voteResults = (caseID) => {
    return Request({
        url: "proposal/voteResults",
        data: {
            "caseID": caseID
        },
        method: 'post'
    })
}

export const resultLists = (caseID) => {
    return Request({
        url: "proposal/resultLists",
        data: {
            "caseID": caseID
        },
        method: 'post'
    })
}

export const createProposal = (delibrationID, dept, reason, description, discussion) => {
    return Request({
        url: "proposal/createProposal",
        data: {
            "delibrationID": delibrationID,
            "dept": dept,
            "reason": reason,
            "description": description,
            "discussion": discussion,
        },
        method: 'post'
    })
}