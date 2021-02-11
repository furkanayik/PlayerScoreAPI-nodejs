# **PlayerScoreAPI**
by **Furkan Ayık**
furkanayik.94@gmail.com
https://github.com/furkanayik

## Overview
This is an API project that manages a game with leaderboard, user creation, submitting score etc. functionalities. There are multiple requests such as *GET*, *POST*, *DELETE*. Endpoints, dependencies and logic described as below.

## Tech and Dependencies
* [node.js] -Open source server environment
* [express]   -Fast, unopinionated, minimalist web framework for node.js
* [mongoDB]   -Database
* [mongoose]  -Elegant mongodb object modeling for node.js
* [nodemon]   -tool that helps develop node.js based applications by automatically restarting the node application
* [body-parser] -Node.js body parsing middleware
* [input-validator] -to validate inputs
* [uuid] -For the creation of RFC4122 UUIDs
* [dotenv] -Module that loads environment variables from a .env file into process.env

## Installation
Install the dependencies and start the server.

```sh
$ cd PlayerScoreAPI
$ npm install -d
$ npm start
```

##### For deploying;
**DB_CONNECTION** variable in **.env** file must be assigned before deploying the application. This variable should be specify your mongoDB database connection.

Example value:
mongodb+srv://<username>:<password>@apicluster.ihvud.mongodb.net/<dbname>?retryWrites=true&w=majority

*MongoDb Atlas cloud service has been used in development.
[Atlas]


## Endpoints

* **/leaderboard (GET)** Returns all users with rank order.
* **/leaderboard/{country_iso_code} (GET)** Returns all users whose country code equal to request parameter.
* **/score/submit (POST)** Submits score value for a specific user and update total points and rank of the user.
sample request;
{
 "user_id":"9d1858e4-5ea5-4269-95c1-8c24269838f2",
 "score_worth":5874
}
* **/user/profile/{user_guid} (GET)** Returns info of specific user
* **/user/create (POST)** Creates a new user with 0 points, given display_name and country. Sets their rank to the current last
sample request;
{
	"display_name":"testUser",
	"country":"tr"
}
* **/user/delete(DELETE)** Deletes all users in database
* **/user/generate (POST)** Creates test users of given number with random display_name,country,points. 
(*)This request requires rank calculation with existing users and **might take some time**, if you don't care about the existing users in db you can try endpoint below.
sample request;
{
    user_count: 500
}
* **/user/delete/generate(POST)** First deletes all users in database, then creates users of given number. This endpoint is quicker then abowe becouse it doesn't calculate ranks and makes db insert in one time.

## Logic
It is considered there might be multiple users who have the same point. Ranking system in this project allows users to have the same point and rank.
* In leaderboard endpoints; response brings data by sorting them on rank field.
* In user/create; with request new user is created and because they don't have any points yet this function calculates the current last rank value with considering there might multiple 0 point users.
* In user/generate; random users with random point, display_name is created and depending on their point, their rank is calculated.
* In user/delete/generate; for better performance this function creates test users by ranking them in loop by order. This is why this request makes db insert one time.
* In score/submit; first, user's current point is find and new point, new rank values are calculated. Then user's rank and point fields are updated. After this depending on old and new points status, there are 3 cases. Rank calculation depends on whether there is any other user who has old or new point value. Depend on this cases, below old point, below new point or between old and new point user's ranks are recalculated.


[//]: # 

   [node.js]: <http://nodejs.org>
   [mongoDB]: <https://www.mongodb.com/>
   [express]: <http://expressjs.com>
   [mongoose]: <https://mongoosejs.com/>
   [nodemon]: <npmjs.com/package/nodemon/>
   [body-parser]: <https://mongoosejs.com/>
   [input-validator]: <https://www.npmjs.com/package/node-input-validator>
   [uuid]: <https://www.npmjs.com/package/uuid/>
   [dotenv]: <https://www.npmjs.com/package/dotenv/>
   [Atlas]: <https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_emea_turkey_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624572&gclid=Cj0KCQiApY6BBhCsARIsAOI_GjaWF2PRAnZso790ZbEGD8cWWbTPl1yTNVGc6Si1DEWg7W83Lou27pYaAjAyEALw_wcB/>
   