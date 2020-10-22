const Router    = require('express').Router;
const Request   = require('express').request;
const Response  = require('express').response;

const UserService = require('../../services/user');
const user = require('../../models/user');

const route     = Router();

module.exports = (app) => {
    app.use('/user', route);
    
    route.get('/', async(req,res) => {
        UserService.getAllUser((data) => {
            console.log("[GET] GET ALL USERS");
            console.log(data);
            res.send(data);
        })
    })

    route.post('/', async(req,res) => {
        var userId = req.body.userid;
        var email = req.body.email;
        console.log("email : " + email);
        console.log("userId : " + userId);
        
        // CHECK IF USERID EXISTS
        if (userId) {
            UserService.getUserInfo(userId, (data) => {
                console.log("[GET] GET USER INFO");
                console.log(data);
                res.send(data);
            })
        } else if (email) {
            console.log("GET USER BY EMAIL");
            UserService.getUserByEmail(email, (data) => {
                console.log("[GET] GET USER BY EMAIL");
                console.log(data);
                res.send(data);
            })
        } 
    })


    route.post('/friend', async(req,res) => {
        var userId = req.body.userid
        var email = req.body.email
        UserService.createFriendRequest(userId, email, (result) => {
            if(result.err) {
                res.send({error: result.err}).status(401)
            } else {
                res.send(result.data).status(200)
            }
        })
    })

    route.get('/friend/request', async(req,res) => {
        var userId = req.body.userid

        if(!userId) {
            UserService.getUserFriendRequests(userid, (result) => {
                if(result.err) {
                    res.send({error: result.err}).status(401)
                } else {
                    res.send(result.data).status(200)
                }
            })
        } else {
            res.status(401).send({
                userId: 'there is no userId'
            })
        }
    })

    route.post('/friend/request', async(req,res) => {
        var status = req.body.status
        var friendRequestId = req.body.friendRequestId
        
        if(status == 'accept') {
            UserService.updateFriendRequest(friendRequestId, status, (results) => {
                if(result.err) {
                    res.send({error: result.err}).status(401)
                } else {
                    res.send(result.data).status(200)
                }
            })
        } else if (status == 'reject' ) {
            
        }
    })

    route.get('/debt', async(req,res) => {
        var userId = req.body.userid
    })

    route.get('/debt/request', async(req,res) => {
        var userId = req.body.userid

        if(userId) {
            UserService.getDebtRequests(userId, (results) => {
                if(result.err) {
                    res.send({error: result.err}).status(401)
                } else {
                    res.send(result.data).status(200)
                }
            })
        }
    })

    route.post('/debt/request', async(req,res) => {
        var creditorId = req.body.creditorId
        var status = req.body.status

        if(creditorId && status) {
            UserService.updateCreditorRequest(creditorId, status, (results) => {
                if(result.err) {
                    res.send({error: result.err}).status(401)
                } else {
                    res.send(result.data).status(200)
                }
            })
        }
    })

    route.get('/pay', async(req,res) => {
        
    })
}

