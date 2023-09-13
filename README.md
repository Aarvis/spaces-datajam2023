# DataJam Spaces App Setup

  

Follow these steps to set up and run the DataJam Spaces App.

So The main branch has the version of code submitted before deadline, there will be further pushes to the main branch only to update the README to make it easier for you to run Spaces app, Spaces Ad Performance Engine and Spaces Scoreboard.

The others branches will have updated version of the project, by updated we don't mean addition of new features, we mean bug fixes for edge cases, if and when we find any.

So please trying running both the branches 

Incase of any issues in running the code, please contact aakashjarvis1@gmail.com or contact through twitter @aakash_hash

  

## Prerequisites

  

- Node.js and npm installed.

- PostgreSQL set up and running.

- Redis server available at `127.0.0.1:6379`.

  

## Installation & Setup

  

### 1. Install Dependencies for the Spaces App

  

Navigate to the `spaces-app` directory:

  

```bash
cd /spaces-app/
```

  

Install the necessary dependencies

  

```bash
npm i
```

  

### 2. Install Dependencies for the Spaces Engine Server

  

Move to the dataJam-2023/js/server directory:

  

```bash
cd /dataJam-2023/js/server
```

  

Again, install the necessary dependencies:

  

```bash
npm i
```

  

Incase of npm i error or dependency issues due to graphql version conflicts

delete the node_modules in /dataJam-2023/js/server, extract node_modules.zip in /dataJam-2023/js/server/node_modules.zip and paste the node_modules folder in this /dataJam-2023/js/server/ .That should resolve the issue

  

### 3. Generate Prisma Client

Run the following command:

  

```bash
npx prisma generate
```

  

### 4. Configure Database Connection

Open the .env file and set your PostgreSQL connection details:

  

```bash
DATABASE_URL="postgresql://<user_name>:<password>@localhost:<port>/<dbname>?schema=public"
```

  

Spin up your own psql db instance and Replace user_name, password, port, and dbname with your actual PostgreSQL details.

  

### 5. Run Prisma Migrations

Execute the migration with the following command:

  

```bash
npx prisma migrate dev --name init
```

  

### 6. Prepopulate the Database

1. Use the provided spacesdbData.sql in /dataJam-2023/js/server to prepopulate your database. This is an extracted state after processing two CSGO series 2578928 & 2579048 websocket data, designed to simplify the demo. Added to this Auctions, Bids and Sponsor data is populated to give a history of auctions for players

In the empty db with schema, use restore option in pgadmin and check only data option.

In the empty db without schema, make sure you have both data and schema checked on.

(Note, pgadmin might show that the restore failed, but check the table values for Player and Auction table and if both are populated you are good to go)


2. If you did not want to go ahead with path 1), and you want to populate the db manually do 2) and 3). 

First clear the db.
   
Navigate to the dataJam-2023/js/datajam directory

```bash
cd /dataJam-2023/js/datajam
```

In server.js change the seriesCode to 2578928

```bash
let seriesCode = 2578928
```

Then run:

```
npm start
```

In another terminal

navigate back to /dataJam-2023/js/server and run:

```bash
node ./scoreboardSocketReceiver.js
```

3.  After websocket stream is completed for seriesCode 2578928, Stop the server running at /dataJam-2023/js/datajam with ctrl+c and Repeat step 2 for seriesCode 2579048,

To populate Auction Data run:

```bash
node ./populateAuctionSponsorDB.js
```

but after running you have to manually edit records to cover all three different cases that would arise due to auction, AUCTION OPEN, AUCTION CLOSED & TENURE GOING ON, AUCTION CLOSED & TENURE ENDED and AUCTION CLOSED & TENURE HASN'T STARTED

  
### 7. Start a Redis Server

Ensure a Redis server is running at the default location:

```bash
127.0.0.1:6379
```

### 8. Start the Spaces App

Navigate back to the spaces-app directory:

  

```bash
cd /spaces-app/
```

  

Change the url in src/app.js

```bash
const serverEndpoint = 'localhost:80' //or your specific ip:80

const scoreBoardServerEndpoint = 'localhost:81' //or your specific ip:81
```

  

Start the web application:

  

```bash
npm start
```

  

### 9. Boot Up Required Servers

#### Start the DataJam Websocket:

Navigate to the dataJam-2023/js/datajam directory

```bash
cd /dataJam-2023/js/datajam
```

In server.js change the seriesCode to 2579089

```bash
let seriesCode = 2579089
```

Then run:

```
npm start
```

  

#### Launch the Ad-Performance-Query-Engine:

In a new terminal, navigate to /dataJam-2023/js/server

  

```bash
cd /dataJam-2023/js/server
```

  

Run:

```bash
node ./index.js
```

  

#### Start the Spaces Socket Receiver:

Without closing the previous terminal, open a new terminal and navigate back to /dataJam-2023/js/server. Run:

There are two ways to run scoreboardSocketReceiver.js
1. Realtime event simulation (preferred to see actual changes in brand exposure metrics for sponsors and also experience spaces scoreboard in real time)
2. Non Realtime event simulation, executed as fast as the system can.

We will go ahead with 1. and to do this we will have to uncomment the waitForTimeout() function

uncomment below line in scoreboardSocketReceiver.js
```bash
//await waitForTimeout((timeDifference(currentTimeIndex,previousTimeIndex))*1000)
```

  
save and run

```bash
node ./scoreboardSocketReceiver.js
```

  

### Conclusion

Go to the browser page and refresh