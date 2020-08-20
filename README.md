# node-role-based-authorization-api

Node.js Role Based Authorization API

####Summary

The current PoC project aims to develop a working node backend based on a given set of business conditions

Entities
 users, groups. collections and items

  Users can belong to multiple groups or be a global manager
  A group can link to multiple collections
  A collection can belong to a single group
  Items belong to a single collection

A global manager can:
- CRUD all roles users
- CRUD all groups, collections and items

A group manager can:
- CRUD regular and manager roles only under current group
- CRUD collections and items only under current group

####Requirement:

- Build CRUD API for all 4 entities

- All access, filtering and relation logic should be implemented as an Authorization layer by way of middlewares 
- The authorization layer should be generic
- Absolute paths
- Whenever a user gets updated an email should be sent to him (this should be in a service)
- Patterns: modules, services, dependency injection, multi-tier architecture
- Must run in serverless (serverless.framework) with offline and warmup plugins
- When an email is changed both old and new emails should get notified


#### Documentation

No persistence system by design, only hardcoded initial data.

##### Getting started command
- npm i && npm start

##### Serverless run command
- serverless offline

##### Running API tests locally

To locally run the provided Postman collection against your backend, execute:

```` 
APIURL=http://localhost:4000/ ./run-api-tests.sh
````
For more details, see [`run-api-tests.sh`](run-api-tests.sh)