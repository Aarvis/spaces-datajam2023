## GRID Server Setup

Install necessary packages for the GRID Server

```jsx
cd js/datajam
npm i
```

Make sure the directory of the data files has been correctly created inside js/datajam.

```jsx
js/datajam
|- data_files
|-- csgo
|--- CCT-Online-Finals-1
|---- 2578928_events.jsonl
|---- 2578928_state.json
|---- 2579048_events.jsonl
|---- 2579048_state.json
|---- 2579089_events.jsonl
|---- 2579089_state.json
```

Run the Grid Server at js/datajam with command

```jsx
npm start
```

## DB Server Setup

This is a websocket client linked up with a psql db interfaced with a prisma client.

Install necessary packages for the DB Server and Client

```jsx
cd js/server
npm i
```

Update the DB URL if necessary in .env file

```jsx
DATABASE_URL =
  "postgresql://postgres:<your-password>@localhost:<your-port>/<db-name>?schema=public";
```

Run the Client

```jsx
npx prisma generate
```

If you are deploying the db for the first time. Use the below command

```jsx
npx prisma migrate deploy
```

If you are doing changes to the schema at prisma/schema.prisma. You will have to migrate your changes to the db with command

```jsx
npx prisma migrate dev --name init
```

Run the client

```jsx
node index.js
```
