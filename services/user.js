const User  = require('../models/user')
const FriendRequest = require('../models/friendrequest')
const Creditor = require('../models/creditor')



const UserService = {
    getAllUser: (callback) => {
        User.find({}, (err,data) => {
            // console.log("service : " + data);
            callback(data)
        })
    },
    getUserInfo: (userid, callback) => {
        User.findOne({_id: userid})
            .populate('friends')
            .populate({
                path: 'friendrequests',
                populate: [
                    {path: 'from'},
                    {path: 'to'}
                ]
            })
            .populate('credits')
            // .populate('debts')
            // .populate('history')
            .exec((err,user) => {
                if(err) {
                    console.log(err);
                }
                console.log("service by id: " + user);
                callback(user);
            })
    },
    getUserByEmail: (email, callback) => {
        console.log("service by email: " + email);
        try {
            User.findOne({email: email})
                .populate('friends')
                .populate('friendrequests')
                .populate('credits')
                // .populate('debts')
                // .populate('history')
                .exec((err,user) => {
                    if(err) return err
                        callback(user);
                })
        } catch(e) {
            console.log(e);
        }
        
    },
    getUserFriendRequests: (userid, callback) => {
        FriendRequest.find({from: userid, status: 'waiting'})
            .populate('to')
            .exec((err, toRequests) => {
                FriendRequest.find({to: userid, status: 'waiting'})
                    .populate('from')
                    .exec((err, fromRequests) => {
                        callback({
                            err,
                            data: {
                                to: toRequests,
                                from: fromRequests
                            }
                        })
                    })
            })
    },
    createFriendRequest: (userId, email, callback) => {

        console.log("userid: " + userId);
        console.log("email: " + email);

        User.findOne({email:email})
            .then((result) => {
                var friendRequest = new FriendRequest({
                    from: userId,
                    to: result._id,
                    status: 'waiting',
                })
                
                friendRequest.save()
                    .then((result) => {
                        // UPDATE SENTUSER
                        User.findOneAndUpdate({email: email}, {'$push': { 'friendrequests': result._id }})
                            .then(() => {
                                console.log("FIND USER " + userId);
                                // UPDATE FROMUSER
                                User.findOneAndUpdate({_id: userId}, {'$push': { 'friendrequests': result._id }})
                                    .then(() => {
                                        callback({
                                            data: result,
                                        })
                                    })
                                    .catch(e => console.log(e))
                            })
                            .catch(e => console.log(e))  
                    })
                    .catch(err => console.log(err))
            })
    },
    acceptFriendRequest: (requestId, status, callback) => {
        FriendRequest.findOneAndUpdate({_id: requestId}, {status: status})
            .then(result => {
                // UPDATE FROM 
                User.updateMany  AndUpdate({_id: result.from}, {'$pull': { 'friendrequests': requestId }})
                callback({
                    err,
                    data: 'update friend request successful'
                })
            })
    },
    getDebtRequests: (userId, callback) => {
        Creditor.find({user: userId, request: 'waiting'})
            .populate('debt')
            .exec((err, user) => {
                callback({
                    err,
                    data: user
                })
            })
    },
    updateCreditorRequest: (creditorId, status, callback) => {

        if(status == 'accept') {
            Creditor.findOneAndUpdate({_id: creditorId}, {request: 'accept'})
                .then((err,result) => {
                    callback({
                        err,
                        data: 'update credit request successful'
                    })
                })
        } else if (status == 'reject') {
            Creditor.findOneAndDelete({_id: creditorId})
                .then((err,result) => {
                    callback({
                        err,
                        data: 'update credit request successful'
                    })
                })
        }

       
    }
} 

module.exports = UserService;

