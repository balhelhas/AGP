const mongodb = require('mongodb');
const util = require('util');
const sha1 = require('sha1');

import { Settings } from './app.settings';
import { Database } from './app.database';

export class User {

	private settings: Settings = null;

	private handleError = (err: string, response: any, 
							next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnUser = (id:string, response: any, next: any) => {
        Database.db.collection('users')
            .findOne({
                _id: id
            })
            .then((user) => {
                if (user === null) {
                    response.send(404, 'User not found');
                } else {
                    response.json(user);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public register = (request: any, response: any, next: any) => {
        Database.db.collection('users')
            .findOne({ username: request.body.username })
            .then(user => {
                if(user !== null) {
                    response.json({
                        msg: util.format('Username already exists')
                    });
                } else {
                    Database.db.collection('users')
                        .findOne({ email: request.body.email })
                        .then(email => {
                            if(email !== null) {
                                response.json({
                                    msg: util.format('Email already in use')
                                });
                            } else {
                                this.createUser(request, response, next);
                            }
                        })
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
    }

    public createUser = (request: any, response: any, next: any) => {
        var user;
        if(request.body !== undefined) {   
            user = {}; 
            user.username = request.body.username;
            user.password = sha1(request.body.password);
            user.email = request.body.email;
            user.first_name = request.body.first_name;
            user.last_name = request.body.last_name;
            user.location = request.body.location;
            user.gender = request.body.gender;
        }
        
        if (user === undefined) {
            response.send(400, 'No user data');
            return next();
        }

        Database.db.collection('users')
            .insertOne(user)
            .then(result => this.returnUser(result.insertedId, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    private changePassword = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let password = request.body.password;
        let new_password = sha1(request.body.new_password);

        Database.db.collection('users')
            .findOne({
                _id: id
            })
            .then((user) => {
                if (user === null) {
                    response.send(404, 'User not found');
                } else {
                    console.log(sha1(password))
                    console.log(user.password)
                    if(user.password == password){
                        response.json({
                            msg: util.format('Not the correct password')
                        }); 
                    }else{
                        Database.db.collection('users')
                            .updateOne({
                                _id: id
                            }, {
                                $set: {password: new_password}
                            })
                            .then(result => this.returnUser(id, response, next))
                            .catch(err => this.handleError(err, response, next));
                    }
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public editUser = (request: any, response: any, next: any) => {
        let editUser = request.body;
        let id = new mongodb.ObjectID(editUser._id);
        if (editUser === undefined) {
            response.send(400, 'No user data!');
            return next();
        }
        Database.db.collection('users')
            .findOne({ _id: id})
            .then(user => {
                if(user.email == editUser.email){
                    Database.db.collection('users')
                        .updateOne({
                            _id: id
                        }, {
                            $set: {first_name: editUser.first_name, 
                                    last_name: editUser.last_name, 
                                    gender: editUser.gender, 
                                    location: editUser.location}
                        })
                        .then(result => this.returnUser(id, response, next))
                        .catch(err => this.handleError(err, response, next));
                }else{
                    Database.db.collection('users')
                        .findOne({email: editUser.email})
                        .then(checkMail => {
                            if(checkMail != null){
                                response.json({
                                    msg: util.format('Email already registed')
                                }); 
                            }else {
                                Database.db.collection('users')
                                    .updateOne({
                                        _id: id
                                    }, {
                                        $set: {email: editUser.email,
                                                first_name: editUser.first_name, 
                                                last_name: editUser.last_name, 
                                                gender: editUser.gender, 
                                                location: editUser.location}
                                    })
                                    .then(result => this.returnUser(id, response, next))
                                    .catch(err => this.handleError(err, response, next));
                            }  
                        })
                        .catch(err => this.handleError(err, response, next));
                }
               
            })
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server:any, settings:Settings) => {
        this.settings = settings;
        server.post(settings.prefix + 'register', this.register);
        server.put(settings.prefix + 'pw_change/:id', this.changePassword);
        server.put(settings.prefix + 'user/edit', this.editUser)
        console.log("Users routes registered");
    };
}