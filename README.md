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

  

Move to the datajam-2023/js/server directory:

  

```bash

cd /datajam-2023/js/server

```

  

Again, install the necessary dependencies:

  

```bash

npm i

```

  

Incase of npm i error or dependency issues due to graphql version conflicts

delete the node_modules in /dataJam-2023/js/server, extract node_modules.zip in /dataJam-2023/js/server/node_modules.zip and paste the node_modules folder in this /dataJam-2023/js/server/ location. That should resolve the issue

  

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

  

Spin up your own psql db instance and Replace <user_name>, <password>, <port>, and <dbname> with your actual PostgreSQL details.

  

### 5. Run Prisma Migrations

Execute the migration with the following command:

  

```bash

npx prisma migrate dev --name init

```

  

### 6. Prepopulate the Database

Use the provided spacesdbData.sql in /dataJam-2023/js/server to prepopulate your database. This is an extracted state after processing two CSGO matches websocket data, designed to simplify the demo.

In the empty db with schema, use restore option in pgadmin and check only data option.

In the empty db without schema, make sure you have both data and schema checked on.

(Note, pgadmin might show that the restore failed, but check the table values for Player and Auction table and if both are populated you are good to go)

  

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

Navigate to the datajam-2023/js/datajam directory:

  

```bash

cd /datajam-2023/js/datajam

```

  

Then run:

```

npm start

```

  

#### Launch the Ad-Performance-Query-Engine:

In a new terminal, navigate to /datajam-2023/js/server

  

```bash

cd /datajam-2023/js/server

```

  

Run:

  

```bash

node ./index.js

```

  

#### Start the Spaces Socket Receiver:

Without closing the previous terminal, open a new terminal and navigate back to /datajam-2023/js/server. Run:

  

```bash

node ./scoreboardSocketReceiver.js

```

  

### Conclusion

Go to the browser page and refresh