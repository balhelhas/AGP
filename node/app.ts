const restify = require('restify');
const passport = require('passport');
const path = require('path');

import { Database } from './app.database';
import { Settings } from './app.settings';

const url = 'mongodb://localhost:27017/database';

const restifyServer = restify.createServer();

restify.CORS.ALLOW_HEADERS.push("content-type");
restify.CORS.ALLOW_HEADERS.push("authorization");
restifyServer.use(restify.bodyParser());
restifyServer.use(restify.queryParser());
restifyServer.use(restify.CORS());
restifyServer.use(restify.fullResponse());

import {Security} from './app.security';
let security = new Security();
security.initMiddleware(restifyServer);

let settings = new Settings(security,'/api/v1/');

import {Authentication} from './app.authentication';
new Authentication().init(restifyServer, settings);

import { User } from './app.user';
new User().init(restifyServer, settings);

import { Land } from './app.land';
new Land().init(restifyServer, settings);

import { Greenhouse } from './app.greenhouse';
new Greenhouse().init(restifyServer, settings);

import { Row } from './app.row';
new Row().init(restifyServer, settings);

import { Sensor } from './app.sensor';
new Sensor().init(restifyServer, settings);

import { Measure } from './app.measure';
new Measure().init(restifyServer, settings);

import { Plantation } from './app.plantation';
new Plantation().init(restifyServer, settings);

import { Plant } from './app.plant';
new Plant().init(restifyServer, settings);

import { MosquittoClient } from './app.mqtt';
new MosquittoClient().init(restifyServer, settings);

restifyServer.get(/^\/(?!api\/).*/, restify.serveStatic({
  directory: '../angular',
  default: 'index.html'
}));

Database.connect(url, () => {
    restifyServer.listen(7777, () => console.log('%s listening at %s', restifyServer.name, restifyServer.url));
});