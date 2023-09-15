const crypto = require("crypto");
const { prisma } = require("./database.js");
// const { PubSub } = require('apollo-server');
const { GraphQLServer } = require("graphql-yoga");
const { createServer } = require("node:http");
const { typeDefs } = require("./schema");

const GraphQLJSON = require("graphql-type-json");

const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');

const options = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? process.env.REDIS_PORT : '6379',
  retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
  }
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

const KILL_KILL_MOMENT_THRESHOLD = 2;


const port = 81;

function generateHash(key1, key2) {
  const hash = crypto.createHash("sha256");
  hash.update(key1 + key2);
  return hash.digest("hex");
}

const imageURLLists = [
  'https://readyesports.com/wp-content/uploads/2020/07/jjonak-e1595272572999.jpg',
  'https://res.heraldm.com/content/image/2020/10/05/20201005000516_0.jpg',
  'https://cdn.sanity.io/images/5gii1snx/production/30040d05fc8757923734f01fd76175d54a14584d-6234x6743.jpg',
  'https://img-cdn.hltv.org/playerbodyshot/lNnAKu0s0ujLe7N5Q-PmlO.png?bg=3e4c54&h=800&ixlib=java-2.1.0&rect=105%2C0%2C494%2C494&w=800&s=5f2f952dc62dc5859c4afda1a3b9e21e',
  'https://media.licdn.com/dms/image/C5603AQH_02uR6-SK_Q/profile-displayphoto-shrink_800_800/0/1648087417260?e=2147483647&v=beta&t=AgY7yJAqAQWoNYvqnaeBmsOJk0lQ3xVqPEB8lRSc5wE',
  'https://cdn.fifa.gg/cache/media/player/082dac7e-3e19-4aea-9223-aebc6bf561f6/Image-of-player-wassupfsk-player-082dac7e-3e19-4aea-9223-aebc6bf561f6.jpg?',
  'https://esports.ntc.edu/wp-content/uploads/2021/09/blain-smith-profile-photo.jpg',
  'https://www.missouriwestern.edu/esports/wp-content/uploads/sites/150/2022/04/AlexBestor.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScrGw1hG7B0VDeNZNt-gDBwYxvnxlZUxC3vwfzr9lDaLwV0JrTEoMyG_cJq4QTaLdgrXs&usqp=CAU',
  'https://www.missouriwestern.edu/esports/wp-content/uploads/sites/150/2022/04/IagoLucasSouza.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVg8RemHAy4nw8-VYGnRg4pq38auVbIJutQQ&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvAr4I2Wxr0S6QXcgBJpWYiBUB6GdRWa2dg&usqp=CAU',
  'https://media.licdn.com/dms/image/D4E03AQHIV2sAZyWUDA/profile-displayphoto-shrink_800_800/0/1690398580960?e=2147483647&v=beta&t=Bx5s5jC_hYGOh2uRrOnyi9iVq_91phtB0vBJ5_StSdc',
  'https://img-cdn.hltv.org/playerbodyshot/Fhmim9gDJbFCkQ7LpT1jnA.png?bg=3e4c54&h=800&ixlib=java-2.1.0&rect=117%2C0%2C467%2C467&w=800&s=eceab66366db2d413363f437da37be89',
  'https://cdn.1337pro.com/dynamic?url=https%3A%2F%2Fimg.abiosgaming.com%2Fplayers%2FNiko-csgo-player-2021.png',
]

let poppableUrlList = imageURLLists.slice()

function getRandomURLAndRemove() {
  if (poppableUrlList.length === 0) {
    throw new Error("No more URLs left in the list.");
  }

  const randomIndex = Math.floor(Math.random() * poppableUrlList.length);
  const selectedURL = poppableUrlList[randomIndex];

  // Remove the selected URL from the array
  poppableUrlList.splice(randomIndex, 1);

  return selectedURL;
}

function getRandomFloat() {
  const minValue = 0.35;
  const maxValue = 0.95;
  const randomFloat = minValue + (Math.random() * (maxValue - minValue));
  
  // Round to two decimal points
  return parseFloat(randomFloat.toFixed(2));
}

const { WebSocket } = require("ws");
const { objectEnumValues } = require("@prisma/client/runtime/index.js");
const { lookupService } = require("dns");
const BASE_URL = "ws://localhost:8080";
// const SERIES_ID = 2579089;
// const SERIES_ID = 2579048;
// const SERIES_ID = 2578928;
//const WS_URL = `${BASE_URL}/${SERIES_ID}`;
const WS_URL = `${BASE_URL}`;
const socket = new WebSocket(WS_URL);

const ScoreboardResolver = {
  JSON: GraphQLJSON,
  Subscription: {
    scoreBoardChanged: {
      subscribe:(_, { tournamentId }, { req, pubsub }, info) =>  pubsub.asyncIterator(`SCOREBOARD_CHANGED_${tournamentId}`),
    }
  }
}


const server = new GraphQLServer({ 
  typeDefs:"schema.graphql", 
  resolvers:ScoreboardResolver, 
  context: (req) =>({ req: req.request, pubsub }) });


server.start(
	{
		tracing: false,
		uploads: {
			maxFileSize: 10000000,
		},
		port: port,
	},
	({ port }) => {
		console.log(`Server is running on http://localhost:${port}`);
	}
);


function timeDifference(timestamp1, timestamp2) {
  // Parse the timestamps into Date objects
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // Compute the difference in milliseconds
  const differenceInMillis = Math.abs(date2 - date1);

  // Convert the difference to seconds
  const differenceInSeconds = differenceInMillis / 1000;

  return differenceInSeconds;
}


//Start the websocket Client here
socket.onopen = () => {
  console.log("Connected to WebSocket server.");
};

socket.onclose = (event) => {
  console.log("Disconnected from WebSocket server: ", event.reason);
};

let processRunning = 0;
let reverseEntropyEvents = false;

class Queue {
  constructor() {
    this.tasks = [];
  }

  // Method to add a task to the queue
  enqueue(task) {
    this.tasks.push(task);
  }

  // Method to remove a task from the queue
  dequeue() {
    return this.tasks.shift();
  }

  // Method to check if queue is empty
  isEmpty() {
    return this.tasks.length === 0;
  }
}

let progressiveEVTTimeIndex = 0;
let gameStartedTimeIndex = 0;
let EVTProbabilityOfTeam = {};
let EVTProbabilityOfPlayer = {};
let EVTTimeCummulativeTeam = {};
let EVTPlayersAlive = {};

const queue = new Queue();

let possibilityOfClutch = [];
let allPossibleClutches = [];

function convert10(value) {
  if (value == 1) return 0;
  else if (value == 0) return 1;
}


async function updatesForTournamentStartedSeries(object,m){
  eventId = object.events[m].id;

  await prisma.tournament.upsert({
    where:{tournamentId: object.events[m].seriesState.id},
    update:{},
    create: {
      tournamentId: object.events[m].seriesState.id,
      format: object.events[m].seriesState.format,
    },
  });

  //create Team1 if it doesn't exist
  await prisma.team.upsert({
    where: { teamId: object.events[m].seriesState.teams[0].id },
    update: {},
    create: {
      teamId: object.events[m].seriesState.teams[0].id,
      name: object.events[m].seriesState.teams[0].name,
    },
  });

  //create Team2 if it doesn't exist
  await prisma.team.upsert({
    where: { teamId: object.events[m].seriesState.teams[1].id },
    update: {},
    create: {
      teamId: object.events[m].seriesState.teams[1].id,
      name: object.events[m].seriesState.teams[1].name,
    },
  });



  //create players in Team0 if doesn't exist
  for (
    let n = 0;
    n <= object.events[m].seriesState.teams[1].players.length - 1;
    n++
  ) {
    await prisma.player.upsert({
      where: {
        playerId: object.events[m].seriesState.teams[1].players[n].id,
      },
      update: {},
      create: {
        playerId: object.events[m].seriesState.teams[1].players[n].id,
        name: object.events[m].seriesState.teams[1].players[n].name,
        team: {
          connect: {
            teamId: object.events[m].seriesState.teams[1].id,
          },
        },
        passwordHash: generateHash(
          object.events[m].seriesState.teams[1].players[n].id,
          "player@1234"
        ),
        profilePic:getRandomURLAndRemove(),
        tournamentReach:getRandomFloat(),
      },
    });
  }

  //create players in Team1 if doesn't exist
  for (
    let n = 0;
    n <= object.events[m].seriesState.teams[0].players.length - 1;
    n++
  ) {
    await prisma.player.upsert({
      where: {
        playerId: object.events[m].seriesState.teams[0].players[n].id,
      },
      update: {},
      create: {
        playerId: object.events[m].seriesState.teams[0].players[n].id,
        name: object.events[m].seriesState.teams[0].players[n].name,
        team: {
          connect: {
            teamId: object.events[m].seriesState.teams[0].id,
          },
        },
        passwordHash: generateHash(
          object.events[m].seriesState.teams[0].players[n].id,
          "player@1234"
        ),
        profilePic:getRandomURLAndRemove(),
        tournamentReach:getRandomFloat(),
      },
    });
  }
}

async function updatesForSeriesStartedGame(object,m){
  await prisma.match.create({
    data: {
      matchId: object.events[m].seriesStateDelta.games[0].id,
      tournament: {
        connect: {
          tournamentId: object.events[m].seriesStateDelta.id,
        },
      },
    },
  });

  //connect team0 and Match
  await prisma.teamOnMatch.create({
    data: {
      team: {
        connect: {
          teamId: object.events[m].seriesState.teams[0].id,
        },
      },
      match: {
        connect: {
          matchId: object.events[m].seriesStateDelta.games[0].id,
        },
      },
    },
  });

  //connect team1 and Match
  await prisma.teamOnMatch.create({
    data: {
      team: {
        connect: {
          teamId: object.events[m].seriesState.teams[1].id,
        },
      },
      match: {
        connect: {
          matchId: object.events[m].seriesStateDelta.games[0].id,
        },
      },
    },
  });

  //connect player and Match in team0
  for (
    let n = 0;
    n <= object.events[m].seriesState.teams[0].players.length - 1;
    n++
  ) {
    await prisma.playerOnMatch.create({
      data: {
        player: {
          connect: {
            playerId: object.events[m].seriesState.teams[0].players[n].id,
          },
        },
        match: {
          connect: {
            matchId: object.events[m].seriesStateDelta.games[0].id,
          },
        },
      },
    });

    //update playerOverall Stats
    await prisma.player.update({
      where: {
        playerId: object.events[m].seriesState.teams[0].players[n].id,
      },
      data: {
        numberOfMatches: {
          increment: 1,
        },
      },
    });


    //update sponsor tenure stats
    let currentDate = new Date();
    let fetchedSponsorTenureStatsId = null;
    let needToCreate = false;
    
    const auctions = await prisma.auction.findMany({
        where: {
            player: {
                playerId: object.events[m].seriesState.teams[0].players[n].id,
            },
            auctionStatus: 'CLOSED',

        },
        select: {
            sponsorTenureStatsId: true,
            tenureStartDate: true,
            term: true,
            auctionId:true,
        }
    });

    if(auctions.length!=0){
      let tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
      tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

      console.log('currentDate',currentDate)
      console.log('startDate',auctions[auctions.length-1].tenureStartDate)
      console.log('tenureEndDate',tenureEndDate)
      if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
        fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
        needToCreate = true
      }


      console.log('fetchedSponsorTenureStatsId',fetchedSponsorTenureStatsId)
      if((fetchedSponsorTenureStatsId == null || fetchedSponsorTenureStatsId == undefined) && needToCreate == true){

        let sponsorTenureStatsCreated = await prisma.sponsorTenureStats.create({
          data:{
            numberOfMatches: 1,
            player:{
              connect:{
                playerId: object.events[m].seriesState.teams[0].players[n].id,
              }
            }
          },
          select:{
            sponsorTenureStatsId:true,
          }
        })

        await prisma.auction.update({
          where:{
            auctionId:auctions[auctions.length-1].auctionId
          },
          data:{
            winningSponsorTenureStats:{
              connect:{
                sponsorTenureStatsId:sponsorTenureStatsCreated.sponsorTenureStatsId
              }
            }
          }
        })

      }
      else if(fetchedSponsorTenureStatsId != null){
        await prisma.sponsorTenureStats.upsert({
          where:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          },
          update:{
            numberOfMatches: {
              increment: 1,
            },
          },
          create:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
            numberOfMatches: 1,
            player:{
              connect:{
                playerId: object.events[m].seriesState.teams[0].players[n].id,
              }
            }
          }
        })
      }

    }
  }

  //connect player and Match in team1
  for (
    let n = 0;
    n <= object.events[m].seriesState.teams[1].players.length - 1;
    n++
  ) {
    await prisma.playerOnMatch.create({
      data: {
        player: {
          connect: {
            playerId: object.events[m].seriesState.teams[1].players[n].id,
          },
        },
        match: {
          connect: {
            matchId: object.events[m].seriesStateDelta.games[0].id,
          },
        },
      },
    });

    await prisma.player.update({
      where: {
        playerId: object.events[m].seriesState.teams[1].players[n].id,
      },
      data: {
        numberOfMatches: {
          increment: 1,
        },
      },
    });

    //update sponsor tenure stats
    let currentDate = new Date();
    let fetchedSponsorTenureStatsId = null;
    let needToCreate = false;
    
    const auctions = await prisma.auction.findMany({
        where: {
            player: {
                playerId: object.events[m].seriesState.teams[1].players[n].id,
            },
            auctionStatus: 'CLOSED',

        },
        select: {
            sponsorTenureStatsId: true,
            tenureStartDate: true,
            term: true,
            auctionId:true,
        }
    });

    if(auctions.length!=0){
    let tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
    tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

    if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
      fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
      needToCreate = true;
    }

    //update sponsorTenure Stats
    console.log('fetchedSponsorTenureStatsId',fetchedSponsorTenureStatsId)
    if((fetchedSponsorTenureStatsId == null || fetchedSponsorTenureStatsId == undefined) && needToCreate == true){
      let sponsorTenureStatsCreated = await prisma.sponsorTenureStats.create({
        data:{
          numberOfMatches: 1,
          player:{
            connect:{
              playerId: object.events[m].seriesState.teams[1].players[n].id,
            }
          }
        },
        select:{
          sponsorTenureStatsId:true,
        }
      })

      await prisma.auction.update({
        where:{
          auctionId:auctions[auctions.length-1].auctionId
        },
        data:{
          winningSponsorTenureStats:{
            connect:{
              sponsorTenureStatsId:sponsorTenureStatsCreated.sponsorTenureStatsId
            }
          }
        }
      })
    }
    else if(fetchedSponsorTenureStatsId != null){
      await prisma.sponsorTenureStats.upsert({
        where:{
          sponsorTenureStatsId:fetchedSponsorTenureStatsId,
        },
        update:{
          numberOfMatches: {
            increment: 1,
          },
        },
        create:{
          sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          numberOfMatches:1,
          player:{
            connect:{
              playerId: object.events[m].seriesState.teams[1].players[n].id,
            }
          }
        }
      })
    }

    }
  }

}

async function updateForSeriesNotStartedGame(object,m){
  if (reverseEntropyEvents == true) {
    //disconnect player and Match in team1
    for (
      let n = 0;
      n <= object.events[m].seriesState.teams[1].players.length - 1;
      n++
    ) {
      await prisma.playerOnMatch.deleteMany({
        where: {
          AND: [
            {
              playerId:
                object.events[m].seriesState.teams[1].players[n].id,
            },
            {
              matchId: object.events[m].seriesStateDelta.games[0].id,
            },
          ],
        },
      });

      //update playerOverall Stats
      await prisma.player.update({
        where: {
          playerId: object.events[m].seriesState.teams[1].players[n].id,
        },
        data: {
          numberOfMatches: {
            decrement: 1,
          },
        },
      });

      //update sponsorTenureStats
    let currentDate = new Date();
    let fetchedSponsorTenureStatsId = null;
    let needToCreate = false;
    
    const auctions = await prisma.auction.findMany({
        where: {
            player: {
                playerId: object.events[m].seriesState.teams[1].players[n].id,
            },
            auctionStatus: 'CLOSED',

        },
        select: {
            sponsorTenureStatsId: true,
            tenureStartDate: true,
            term: true,
            auctionId:true
        }
    });

    if(auctions.length!=0){
      let tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
      tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

      if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
        fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
        needToCreate = true;
      }

      if(fetchedSponsorTenureStatsId!=null && needToCreate == true){
        await prisma.sponsorTenureStats.update({
          where:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          },
          data:{
            numberOfMatches: {
              decrement: 1,
            },
          }
        })
      }
    }
    }

    //disconnect player and Match in team0
    for (
      let n = 0;
      n <= object.events[m].seriesState.teams[0].players.length - 1;
      n++
    ) {
      await prisma.playerOnMatch.deleteMany({
        where: {
          AND: [
            {
              playerId:
                object.events[m].seriesState.teams[0].players[n].id,
            },
            {
              matchId: object.events[m].seriesStateDelta.games[0].id,
            },
          ],
        },
      });

      //update playerOverall Stats
      await prisma.player.update({
        where: {
          playerId: object.events[m].seriesState.teams[0].players[n].id,
        },
        data: {
          numberOfMatches: {
            decrement: 1,
          },
        },
      });

    //update sponsor tenure stats
    let currentDate = new Date();
    let fetchedSponsorTenureStatsId = null;
    let needToCreate = false;
    
    const auctions = await prisma.auction.findMany({
        where: {
            player: {
                playerId: object.events[m].seriesState.teams[0].players[n].id,
            },
            auctionStatus: 'CLOSED',

        },
        select: {
            sponsorTenureStatsId: true,
            tenureStartDate: true,
            term: true,
            auctionId: true,
        }
    });

    if(auctions.length!=0){
      let tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
      tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

      if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
        fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
        needToCreate = true
      }

      if(fetchedSponsorTenureStatsId!=null && needToCreate == true){
        await prisma.sponsorTenureStats.update({
          where:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          },
          data:{
            numberOfMatches: {
              decrement: 1,
            },
          }
        })
      }
    }
    }

    //disconnect team0 and Match
    await prisma.teamOnMatch.deleteMany({
      where: {
        AND: [
          {
            teamId: object.events[m].seriesState.teams[0].id,
          },
          {
            matchId: object.events[m].seriesStateDelta.games[0].id,
          },
        ],
      },
    });

    //disconnect team1 and Match
    await prisma.teamOnMatch.deleteMany({
      where: {
        AND: [
          {
            teamId: object.events[m].seriesState.teams[1].id,
          },
          {
            matchId: object.events[m].seriesStateDelta.games[0].id,
          },
        ],
      },
    });
    

    await prisma.match.delete({
      where: {
        matchId: object.events[m].seriesStateDelta.games[0].id,
      },
    });
  }
}

async function updateForGameStartedRound(object,m){
  let roundStartedInGameId =
    object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundStartedInGameId);

  await prisma.round.create({
    data: {
      roundId: roundId,
      match: {
        connect: {
          matchId: object.events[m].seriesStateDelta.games[0].id,
        },
      },
    },
  });

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "GAME_STARTED_ROUND",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.gameStartedRoundEvent.create({
    data: {
      roundIdStarted: roundId,
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
    },
  });

  for (
    let n = 0;
    n <= object.events[m].seriesState.teams[0].players.length - 1;
    n++
  ) {
    await prisma.playerRoundStats.create({
      data: {
        round: {
          connect: {
            roundId: roundId,
          },
        },
        player: {
          connect: {
            playerId: object.events[m].seriesState.teams[0].players[n].id,
          },
        },
      },
    });
  }

  for (
    let n = 0;
    n <= object.events[m].seriesState.teams[1].players.length - 1;
    n++
  ) {
    await prisma.playerRoundStats.create({
      data: {
        round: {
          connect: {
            roundId: roundId,
          },
        },
        player: {
          connect: {
            playerId: object.events[m].seriesState.teams[1].players[n].id,
          },
        },
      },
    });
  }

  for (
    let p = 0;
    p <= object.events[m].seriesState.games.length - 1;
    p++
  ) {
    if (
      object.events[m].seriesState.games[p].id ==
      object.events[m].seriesStateDelta.games[0].id
    ) {
      for (
        let q = 0;
        q <= object.events[m].seriesState.games[p].segments.length - 1;
        q++
      ) {
        if (
          object.events[m].seriesState.games[p].segments[q].id ==
          object.events[m].seriesStateDelta.games[0].segments[0].id
        ) {
          await prisma.teamRoundStats.create({
            data: {
              side: object.events[m].seriesState.games[p].segments[q]
                .teams[0].side,
              round: {
                connect: {
                  roundId: roundId,
                },
              },
              team: {
                connect: {
                  teamId:
                    object.events[m].seriesState.games[p].segments[q]
                      .teams[0].id,
                },
              },
            },
          });

          await prisma.teamRoundStats.create({
            data: {
              side: object.events[m].seriesState.games[p].segments[q]
                .teams[1].side,
              round: {
                connect: {
                  roundId: roundId,
                },
              },
              team: {
                connect: {
                  teamId:
                    object.events[m].seriesState.games[p].segments[q]
                      .teams[1].id,
                },
              },
            },
          });

          break;
        }
      }
      break;
    }
  }

  // Initialize EVTTimeIndex
  gameStartedTimeIndex = object.occurredAt;
  progressiveEVTTimeIndex = object.occurredAt;
  EVTProbabilityOfTeam[String(object.events[m].seriesState.teams[0].id)] =
    object.events[m].seriesState.teams[1].players.length /
    (object.events[m].seriesState.teams[0].players.length +
      object.events[m].seriesState.teams[1].players.length);
  EVTProbabilityOfTeam[String(object.events[m].seriesState.teams[1].id)] =
    object.events[m].seriesState.teams[0].players.length /
    (object.events[m].seriesState.teams[0].players.length +
      object.events[m].seriesState.teams[1].players.length);

  EVTPlayersAlive[String(object.events[m].seriesState.teams[0].id)] =
    object.events[m].seriesState.teams[0].players.length;
  EVTPlayersAlive[String(object.events[m].seriesState.teams[1].id)] =
    object.events[m].seriesState.teams[1].players.length;

  EVTTimeCummulativeTeam[
    String(object.events[m].seriesState.teams[0].id)
  ] = 0;
  EVTTimeCummulativeTeam[
    String(object.events[m].seriesState.teams[1].id)
  ] = 0;

  return eventCreated;


}

async function updateForGameNotStartedRound(object,m){
  if (reverseEntropyEvents == true) {
    let roundStartedInGameId =
      object.events[m].seriesStateDelta.games[0].id;
    let roundId = object.events[
      m
    ].seriesStateDelta.games[0].segments[0].id
      .concat(":")
      .concat(roundStartedInGameId);

    if (reverseEntropyEvents == true) {
      for (
        let p = 0;
        p <= object.events[m].seriesState.games.length - 1;
        p++
      ) {
        if (
          object.events[m].seriesState.games[p].id ==
          object.events[m].seriesStateDelta.games[0].id
        ) {
          console.log("In1");

          console.log("In2");
          await prisma.teamRoundStats.deleteMany({
            where: {
              AND: [
                {
                  roundId: roundId,
                },
                {
                  teamId:
                    object.events[m].seriesState.games[p].teams[0].id,
                },
              ],
            },
          });

          await prisma.teamRoundStats.deleteMany({
            where: {
              AND: [
                {
                  roundId: roundId,
                },
                {
                  teamId:
                    object.events[m].seriesState.games[p].teams[1].id,
                },
              ],
            },
          });

          break;
        }
      }

      for (
        let n = 0;
        n <= object.events[m].seriesState.teams[1].players.length - 1;
        n++
      ) {
        await prisma.playerRoundStats.deleteMany({
          where: {
            AND: [
              {
                roundId: roundId,
              },
              {
                playerId:
                  object.events[m].seriesState.teams[1].players[n].id,
              },
            ],
          },
        });
      }

      for (
        let n = 0;
        n <= object.events[m].seriesState.teams[0].players.length - 1;
        n++
      ) {
        await prisma.playerRoundStats.deleteMany({
          where: {
            AND: [
              {
                roundId: roundId,
              },
              {
                playerId:
                  object.events[m].seriesState.teams[0].players[n].id,
              },
            ],
          },
        });
      }

      await prisma.gameStartedRoundEvent.deleteMany({
        where: {
          roundIdStarted: roundId,
        },
      });

      await prisma.event.deleteMany({
        where: {
          AND: [
            {
              roundId: roundId,
            },
            {
              eventType: "GAME_STARTED_ROUND",
            },
          ],
        },
      });

      await prisma.round.delete({
        where: {
          roundId: roundId,
        },
      });
    }
  }
}

async function updateForGameEndedRound(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "GAME_ENDED_ROUND",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.gameEndedRoundEvent.create({
    data: {
      roundIdEnded: roundId,
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
    },
  });

  for (
    let p = 0;
    p <= object.events[m].seriesState.games.length - 1;
    p++
  ) {
    if (object.events[m].seriesState.games[p].id == roundEndedInGameId) {
      for (
        let q = 0;
        q <= object.events[m].seriesState.games[p].segments.length - 1;
        q++
      ) {
        if (
          object.events[m].seriesStateDelta.games[0].segments[0].id ==
          object.events[m].seriesState.games[p].segments[q].id
        ) {
          if (
            object.events[m].seriesState.games[p].segments[q].teams[0]
              .won == true
          ) {
            await prisma.teamRoundStats.updateMany({
              where: {
                AND: [
                  {
                    teamId:
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[0].id,
                  },
                  { roundId: roundId },
                ],
              },
              data: {
                winType:
                  object.events[m].seriesState.games[p].segments[q]
                    .teams[0].winType,
                won: true,
              },
            });
          } else if (
            object.events[m].seriesState.games[p].segments[q].teams[1]
              .won == true
          ) {
            await prisma.teamRoundStats.updateMany({
              where: {
                AND: [
                  {
                    teamId:
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[1].id,
                  },
                  { roundId: roundId },
                ],
              },
              data: {
                winType:
                  object.events[m].seriesState.games[p].segments[q]
                    .teams[1].winType,
                won: true,
              },
            });
          }
          break;
        }
      }
      break;
    }
  }

  //calculate EVT for players Alive and Round Lasted Time
  console.log("calculate EVT for players Alive");
  for (
    let p = 0;
    p <= object.events[m].seriesState.games.length - 1;
    p++
  ) {
    if (object.events[m].seriesState.games[p].id == roundEndedInGameId) {
      for (
        let q = 0;
        q <= object.events[m].seriesState.games[p].segments.length - 1;
        q++
      ) {
        if (
          object.events[m].seriesState.games[p].segments[q].id ==
          object.events[m].seriesStateDelta.games[0].segments[0].id
        ) {
          console.log("calculate EVT for players Alive - Round Matched");
          for (
            let r = 0;
            r <=
            object.events[m].seriesState.games[p].segments[q].teams
              .length -
              1;
            r++
          ) {
            for (
              let s = 0;
              s <=
              object.events[m].seriesState.games[p].segments[q].teams[r]
                .players.length -
                1;
              s++
            ) {
              console.log("calculate EVT for players Alive");
              console.log(
                object.events[m].seriesState.games[p].segments[q].teams[r]
                  .players[s].id
              );
              if (
                object.events[m].seriesState.games[p].segments[q].teams[r]
                  .players[s].alive == true
              ) {
                let EVTOfAlivePlayer =
                  (timeDifference(
                    object.occurredAt,
                    progressiveEVTTimeIndex
                  ) *
                    EVTProbabilityOfTeam[
                      String(
                        object.events[m].seriesState.games[p].segments[q]
                          .teams[r].id
                      )
                    ]) /
                    EVTPlayersAlive[
                      String(
                        object.events[m].seriesState.games[p].segments[q]
                          .teams[r].id
                      )
                    ] +
                  EVTTimeCummulativeTeam[
                    object.events[m].seriesState.games[p].segments[q]
                      .teams[r].id
                  ];

                await prisma.playerRoundStats.updateMany({
                  where: {
                    AND: [
                      { roundId: roundId },
                      {
                        playerId:
                          object.events[m].seriesState.games[p].segments[
                            q
                          ].teams[r].players[s].id,
                      },
                    ],
                  },
                  data: {
                    estimatedViewTime: EVTOfAlivePlayer,
                  },
                });
              }
            }
          }
          break;
        }
      }
      break;
    }
  }

  let roundLastedTime = timeDifference(
    object.occurredAt,
    gameStartedTimeIndex
  );
  await prisma.round.update({
    where: {
      roundId: roundId,
    },
    data: {
      roundLastedTime: roundLastedTime,
    },
  });

  // progressiveEVTTimeIndex = 0
  // EVTProbabilityOfTeam = {}
  // EVTProbabilityOfPlayer = {}
  // EVTTimeCummulativeTeam = {}
  // EVTPlayersAlive = {}

  //calculate Ace
  for (
    let p = 0;
    p <= object.events[m].seriesState.games.length - 1;
    p++
  ) {
    if (object.events[m].seriesState.games[p].id == roundEndedInGameId) {
      for (
        let q = 0;
        q <= object.events[m].seriesState.games[p].segments.length - 1;
        q++
      ) {
        if (
          object.events[m].seriesStateDelta.games[0].segments[0].id ==
          object.events[m].seriesState.games[p].segments[q].id
        ) {
          for (
            let s = 0;
            s <=
            object.events[m].seriesState.games[p].segments[q].teams[0]
              .players.length -
              1;
            s++
          ) {
            let percentageOppTeamKilled =
              object.events[m].seriesState.games[p].segments[q].teams[0]
                .players[s].kills /
              object.events[m].seriesState.games[p].segments[q].teams[1]
                .players.length;
            let AceBool = false;
            if (percentageOppTeamKilled == 1) {
              //player did an Ace
              AceBool = true;
            }
            await prisma.playerRoundStats.updateMany({
              where: {
                AND: [
                  {
                    playerId:
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[0].players[s].id,
                  },
                  { roundId: roundId },
                ],
              },
              data: {
                Ace: AceBool,
                percentageOppTeamkilled: percentageOppTeamKilled,
              },
            });
          }

          for (
            let s = 0;
            s <=
            object.events[m].seriesState.games[p].segments[q].teams[1]
              .players.length -
              1;
            s++
          ) {
            let percentageOppTeamKilled =
              object.events[m].seriesState.games[p].segments[q].teams[1]
                .players[s].kills /
              object.events[m].seriesState.games[p].segments[q].teams[0]
                .players.length;
            let AceBool = false;
            if (percentageOppTeamKilled == 1) {
              //player did an Ace
              AceBool = true;
            }
            await prisma.playerRoundStats.updateMany({
              where: {
                AND: [
                  {
                    playerId:
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[1].players[s].id,
                  },
                  { roundId: roundId },
                ],
              },
              data: {
                Ace: AceBool,
                percentageOppTeamkilled: percentageOppTeamKilled,
              },
            });
          }

          break;
        }
      }
      break;
    }
  }

  //calculate Clutch
  console.log("possibilityOfClutch");
  console.log(possibilityOfClutch);
  for (
    let p = 0;
    p <= object.events[m].seriesState.games.length - 1;
    p++
  ) {
    if (object.events[m].seriesState.games[p].id == roundEndedInGameId) {
      for (
        let q = 0;
        q <= object.events[m].seriesState.games[p].segments.length - 1;
        q++
      ) {
        if (
          object.events[m].seriesStateDelta.games[0].segments[0].id ==
          object.events[m].seriesState.games[p].segments[q].id
        ) {
          for (let k = 0; k <= possibilityOfClutch.length - 1; k++) {
            if (
              possibilityOfClutch[k].gameId == roundEndedInGameId &&
              possibilityOfClutch[k].roundId == roundId
            ) {
              let LPST = timeDifference(
                object.occurredAt,
                possibilityOfClutch[k].timestamp
              );
              if (
                object.events[m].seriesState.games[p].segments[q].teams[0]
                  .won == true &&
                possibilityOfClutch[k].teamId ==
                  object.events[m].seriesState.games[p].segments[q]
                    .teams[0].id &&
                object.events[m].seriesState.games[p].segments[q].teams[1]
                  .deaths ==
                  object.events[m].seriesState.games[p].segments[q]
                    .teams[1].players.length
              ) {
                //clutch happened
                await prisma.playerRoundStats.updateMany({
                  where: {
                    AND: [
                      { playerId: possibilityOfClutch[k].playerId },
                      { roundId: roundId },
                    ],
                  },
                  data: {
                    Clutch: true,
                    LastPersonStandingTime: LPST,
                  },
                });
                possibilityOfClutch.splice(k, 1);
                break;
              } else if (
                object.events[m].seriesState.games[p].segments[q].teams[1]
                  .won == true &&
                possibilityOfClutch[k].teamId ==
                  object.events[m].seriesState.games[p].segments[q]
                    .teams[1].id &&
                object.events[m].seriesState.games[p].segments[q].teams[0]
                  .deaths ==
                  object.events[m].seriesState.games[p].segments[q]
                    .teams[0].players.length
              ) {
                //clutch happened
                await prisma.playerRoundStats.updateMany({
                  where: {
                    AND: [
                      { playerId: possibilityOfClutch[k].playerId },
                      { roundId: roundId },
                    ],
                  },
                  data: {
                    Clutch: true,
                    LastPersonStandingTime: LPST,
                  },
                });
                possibilityOfClutch.splice(k, 1);
                break;
              } else {
                //clutch did not happen
                await prisma.playerRoundStats.updateMany({
                  where: {
                    AND: [
                      { playerId: possibilityOfClutch[k].playerId },
                      { roundId: roundId },
                    ],
                  },
                  data: {
                    LastPersonStandingTime: LPST,
                  },
                });
                possibilityOfClutch.splice(k, 1);
                break;
              }
            }
          }
        }
      }
    }
  }

  //update overall stats Overall View Time, Tournament View Time, overallRoundEstimatedViewTime,overallPercentageOfOpponentTeamKilled, overallRoundViewPercentage, overallAce, overallClutch
  //update overall sponsortenure stats
  let currentPlayerRoundStats = await prisma.playerRoundStats.findMany({
    where: {
      roundId: roundId,
    },
    select: {
      kills:true,
      Ace: true,
      Clutch: true,
      playerId:true,
      estimatedViewTime: true,
      percentageOppTeamkilled: true,
    },
  });

  // console.log('currentPlayerRoundStats',currentPlayerRoundStats)

  let roundPKPEvents = await prisma.event.findMany({
    where: {
      AND:[
      {eventType: 'PLAYER_KILLED_PLAYER'},
      {roundId: roundId}
      ]
    },
    select: {
      timestamp:true,
      playerKilledPlayerEvent:{
        select:{
          actorPlayerId:true,
          targetPlayerId:true,
        }
      }

    }
  });

  // console.log('roundPKPEvents',roundPKPEvents)
  let iteratingRoundPKPEvents = null;

  for (let p = 0; p <= currentPlayerRoundStats.length - 1; p++) {
    let playerOverallStats = await prisma.player.findFirst({
      where: {
        playerId: currentPlayerRoundStats[p].playerId,
      },
      select: {
        overallRoundViewPercentage: true,
        overallRoundEstimatedViewTime: true,
        overallPercentageOfOpponentTeamKilled: true,
        numberOfRounds: true,
        overallMomentsViewTime:true,
      },
    });

    // console.log('iteratingRoundPKPEvents',iteratingRoundPKPEvents);
    console.log('currentPlayerRoundStats[p].playerId',currentPlayerRoundStats[p].playerId)
    console.log('currentPlayerRoundStats[p].kills',currentPlayerRoundStats[p].kills)
    //calculate moments view time
    let sumMomentsViewTimeDeltas = 0
    if(currentPlayerRoundStats[p].kills > 1){

      let killprev = null;
      let killcurrent = null;
  
      for(let q=0; q<=roundPKPEvents.length-1; q++){
        if(currentPlayerRoundStats[p].playerId == roundPKPEvents[q].playerKilledPlayerEvent.actorPlayerId){
          killcurrent = roundPKPEvents[q].timestamp;
          if(killprev == null){
            killprev = roundPKPEvents[q].timestamp;
          }
          else{
            let delta = timeDifference(killcurrent,killprev)
            console.log('delta',delta)
            if(delta<=KILL_KILL_MOMENT_THRESHOLD){
              sumMomentsViewTimeDeltas = sumMomentsViewTimeDeltas + delta
              // console.log('sumMomentsViewTimeDeltas',sumMomentsViewTimeDeltas)
            }
            else if(delta>KILL_KILL_MOMENT_THRESHOLD){
              // popppedRoundPKPEvents.splice(q, 1);
              break;
            }
          }
          killprev = killcurrent
        }
      }
  

    }

    console.log('sumMomentsViewTimeDeltas',sumMomentsViewTimeDeltas)


    await prisma.player.update({
      where: {
        playerId: currentPlayerRoundStats[p].playerId,
      },
      data: {
        overallAce: {
          increment: currentPlayerRoundStats[p].Ace ? 1 : 0,
        },
        overallClutch: {
          increment: currentPlayerRoundStats[p].Clutch ? 1 : 0,
        },
        overallViewTime: {
          increment: currentPlayerRoundStats[p].estimatedViewTime,
        },
        numberOfRounds: {
          increment: 1,
        },
        overallRoundEstimatedViewTime:
          (playerOverallStats.overallRoundEstimatedViewTime *
            playerOverallStats.numberOfRounds +
            currentPlayerRoundStats[p].estimatedViewTime) /
          (playerOverallStats.numberOfRounds + 1),
        overallPercentageOfOpponentTeamKilled:
          (playerOverallStats.overallPercentageOfOpponentTeamKilled *
            playerOverallStats.numberOfRounds +
            currentPlayerRoundStats[p].percentageOppTeamkilled) /
          (playerOverallStats.numberOfRounds + 1),
        overallRoundViewPercentage:
          (playerOverallStats.overallRoundViewPercentage *
            playerOverallStats.numberOfRounds +
            currentPlayerRoundStats[p].estimatedViewTime /
              roundLastedTime) /
          (playerOverallStats.numberOfRounds + 1),
        overallMomentsViewTime:{
          increment:sumMomentsViewTimeDeltas
        }
      },
    });


    //sponsorTenureStatsUpdate
    let currentDate = new Date();
    let fetchedSponsorTenureStatsId = null;
    let needToCreate = false;
    
    const auctions = await prisma.auction.findMany({
        where: {
            player: {
                playerId: currentPlayerRoundStats[p].playerId,
            },
            auctionStatus: 'CLOSED',

        },
        select: {
            sponsorTenureStatsId: true,
            tenureStartDate: true,
            term: true,
            auctionId: true,
        }
    });

    if(auctions.length!=0){
      let tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
      tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

      if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
        fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
        needToCreate = true;
      }

      if(fetchedSponsorTenureStatsId!=null && needToCreate == true){
       
        let currentSponsorTenureStatsState = await prisma.sponsorTenureStats.findFirst({
          where:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          },
          select:{
            overallRoundViewPercentage: true,
            overallRoundEstimatedViewTime: true,
            overallPercentageOfOpponentTeamKilled: true,
            numberOfRounds: true,
          }
        })

       
        await prisma.sponsorTenureStats.update({
          where:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          },
          data:{
            overallAce: {
              increment: currentPlayerRoundStats[p].Ace ? 1 : 0,
            },
            overallClutch: {
              increment: currentPlayerRoundStats[p].Clutch ? 1 : 0,
            },
            overallViewTime: {
              increment: currentPlayerRoundStats[p].estimatedViewTime,
            },
            numberOfRounds: {
              increment: 1,
            },
            overallMomentsViewTime:{
              increment:sumMomentsViewTimeDeltas,
            },
            overallRoundEstimatedViewTime:
              (currentSponsorTenureStatsState.overallRoundEstimatedViewTime *
                currentSponsorTenureStatsState.numberOfRounds +
                currentPlayerRoundStats[p].estimatedViewTime) /
              (currentSponsorTenureStatsState.numberOfRounds + 1),
            overallPercentageOfOpponentTeamKilled:
              (currentSponsorTenureStatsState.overallPercentageOfOpponentTeamKilled *
                currentSponsorTenureStatsState.numberOfRounds +
                currentPlayerRoundStats[p].percentageOppTeamkilled) /
              (currentSponsorTenureStatsState.numberOfRounds + 1),
            overallRoundViewPercentage:
              (currentSponsorTenureStatsState.overallRoundViewPercentage *
                currentSponsorTenureStatsState.numberOfRounds +
                currentPlayerRoundStats[p].estimatedViewTime /
                  roundLastedTime) /
              (currentSponsorTenureStatsState.numberOfRounds + 1),
            
          }
        })
      }
    }


  }

  return eventCreated;


  //game ended round
}

async function updateForPlayerSelfKilledPlayer(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_SELF_DAMAGED_PLAYER",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerSelfDamagedPlayerEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
      damageDealt:
        object.events[m].seriesStateDelta.games[0].teams[0]
          .selfdamageTaken,
    },
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].actor.id },
      ],
    },
    data: {
      damageTaken: {
        increment:
          object.events[m].seriesStateDelta.games[0].teams[0]
            .selfdamageTaken,
      },
    },
  });

  await prisma.teamRoundStats.updateMany({
    where: {
      AND: [
        {
          roundId: roundId,
        },
        {
          teamId: object.events[m].seriesStateDelta.games[0].teams[0].id,
        },
      ],
    },
    data: {
      damageTaken: {
        increment:
          object.events[m].seriesStateDelta.games[0].teams[0]
            .selfdamageTaken,
      },
    },
  });

  return eventCreated;
}

async function updateForPlayerDamagedPlayer(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_DAMAGED_PLAYER",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerDamagedPlayerEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
      targetPlayerId: object.events[m].target.id,
      damageDealt: object.events[m].actor.stateDelta.round.damageDealt,
    }
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].actor.id },
      ],
    },
    data: {
      damageDealt: {
        increment: object.events[m].actor.stateDelta.round.damageDealt,
      },
    },
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].target.id },
      ],
    },
    data: {
      damageTaken: {
        increment: object.events[m].actor.stateDelta.round.damageDealt,
      },
    },
  });

  if (
    object.events[m].seriesStateDelta.games[0].teams[0].damageDealt ==
    undefined
  ) {
    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[0].id,
          },
        ],
      },
      data: {
        damageTaken: {
          increment:
            object.events[m].seriesStateDelta.games[0].teams[0]
              .damageTaken,
        },
      },
    });

    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[1].id,
          },
        ],
      },
      data: {
        damageDealt: {
          increment:
            object.events[m].seriesStateDelta.games[0].teams[1]
              .damageDealt,
        },
      },
    });
  } else if (
    object.events[m].seriesStateDelta.games[0].teams[0].damageTaken ==
    undefined
  ) {
    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[0].id,
          },
        ],
      },
      data: {
        damageDealt: {
          increment:
            object.events[m].seriesStateDelta.games[0].teams[0]
              .damageTaken,
        },
      },
    });

    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[1].id,
          },
        ],
      },
      data: {
        damageTaken: {
          increment:
            object.events[m].seriesStateDelta.games[0].teams[1]
              .damageDealt,
        },
      },
    });
  }

  //update overall player stats
  await prisma.player.update({
    where: {
      playerId: object.events[m].actor.id,
    },
    data: {
      overallDamageDealt: {
        increment: object.events[m].actor.stateDelta.round.damageDealt,
      },
    },
  });

  await prisma.player.update({
    where: {
      playerId: object.events[m].target.id,
    },
    data: {
      overallDamageTaken: {
        increment: object.events[m].actor.stateDelta.round.damageDealt,
      },
    },
  });

  //update sponsorTenureStats
  let currentDate = new Date();
  let fetchedSponsorTenureStatsId = null;
  let needToCreate = false;
  
  let auctions = await prisma.auction.findMany({
      where: {
          player: {
              playerId: object.events[m].actor.id,
          },
          auctionStatus: 'CLOSED',
      },
      select: {
          sponsorTenureStatsId: true,
          tenureStartDate: true,
          term: true,
          auctionId: true,
      }
  });

  let tenureEndDate = null;
  if(auctions.length!=0){
    tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
    tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

    if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
      fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
      needToCreate = true
    }

    if(fetchedSponsorTenureStatsId!=null && needToCreate == true){
      await prisma.sponsorTenureStats.update({
        where:{
          sponsorTenureStatsId:fetchedSponsorTenureStatsId,
        },
        data: {
          overallDamageDealt: {
            increment: object.events[m].actor.stateDelta.round.damageDealt,
          },
        },
      })
    }
  }


  currentDate = new Date();
  fetchedSponsorTenureStatsId = null;
  needToCreate = false;
  
  auctions = await prisma.auction.findMany({
      where: {
          player: {
              playerId: object.events[m].target.id,
          },
          auctionStatus: 'CLOSED',
      },
      select: {
          sponsorTenureStatsId: true,
          tenureStartDate: true,
          term: true,
          auctionId: true,
      }
  });

  if(auctions.length!=0){
    tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
    tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

    if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
      fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
      needToCreate = true;
    }

    if(fetchedSponsorTenureStatsId!=null && needToCreate == true){
      await prisma.sponsorTenureStats.update({
        where:{
          sponsorTenureStatsId:fetchedSponsorTenureStatsId,
        },
        data: {
          overallDamageTaken: {
            increment: object.events[m].actor.stateDelta.round.damageDealt,
          },
        },
      })
    }
  }

  return eventCreated;
  
}

async function updateForPlayerKilledPlayer(object,m) {
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_KILLED_PLAYER",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  let actorCurrentState = await prisma.playerRoundStats.findFirst({
    where: {
      AND: [
        {
          playerId: object.events[m].actor.id,
        },
        {
          roundId: roundId,
        },
      ],
    },
    select: {
      weaponKills: true,
      headshots: true,
    },
  });

  //console.log('actorCurrentState.weaponKills',actorCurrentState.weaponKills)

  let gunUsed = Object.keys(
    object.events[m].actor.stateDelta.round.weaponKills
  )[0];

  await prisma.playerKilledPlayerEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
      targetPlayerId: object.events[m].target.id,
      headShot: object.events[m].actor.stateDelta.round.headShots,
      weaponKills: object.events[m].actor.stateDelta.round.weaponKills,
    },
  });

  if (actorCurrentState.weaponKills != undefined) {
    if (actorCurrentState.weaponKills[gunUsed] == undefined) {
      actorCurrentState.weaponKills[gunUsed] = 1;
    } else {
      actorCurrentState.weaponKills[gunUsed] =
        actorCurrentState.weaponKills[gunUsed] + 1;
    }
  } else {
    actorCurrentState.weaponKills =
      object.events[m].actor.stateDelta.round.weaponKills;
  }

  //console.log('actorCurrentState.weaponKills',actorCurrentState.weaponKills)

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].actor.id },
      ],
    },
    data: {
      killAssistsReceived: {
        increment:
          object.events[m].actor.stateDelta.round.killAssistsReceived ==
          undefined
            ? 0
            : 1,
      },
      kills: {
        increment: 1,
      },
      headshots: {
        increment:
          object.events[m].actor.stateDelta.round.headshots == undefined
            ? 0
            : 1,
      },
      weaponKills: actorCurrentState.weaponKills,
    },
  });

  if (
    object.events[m].actor.stateDelta.round
      .killAssistsReceivedFromPlayer != undefined
  ) {
    await prisma.playerRoundStats.updateMany({
      where: {
        AND: [
          { roundId: roundId },
          {
            playerId:
              object.events[m].actor.stateDelta.round
                .killAssistsReceivedFromPlayer[0].playerId,
          },
        ],
      },
      data: {
        killAssistsGiven: {
          increment: 1,
        },
      },
    });

    //update Overall Player Stats as well
    await prisma.player.updateMany({
      where: {
        playerId:
          object.events[m].actor.stateDelta.round
            .killAssistsReceivedFromPlayer[0].playerId,
      },
      data: {
        killAssistsGiven: {
          increment: 1,
        },
      },
    });

    //update SponsorTenure Stats as well
    let currentDate = new Date();
    let fetchedSponsorTenureStatsId = null;
    let needToCreate = false;
    
    let auctions = await prisma.auction.findMany({
        where: {
            player: {
                playerId: object.events[m].actor.stateDelta.round
                .killAssistsReceivedFromPlayer[0].playerId,
            },
            auctionStatus: 'CLOSED',

        },
        select: {
            sponsorTenureStatsId: true,
            tenureStartDate: true,
            term: true,
            auctionId: true,
        }
    });

    let tenureEndDate = null;
    if(auctions.length!=0){
      tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
      tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

      if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
        fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
        needToCreate = true;
      }

      if(fetchedSponsorTenureStatsId!=null && needToCreate ==true){
        await prisma.sponsorTenureStats.update({
          where:{
            sponsorTenureStatsId:fetchedSponsorTenureStatsId,
          },
          data: {
            killAssistsGiven: {
              increment: 1,
            },
          },
        })
      }
    }

  }

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].target.id },
      ],
    },
    data: {
      deaths: {
        increment: 1,
      },
    },
  });

  //update Player Overall Stats, Kills, Kill Asists Received, headshots

  await prisma.player.update({
    where: {
      playerId: object.events[m].actor.id,
    },
    data: {
      killAssistsReceived: {
        increment:
          object.events[m].actor.stateDelta.round.killAssistsReceived ==
          undefined
            ? 0
            : 1,
      },
      kills: {
        increment: 1,
      },
      headshots: {
        increment:
          object.events[m].actor.stateDelta.round.headshots == undefined
            ? 0
            : 1,
      },
    },
  });

  //update Player Stats for Dead Player, Deaths,
  await prisma.player.update({
    where: {
      playerId: object.events[m].target.id,
    },
    data: {
      deaths: {
        increment: 1,
      },
    },
  });

  //update SponsorTenureStats  Overall Stats, Kills, Kill Asists Received, headshots
  let currentDate = new Date();
  let fetchedSponsorTenureStatsId = null;
  let needToCreate = false;
  
  let auctions = await prisma.auction.findMany({
      where: {
          player: {
              playerId: object.events[m].actor.id,
          },
          auctionStatus: 'CLOSED',

      },
      select: {
          sponsorTenureStatsId: true,
          tenureStartDate: true,
          term: true,
          auctionId: true,
      }
  });

  let tenureEndDate = null;
  if(auctions.length!=0){
    tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
    tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

    if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
      fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
      needToCreate = true;
    }

    if(fetchedSponsorTenureStatsId!=null && needToCreate ==true){
      await prisma.sponsorTenureStats.update({
        where:{
          sponsorTenureStatsId:fetchedSponsorTenureStatsId,
        },
        data:{
          killAssistsReceived: {
            increment:
              object.events[m].actor.stateDelta.round.killAssistsReceived ==
              undefined
                ? 0
                : 1,
          },
          kills: {
            increment: 1,
          },
          headshots: {
            increment:
              object.events[m].actor.stateDelta.round.headshots == undefined
                ? 0
                : 1,
          },
        }
      })
    }
  }

  //update Player Stats for Dead Player, Deaths,
  currentDate = new Date();
  fetchedSponsorTenureStatsId = null;
  needToCreate = false;
  
  auctions = await prisma.auction.findMany({
      where: {
          player: {
              playerId: object.events[m].target.id,
          },
          auctionStatus: 'CLOSED',

      },
      select: {
          sponsorTenureStatsId: true,
          tenureStartDate: true,
          term: true,
          auctionId:true,
      }
  });

  if(auctions.length!=0){
    tenureEndDate = new Date(auctions[auctions.length-1].tenureStartDate);
    tenureEndDate.setMonth(tenureEndDate.getMonth() + auctions[auctions.length-1].term);

    if (new Date(auctions[auctions.length-1].tenureStartDate) < currentDate && tenureEndDate > currentDate) {
      fetchedSponsorTenureStatsId = auctions[auctions.length-1].sponsorTenureStatsId; // This is the ID you are looking for
      needToCreate = true;
    }

    if(fetchedSponsorTenureStatsId!=null && needToCreate == true){
      await prisma.sponsorTenureStats.update({
        where:{
          sponsorTenureStatsId:fetchedSponsorTenureStatsId,
        },
        data: {
          deaths: {
            increment: 1,
          },
        },
      })
    }
  }




  if (
    object.events[m].seriesStateDelta.games[0].teams[0].deaths ==
    undefined
  ) {
    let teamRoundStatsState = await prisma.teamRoundStats.findFirst({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[0].id,
          },
        ],
      },
      select: {
        weaponKills: true,
      },
    });

    if (teamRoundStatsState.weaponKills != undefined) {
      if (teamRoundStatsState.weaponKills[gunUsed] == undefined) {
        teamRoundStatsState.weaponKills[gunUsed] = 1;
      } else {
        teamRoundStatsState.weaponKills[gunUsed] =
          teamRoundStatsState.weaponKills[gunUsed] + 1;
      }
    } else {
      teamRoundStatsState.weaponKills =
        object.events[m].actor.stateDelta.round.weaponKills;
    }

    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[0].id,
          },
        ],
      },
      data: {
        kills: {
          increment: 1,
        },
        headshots: {
          increment:
            object.events[m].actor.stateDelta.round.headshots == undefined
              ? 0
              : 1,
        },
        weaponKills: teamRoundStatsState.weaponKills,
      },
    });

    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[1].id,
          },
        ],
      },
      data: {
        deaths: { increment: 1 },
      },
    });
  } else if (
    object.events[m].seriesStateDelta.games[0].teams[0].kills == undefined
  ) {
    let teamRoundStatsState = await prisma.teamRoundStats.findFirst({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[1].id,
          },
        ],
      },
      select: {
        weaponKills: true,
      },
    });

    if (teamRoundStatsState.weaponKills != undefined) {
      if (teamRoundStatsState.weaponKills[gunUsed] == undefined) {
        teamRoundStatsState.weaponKills[gunUsed] = 1;
      } else {
        teamRoundStatsState.weaponKills[gunUsed] =
          teamRoundStatsState.weaponKills[gunUsed] + 1;
      }
    } else {
      teamRoundStatsState.weaponKills =
        object.events[m].actor.stateDelta.round.weaponKills;
    }

    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[1].id,
          },
        ],
      },
      data: {
        kills: {
          increment: 1,
        },
        headshots: {
          increment:
            object.events[m].actor.stateDelta.round.headshots == undefined
              ? 0
              : 1,
        },
        weaponKills: teamRoundStatsState.weaponKills,
      },
    });

    await prisma.teamRoundStats.updateMany({
      where: {
        AND: [
          {
            roundId: roundId,
          },
          {
            teamId:
              object.events[m].seriesStateDelta.games[0].teams[0].id,
          },
        ],
      },
      data: {
        deaths: { increment: 1 },
      },
    });
  }

  //lastman standing and possibility of Clutch

  //find which team the death happened
  //FIND whether the above team has deaths = player length -1
  // if so add possibility of clucth

  if (
    object.events[m].seriesStateDelta.games[0].teams[0].kills == undefined
  ) {
    for (
      let p = 0;
      p <= object.events[m].seriesState.games.length - 1;
      p++
    ) {
      if (
        object.events[m].seriesState.games[p].id == roundEndedInGameId
      ) {
        console.log(roundEndedInGameId + " is matching");
        for (
          let q = 0;
          q <= object.events[m].seriesState.games[p].segments.length - 1;
          q++
        ) {
          if (
            object.events[m].seriesState.games[p].segments[q].id ==
            object.events[m].seriesStateDelta.games[0].segments[0].id
          ) {
            for (
              let r = 0;
              r <=
              object.events[m].seriesState.games[p].segments[q].teams
                .length -
                1;
              r++
            ) {
              if (
                object.events[m].seriesState.games[p].segments[q].teams[r]
                  .id ==
                object.events[m].seriesStateDelta.games[0].teams[0].id
              ) {
                if (
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].deaths ==
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].players.length -
                    1
                ) {
                  for (
                    let s = 0;
                    s <=
                    object.events[m].seriesState.games[p].segments[q]
                      .teams[r].players.length -
                      1;
                    s++
                  ) {
                    if (
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[r].players[s].alive == true &&
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[convert10(r)].deaths < 4
                    ) {
                      let present = false;
                      for (
                        let t = 0;
                        t <= possibilityOfClutch.length - 1;
                        t++
                      ) {
                        if (
                          possibilityOfClutch[t].gameId ==
                            roundEndedInGameId &&
                          possibilityOfClutch[t].roundId == roundId
                        ) {
                          present = true;
                          break;
                        }
                      }
                      if (present == false) {
                        possibilityOfClutch.push({
                          gameId: roundEndedInGameId,
                          roundId: roundId,
                          playerId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].players[s].id,
                          teamId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].id,
                          timestamp: object.occurredAt,
                          playersDeadInOwnTeam:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].deaths,
                          seriesState:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r],
                        });
                        allPossibleClutches.push({
                          gameId: roundEndedInGameId,
                          roundId: roundId,
                          playerId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].players[s].id,
                          teamId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].id,
                          timestamp: object.occurredAt,
                          playersDeadInOwnTeam:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].deaths,
                          seriesState:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r],
                        });
                      }
                      break;
                    }
                  }
                }
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
  } else if (
    object.events[m].seriesStateDelta.games[0].teams[1].kills == undefined
  ) {
    for (
      let p = 0;
      p <= object.events[m].seriesState.games.length - 1;
      p++
    ) {
      if (
        object.events[m].seriesState.games[p].id == roundEndedInGameId
      ) {
        console.log(roundEndedInGameId + " is matching");
        for (
          let q = 0;
          q <= object.events[m].seriesState.games[p].segments.length - 1;
          q++
        ) {
          if (
            object.events[m].seriesState.games[p].segments[q].id ==
            object.events[m].seriesStateDelta.games[0].segments[0].id
          ) {
            for (
              let r = 0;
              r <=
              object.events[m].seriesState.games[p].segments[q].teams
                .length -
                1;
              r++
            ) {
              if (
                object.events[m].seriesState.games[p].segments[q].teams[r]
                  .id ==
                object.events[m].seriesStateDelta.games[0].teams[1].id
              ) {
                if (
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].deaths ==
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].players.length -
                    1
                ) {
                  for (
                    let s = 0;
                    s <=
                    object.events[m].seriesState.games[p].segments[q]
                      .teams[r].players.length -
                      1;
                    s++
                  ) {
                    if (
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[r].players[s].alive == true &&
                      object.events[m].seriesState.games[p].segments[q]
                        .teams[convert10(r)].deaths < 4
                    ) {
                      let present = false;
                      for (
                        let t = 0;
                        t <= possibilityOfClutch.length - 1;
                        t++
                      ) {
                        if (
                          possibilityOfClutch[t].gameId ==
                            roundEndedInGameId &&
                          possibilityOfClutch[t].roundId == roundId
                        ) {
                          present = true;
                          break;
                        }
                      }
                      if (present == false) {
                        possibilityOfClutch.push({
                          gameId: roundEndedInGameId,
                          roundId: roundId,
                          playerId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].players[s].id,
                          teamId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].id,
                          timestamp: object.occurredAt,
                          playersDeadInOwnTeam:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].deaths,
                          seriesState:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r],
                        });
                        allPossibleClutches.push({
                          gameId: roundEndedInGameId,
                          roundId: roundId,
                          playerId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].players[s].id,
                          teamId:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].id,
                          timestamp: object.occurredAt,
                          playersDeadInOwnTeam:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r].deaths,
                          seriesState:
                            object.events[m].seriesState.games[p]
                              .segments[q].teams[r],
                        });
                      }
                      break;
                    }
                  }
                }
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
  }

  //update estimated viewtime for the player who died
  if (
    object.events[m].seriesStateDelta.games[0].teams[0].kills == undefined
  ) {
    for (
      let p = 0;
      p <= object.events[m].seriesState.games.length - 1;
      p++
    ) {
      if (
        object.events[m].seriesState.games[p].id == roundEndedInGameId
      ) {
        for (
          let q = 0;
          q <= object.events[m].seriesState.games[p].segments.length - 1;
          q++
        ) {
          if (
            object.events[m].seriesState.games[p].segments[q].id ==
            object.events[m].seriesStateDelta.games[0].segments[0].id
          ) {
            for (
              let r = 0;
              r <=
              object.events[m].seriesState.games[p].segments[q].teams
                .length -
                1;
              r++
            ) {
              if (
                object.events[m].seriesState.games[p].segments[q].teams[r]
                  .id ==
                object.events[m].seriesStateDelta.games[0].teams[0].id
              ) {
                let numberOfPlayersAliveOT =
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].players.length -
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].deaths;
                let numberOfPlayersAliveET =
                  object.events[m].seriesState.games[p].segments[q].teams[
                    convert10(r)
                  ].players.length -
                  object.events[m].seriesState.games[p].segments[q].teams[
                    convert10(r)
                  ].deaths;
                let EVTOfDeadPlayer =
                  (timeDifference(
                    object.occurredAt,
                    progressiveEVTTimeIndex
                  ) *
                    EVTProbabilityOfTeam[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[0].id
                      )
                    ]) /
                    EVTPlayersAlive[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[0].id
                      )
                    ] +
                  EVTTimeCummulativeTeam[
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  ];
                EVTTimeCummulativeTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  )
                ] = EVTOfDeadPlayer;
                EVTTimeCummulativeTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  )
                ] =
                  (timeDifference(
                    object.occurredAt,
                    progressiveEVTTimeIndex
                  ) *
                    EVTProbabilityOfTeam[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[1].id
                      )
                    ]) /
                    EVTPlayersAlive[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[1].id
                      )
                    ] +
                  EVTTimeCummulativeTeam[
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  ];
                progressiveEVTTimeIndex = object.occurredAt;
                EVTProbabilityOfTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  )
                ] =
                  numberOfPlayersAliveET /
                  (numberOfPlayersAliveET + numberOfPlayersAliveOT);
                EVTProbabilityOfTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  )
                ] =
                  numberOfPlayersAliveOT /
                  (numberOfPlayersAliveET + numberOfPlayersAliveOT);
                EVTPlayersAlive[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  )
                ] = numberOfPlayersAliveOT;

                await prisma.playerRoundStats.updateMany({
                  where: {
                    AND: [
                      { roundId: roundId },
                      {
                        playerId:
                          object.events[m].seriesStateDelta.games[0]
                            .teams[0].players[0].id,
                      },
                    ],
                  },
                  data: {
                    estimatedViewTime: EVTOfDeadPlayer,
                  },
                });

                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
  } else if (
    object.events[m].seriesStateDelta.games[0].teams[1].kills == undefined
  ) {
    for (
      let p = 0;
      p <= object.events[m].seriesState.games.length - 1;
      p++
    ) {
      if (
        object.events[m].seriesState.games[p].id == roundEndedInGameId
      ) {
        for (
          let q = 0;
          q <= object.events[m].seriesState.games[p].segments.length - 1;
          q++
        ) {
          if (
            object.events[m].seriesState.games[p].segments[q].id ==
            object.events[m].seriesStateDelta.games[0].segments[0].id
          ) {
            for (
              let r = 0;
              r <=
              object.events[m].seriesState.games[p].segments[q].teams
                .length -
                1;
              r++
            ) {
              if (
                object.events[m].seriesState.games[p].segments[q].teams[r]
                  .id ==
                object.events[m].seriesStateDelta.games[0].teams[1].id
              ) {
                let numberOfPlayersAliveOT =
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].players.length -
                  object.events[m].seriesState.games[p].segments[q].teams[
                    r
                  ].deaths;
                let numberOfPlayersAliveET =
                  object.events[m].seriesState.games[p].segments[q].teams[
                    convert10(r)
                  ].players.length -
                  object.events[m].seriesState.games[p].segments[q].teams[
                    convert10(r)
                  ].deaths;
                let EVTOfDeadPlayer =
                  (timeDifference(
                    object.occurredAt,
                    progressiveEVTTimeIndex
                  ) *
                    EVTProbabilityOfTeam[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[1].id
                      )
                    ]) /
                    EVTPlayersAlive[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[1].id
                      )
                    ] +
                  EVTTimeCummulativeTeam[
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  ];
                EVTTimeCummulativeTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  )
                ] = EVTOfDeadPlayer;
                EVTTimeCummulativeTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  )
                ] =
                  (timeDifference(
                    object.occurredAt,
                    progressiveEVTTimeIndex
                  ) *
                    EVTProbabilityOfTeam[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[0].id
                      )
                    ]) /
                    EVTPlayersAlive[
                      String(
                        object.events[m].seriesStateDelta.games[0]
                          .teams[0].id
                      )
                    ] +
                  EVTTimeCummulativeTeam[
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  ];
                progressiveEVTTimeIndex = object.occurredAt;
                EVTProbabilityOfTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  )
                ] =
                  numberOfPlayersAliveET /
                  (numberOfPlayersAliveET + numberOfPlayersAliveOT);
                EVTProbabilityOfTeam[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[0].id
                  )
                ] =
                  numberOfPlayersAliveOT /
                  (numberOfPlayersAliveET + numberOfPlayersAliveOT);
                EVTPlayersAlive[
                  String(
                    object.events[m].seriesStateDelta.games[0].teams[1].id
                  )
                ] = numberOfPlayersAliveOT;

                await prisma.playerRoundStats.updateMany({
                  where: {
                    AND: [
                      { roundId: roundId },
                      {
                        playerId:
                          object.events[m].seriesStateDelta.games[0]
                            .teams[1].players[0].id,
                      },
                    ],
                  },
                  data: {
                    estimatedViewTime: EVTOfDeadPlayer,
                  },
                });

                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
  }

  return eventCreated;

}

async function updateForPlayerTeamDamagedPlayer(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_TEAM_DAMAGED_PLAYER",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerTeamDamagedPlayerEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
      targetPlayerId: object.events[m].target.id,
      damageDealt:
        object.events[m].actor.stateDelta.round.teamdamageDealt,
    },
  });

  console.log("teamDamageDealt", object.events[m].actor.stateDelta.round);
  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].actor.id },
      ],
    },
    data: {
      teamDamageDealt: {
        increment:
          object.events[m].actor.stateDelta.round.teamdamageDealt,
      },
    },
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].target.id },
      ],
    },
    data: {
      teamDamageTaken: {
        increment:
          object.events[m].actor.stateDelta.round.teamdamageDealt,
      },
    },
  });

  await prisma.teamRoundStats.updateMany({
    where: {
      AND: [
        {
          roundId: roundId,
        },
        {
          teamId: object.events[m].seriesStateDelta.games[0].teams[0].id,
        },
      ],
    },
    data: {
      teamDamageOccured: {
        increment:
          object.events[m].seriesStateDelta.games[0].teams[0]
            .teamdamageDealt,
      },
    },
  });

  return eventCreated;
} 

async function updateForPlayerTeamKilledPlayer(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_TEAM_KILLED_PLAYER",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerTeamKilledPlayerEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
      targetPlayerId: object.events[m].target.id,
    },
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].actor.id },
      ],
    },
    data: {
      teamKills: {
        increment: 1,
      },
    },
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].target.id },
      ],
    },
    data: {
      deaths: {
        increment: 1,
      },
    },
  });

  await prisma.teamRoundStats.updateMany({
    where: {
      AND: [
        {
          roundId: roundId,
        },
        {
          teamId: object.events[m].seriesStateDelta.games[0].teams[0].id,
        },
      ],
    },
    data: {
      deaths: { increment: 1 },
      teamKillsOccured: { increment: 1 },
    },
  });

  return eventCreated
}

async function updateForPlayerSelfKilledPlayer(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_SELF_KILLED_PLAYER",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerSelfKilledPlayerEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
    },
  });

  await prisma.playerRoundStats.updateMany({
    where: {
      AND: [
        { roundId: roundId },
        { playerId: object.events[m].actor.id },
      ],
    },
    data: {
      deaths: {
        increment: 1,
      },
      selfKills: {
        increment: 1,
      },
    },
  });

  await prisma.teamRoundStats.updateMany({
    where: {
      AND: [
        {
          roundId: roundId,
        },
        {
          teamId: object.events[m].seriesStateDelta.games[0].teams[0].id,
        },
      ],
    },
    data: {
      selfKills: {
        increment: 1,
      },
      deaths: {
        increment: 1,
      },
    },
  });

  return eventCreated;

}

async function updateForPlayerCompletedDefuseBomb(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_COMPLETED_DEFUSE_BOMB",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerCompletedDefuseBombEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
    },
  });

  return eventCreated;

}

async function updateForPlayerCompletedExplodeBomb(object,m) {
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_COMPLETED_EXPLODE_BOMB",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerCompletedExplodeBombEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
    },
  });

  return eventCreated;
}

async function updateForPlayerCompletedPlantBomb(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_COMPLETED_PLANT_BOMB",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerCompletedPlantBombEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
    },
  });

  return eventCreated;
}

async function updateForPlayerCompletedBeginDefuseWithKit(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_COMPLETED_BEGIN_DEFUSE_WITH_KIT",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerCompletedBeginDefuseWithKitEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
    },
  });

  return eventCreated;

}

async function updateForPlayerCompletedBeginDefuseWithoutKit(object,m){
  let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
  let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
    .concat(":")
    .concat(roundEndedInGameId);

  let eventCreated = await prisma.event.create({
    data: {
      eventId: object.events[m].id,
      eventType: "PLAYER_COMPLETED_BEGIN_DEFUSE_WITHOUT_KIT",
      matchId: object.events[m].seriesStateDelta.games[0].id,
      timestamp: object.occurredAt,
      round: {
        connect: {
          roundId: roundId,
        },
      },
    },
    select:{
      eventId:true,
      eventType:true,
      matchId:true,
      roundId:true,
      timestamp:true,
    }
  });

  await prisma.playerCompletedBeginDefuseWithoutKitEvent.create({
    data: {
      event: {
        connect: {
          eventId: object.events[m].id,
        },
      },
      actorPlayerId: object.events[m].actor.id,
    },
  });

  return eventCreated;
}

const doTask = async (object) => {
  // console.log(`Starting task: ${task}`);
  // await new Promise(resolve => setTimeout(resolve, 2000));  // Simulate async work with a delay
  // console.log(`Finished task: ${task}`);
  console.log("object", object.sequenceNumber);

    for (let m = 0; m <= object.events.length - 1; m++) {
      if (object.events[m].type == "tournament-started-series") {
        await updatesForTournamentStartedSeries(object,m);
      } else if (object.events[m].type == "series-started-game") {     


        await updatesForSeriesStartedGame(object,m)

        let tournamentId = object.events[m].seriesStateDelta.id

        //create scoreboard player cards 
        let scoreBoard = await prisma.scoreBoard.create({
          data:{
            match:{
              connect:{
                matchId:object.events[m].seriesStateDelta.games[0].id
              }
            },
            teamAId:object.events[m].seriesState.teams[0].id,
            teamBId:object.events[m].seriesState.teams[1].id,
            teamAName:object.events[m].seriesState.teams[0].name,
            teamBName:object.events[m].seriesState.teams[1].name,
          },
          select:{
            scoreBoardId:true,
          }
        })

        // playercards for all players link to scoreboard
        for (
          let n = 0;
          n <= object.events[m].seriesState.teams[0].players.length - 1;
          n++
        ) {
          await prisma.scoreboardPlayerCard.create({
            data: {
              player:{
                connect:{
                  playerId:object.events[m].seriesState.teams[0].players[n].id,
                }
              },
              scoreBoard:{
                connect:{
                  scoreBoardId:scoreBoard.scoreBoardId
                }
              },
              teamId:object.events[m].seriesState.teams[0].id,
            },
          });
        }

        for (
          let n = 0;
          n <= object.events[m].seriesState.teams[1].players.length - 1;
          n++
        ) {
          await prisma.scoreboardPlayerCard.create({
            data: {
              player:{
                connect:{
                  playerId:object.events[m].seriesState.teams[1].players[n].id,
                }
              },
              scoreBoard:{
                connect:{
                  scoreBoardId:scoreBoard.scoreBoardId
                }
              },
              teamId:object.events[m].seriesState.teams[1].id,
            },
          });
        }

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)
        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated:{matchId:object.events[m].seriesStateDelta.games[0].id}}});
      
      } else if (object.events[m].type == "series-!started-game") {
        if (reverseEntropyEvents == true) {

          let scoreBoard = await prisma.scoreBoard.findFirst({
              where:{
                  matchId:object.events[m].seriesStateDelta.games[0].id
                },
              select:{
                scoreBoardId:true,
              }
          })

          for (
            let n = 0;
            n <= object.events[m].seriesState.teams[0].players.length - 1;
            n++
          ) {
            await prisma.scoreboardPlayerCard.deleteMany({
              where: {
                playerId:object.events[m].seriesState.teams[0].players[n].id,
                scoreBoardId:scoreBoard.scoreBoardId
              }
            });
          }
  
          for (
            let n = 0;
            n <= object.events[m].seriesState.teams[1].players.length - 1;
            n++
          ) {
            await prisma.scoreboardPlayerCard.deleteMany({
                where:{
                  playerId:object.events[m].seriesState.teams[1].players[n].id,
                  scoreBoardId:scoreBoard.scoreBoardId
                }
            });
          }

          await prisma.scoreBoard.delete({
            where:{
              matchId: object.events[m].seriesStateDelta.games[0].id,
          }});
        
          await updateForSeriesNotStartedGame(object,m)

          let tournamentScoreboard = await prisma.tournament.findFirst({
            where:{
              tournamentId:object.events[m].seriesStateDelta.id,
            },
            select:{
              matches:{
                select:{
                  matchId:true,
                  scoreboard:{
                    select:{
                      scoreBoardId:true,
                      matchId:true,
                      match:{
                        select:{
                          tournamentId:true
                        }
                      },
                      scoreboardPlayerCard:{
                        select:{
                          player:{
                            select:{
                              name:true,
                              playerId:true,
                            }
                          },
                          kills:true,
                          deaths:true,
                          assists:true,
                          health:true,
                          alive:true,
                          armor:true,
                          itemsOwned:true,
                          teamId:true,
                          damageDealtInstant:true,
                          damageTakenInstant:true,
                          bombDefusing:true,
                        },
                        orderBy:{
                          player:{
                            name:'asc'
                          }
                        }
                      },
                      teamAId:true,
                      teamBId:true,
                      teamAName:true,
                      teamBName:true,
                      roundsWonTeamA:true,
                      roundsWonTeamB:true,
                      wonTeamId:true,
                      bombPlanted:true,
                      bombExploded:true,
                      bombDiffused:true,
                    }
                  }
                }
              }
            }
          })
  
          await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated:{matchId:object.events[m].seriesStateDelta.games[0].id}}});

        }
      } else if (object.events[m].type == "grid-invalidated-series") {
        reverseEntropyEvents = true;
      } else if (object.events[m].type == "grid-validated-series") {
        reverseEntropyEvents = false;
      } else if (object.events[m].type == "game-started-round") {
      
          let eventCreated = await updateForGameStartedRound(object,m);

          let scoreBoard = await prisma.scoreBoard.findFirst({
            where:{
                matchId:object.events[m].seriesStateDelta.games[0].id
            },
            select:{
              scoreBoardId:true,
            }
          })

          // playercards for all players link to scoreboard
          for (
            let n = 0;
            n <= object.events[m].seriesState.teams[0].players.length - 1;
            n++
          ) {
            await prisma.scoreboardPlayerCard.updateMany({
              where: {
                    playerId:object.events[m].seriesState.teams[0].players[n].id,
                    scoreBoardId:scoreBoard.scoreBoardId
              },
              data:{
                health:100,
                armor:100,
                alive:true,
                damageDealtInstant:false,
                damageTakenInstant:false,
                bombDefusing:false,
              }
            });
          }
  
          for (
            let n = 0;
            n <= object.events[m].seriesState.teams[1].players.length - 1;
            n++
          ) {
            await prisma.scoreboardPlayerCard.updateMany({
              where: {
                    playerId:object.events[m].seriesState.teams[1].players[n].id,
                    scoreBoardId:scoreBoard.scoreBoardId
              },
              data:{
                health:100,
                armor:100,
                alive:true,
                damageDealtInstant:false,
                damageTakenInstant:false,
                bombDefusing:false,
              }
            });
          }

          await prisma.scoreBoard.update({
            where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
            },
            data:{
              bombPlanted:false,
              bombExploded:false,
              bombDiffused:false,
            }
          })

          let tournamentScoreboard = await prisma.tournament.findFirst({
            where:{
              tournamentId:object.events[m].seriesStateDelta.id,
            },
            select:{
              matches:{
                select:{
                  matchId:true,
                  scoreboard:{
                    select:{
                      scoreBoardId:true,
                      matchId:true,
                      match:{
                        select:{
                          tournamentId:true
                        }
                      },
                      scoreboardPlayerCard:{
                        select:{
                          player:{
                            select:{
                              name:true,
                              playerId:true,
                            }
                          },
                          kills:true,
                          deaths:true,
                          assists:true,
                          health:true,
                          alive:true,
                          armor:true,
                          itemsOwned:true,
                          teamId:true,
                          damageDealtInstant:true,
                          damageTakenInstant:true,
                          bombDefusing:true,
                        },
                        orderBy:{
                          player:{
                            name:'asc'
                          }
                        }
                      },
                      teamAId:true,
                      teamBId:true,
                      teamAName:true,
                      teamBName:true,
                      roundsWonTeamA:true,
                      roundsWonTeamB:true,
                      wonTeamId:true,
                      bombPlanted:true,
                      bombExploded:true,
                      bombDiffused:true,
                    }
                  }
                }
              }
            }
          })
  
          //console.log('tournamentScoreboard',tournamentScoreboard)
          await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});
        
      } else if (object.events[m].type == "game-!started-round") {
        if (reverseEntropyEvents == true) {
          await updateForGameNotStartedRound(object,m)
        }
      } else if (object.events[m].type == "game-ended-round") {

        let roundEndedInGameId = object.events[m].seriesStateDelta.games[0].id;
        let roundId = object.events[m].seriesStateDelta.games[0].segments[0].id
          .concat(":")
          .concat(roundEndedInGameId);

        let eventCreated = await updateForGameEndedRound(object,m)

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
            teamAId:true,
            teamBId:true,
          }
        })

        for (let p = 0; p <= object.events[m].seriesState.games.length - 1; p++) {
          if (object.events[m].seriesState.games[p].id == roundEndedInGameId) {
            for (let q = 0; q <= object.events[m].seriesState.games[p].segments.length - 1; q++) {
              if ( object.events[m].seriesStateDelta.games[0].segments[0].id == object.events[m].seriesState.games[p].segments[q].id) {
              
                if (object.events[m].seriesState.games[p].segments[q].teams[0].won == true){

                  if(scoreBoard.teamAId == object.events[m].seriesState.games[p].segments[q].teams[0].id){
                    await prisma.scoreBoard.update({
                      where:{
                        scoreBoardId:scoreBoard.scoreBoardId,
                      },
                      data:{
                        roundsWonTeamA:{
                          increment:1
                        }
                      }
                    })
                  }
                  else{
                    await prisma.scoreBoard.update({
                      where:{
                        scoreBoardId:scoreBoard.scoreBoardId,
                      },
                      data:{
                        roundsWonTeamB:{
                          increment:1
                        }
                      }
                    })
                  }

                }else{

                  if(scoreBoard.teamAId == object.events[m].seriesState.games[p].segments[q].teams[1].id){
                    await prisma.scoreBoard.update({
                      where:{
                        scoreBoardId:scoreBoard.scoreBoardId,
                      },
                      data:{
                        roundsWonTeamA:{
                          increment:1
                        }
                      }
                    })
                  }
                  else{
                    await prisma.scoreBoard.update({
                      where:{
                        scoreBoardId:scoreBoard.scoreBoardId,
                      },
                      data:{
                        roundsWonTeamB:{
                          increment:1
                        }
                      }
                    })
                  }

                }

                break;
              }
            }
            
            break;
          }
        }

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});
      } else if (object.events[m].type == "player-selfdamaged-player") {

        let eventCreated = await updateForPlayerSelfKilledPlayer(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
            where:{
                playerId:object.events[m].actor.id,
                scoreBoardId:scoreBoard.scoreBoardId,
            },
            data:{
                health:{
                    decrement:object.events[m].seriesStateDelta.games[0].teams[0].selfdamageTaken,
                },
                armor:object.events[m].actor.state.game.currentArmor,
                damageTakenInstant:true,
            }
        })

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
              playerId:object.events[m].actor.id,
              scoreBoardId:scoreBoard.scoreBoardId,
          },
          data:{
              damageTakenInstant:false,
          }
      })
        
      } else if(object.events[m].type == "player-damaged-player"){

        let eventCreated = await updateForPlayerDamagedPlayer(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
                {playerId: object.events[m].actor.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
                damageDealtInstant:true
            }
        })

        await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
                {playerId:object.events[m].target.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
                  health:{
                    decrement: object.events[m].actor.stateDelta.round.damageDealt
                },
                armor:object.events[m].target.state.game.currentArmor,
                damageTakenInstant: true
            }
        })

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)
        // console.log('tournamentScoreboard',JSON.stringify(tournamentScoreboard))

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
              damageDealtInstant:false
          }
      })

      await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId:object.events[m].target.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
              damageTakenInstant: false
          }
      })

      } else if (object.events[m].type == "player-killed-player") {
        
        let eventCreated = await updateForPlayerKilledPlayer(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
                {playerId: object.events[m].actor.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
              kills:{
                increment:1,
              },
              damageDealtInstant:true,
            }
        })

        // // console.log('object',JSON.stringify(object));

        if ( object.events[m].actor.stateDelta.round.killAssistsReceivedFromPlayer != undefined) {
          await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
                {playerId:object.events[m].actor.stateDelta.round.killAssistsReceivedFromPlayer[0].playerId},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
              assists:{
                increment:1,
              }
            }
          }) 
        }

        await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
                {playerId:object.events[m].target.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
              health:0,
              alive:false,
              armor:0,
              deaths:{
                increment:1,
              },
              damageTakenInstant:true,
            }
        })  

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    teamAName:true,
                    teamBName:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}}); 
        
        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            damageDealtInstant:false,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId:object.events[m].target.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            damageTakenInstant:false,
          }
        })  

      } else if (object.events[m].type == "player-teamdamaged-player") {

          let eventCreated = await updateForPlayerTeamDamagedPlayer(object,m);

          let scoreBoard = await prisma.scoreBoard.findFirst({
            where:{
                matchId:object.events[m].seriesStateDelta.games[0].id
            },
            select:{
              scoreBoardId:true,
            }
          })

          await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
              {playerId:object.events[m].actor.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
                damageDealtInstant: true
            }
          })

          await prisma.scoreboardPlayerCard.updateMany({
              where:{
                AND:[
                 {playerId:object.events[m].target.id},
                  {scoreBoardId:scoreBoard.scoreBoardId},
                ]
              },
              data:{
                    health:{
                      decrement: object.events[m].actor.stateDelta.round.teamdamageDealt,
                  },
                  armor:object.events[m].target.state.game.currentArmor,
                  damageTakenInstant: true
              }
          })

          let tournamentScoreboard = await prisma.tournament.findFirst({
            where:{
              tournamentId:object.events[m].seriesStateDelta.id,
            },
            select:{
              matches:{
                select:{
                  matchId:true,
                  scoreboard:{
                    select:{
                      scoreBoardId:true,
                      matchId:true,
                      match:{
                        select:{
                          tournamentId:true
                        }
                      },
                      scoreboardPlayerCard:{
                        select:{
                          player:{
                            select:{
                              name:true,
                              playerId:true,
                            }
                          },
                          kills:true,
                          deaths:true,
                          assists:true,
                          health:true,
                          alive:true,
                          armor:true,
                          itemsOwned:true,
                          teamId:true,
                          damageDealtInstant:true,
                          damageTakenInstant:true,
                          bombDefusing:true,
                        },
                        orderBy:{
                          player:{
                            name:'asc'
                          }
                        }
                      },
                      teamAId:true,
                      teamBId:true,
                      teamAName:true,
                      teamBName:true,
                      roundsWonTeamA:true,
                      roundsWonTeamB:true,
                      wonTeamId:true,
                      bombPlanted:true,
                      bombExploded:true,
                      bombDiffused:true,
                    }
                  }
                }
              }
            }
          })

          //console.log('tournamentScoreboard',tournamentScoreboard)
  
          await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

          await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
              {playerId:object.events[m].actor.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
                damageDealtInstant: false
            }
          })

          await prisma.scoreboardPlayerCard.updateMany({
              where:{
                AND:[
                 {playerId:object.events[m].target.id},
                  {scoreBoardId:scoreBoard.scoreBoardId},
                ]
              },
              data:{
                  damageTakenInstant: false
              }
          })

      } else if (object.events[m].type == "player-teamkilled-player") {

        let eventCreated = await updateForPlayerTeamKilledPlayer(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })


        await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[
               {playerId:object.events[m].target.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
              health:0,
              alive:false,
              armor:0,
              deaths:{
                increment:1,
              }
            }
        }) 

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:tournamentScoreboard, eventCreated:eventCreated});

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            damageDealtInstant:false,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId:object.events[m].target.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            damageTakenInstant:false,
          }
        }) 

      } else if (object.events[m].type == "player-selfkilled-player") {
      
        let eventCreated = await updateForPlayerSelfKilledPlayer(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
            where:{
              AND:[{
                playerId:object.events[m].actor.id},
                {scoreBoardId:scoreBoard.scoreBoardId},
              ]
            },
            data:{
              health:0,
              armor:0,
              alive:false,
              deaths:{
                increment:1,
              }
            }
        })   

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            damageDealtInstant:false,
          }
        })
        
      } else if (object.events[m].type == "player-completed-defuseBomb") {


        let eventCreated = await updateForPlayerCompletedDefuseBomb(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreBoard.update({
          where:{
            matchId:object.events[m].seriesStateDelta.games[0].id
          },
          data:{
            bombDiffused:true,
          }
        })

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

      } else if (object.events[m].type == "player-completed-explodeBomb") {

        let eventCreated = await updateForPlayerCompletedExplodeBomb(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreBoard.update({
          where:{
            matchId:object.events[m].seriesStateDelta.games[0].id
          },
          data:{
            bombExploded:true,
          }
        })

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

      } else if (object.events[m].type == "player-completed-plantBomb") {

        let eventCreated = await updateForPlayerCompletedPlantBomb(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreBoard.update({
          where:{
            matchId:object.events[m].seriesStateDelta.games[0].id
          },
          data:{
            bombPlanted:true,
          }
        })

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});


      } else if (object.events[m].type == "player-completed-beginDefuseWithKit") {
        
        let eventCreated = await updateForPlayerCompletedBeginDefuseWithKit(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            bombDefusing: true,
          }
        }) 

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

      } else if (object.events[m].type == "player-completed-beginDefuseWithoutKit") {

        let eventCreated = await updateForPlayerCompletedBeginDefuseWithoutKit(object,m);

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            bombDefusing: true,
          }
        }) 

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated}});

      } else if(object.events[m].type == "player-pickedUp-item"){

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            itemsOwned:object.events[m].actor.state.game.items
          }
        }) 

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated:{matchId:object.events[m].seriesStateDelta.games[0].id}}});
        

      } else if(object.events[m].type == "player-dropped-item"){

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            itemsOwned:object.events[m].actor.state.game.items
          }
        }) 

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated:{matchId:object.events[m].seriesStateDelta.games[0].id}}});
        

      } else if(object.events[m].type == "player-purchased-item"){

        let scoreBoard = await prisma.scoreBoard.findFirst({
          where:{
              matchId:object.events[m].seriesStateDelta.games[0].id
          },
          select:{
            scoreBoardId:true,
          }
        })

        await prisma.scoreboardPlayerCard.updateMany({
          where:{
            AND:[
              {playerId: object.events[m].actor.id},
              {scoreBoardId:scoreBoard.scoreBoardId},
            ]
          },
          data:{
            itemsOwned:object.events[m].actor.state.game.items
          }
        }) 

        let tournamentScoreboard = await prisma.tournament.findFirst({
          where:{
            tournamentId:object.events[m].seriesStateDelta.id,
          },
          select:{
            matches:{
              select:{
                matchId:true,
                scoreboard:{
                  select:{
                    scoreBoardId:true,
                    matchId:true,
                    match:{
                      select:{
                        tournamentId:true
                      }
                    },
                    scoreboardPlayerCard:{
                      select:{
                        player:{
                          select:{
                            name:true,
                            playerId:true,
                          }
                        },
                        kills:true,
                        deaths:true,
                        assists:true,
                        health:true,
                        alive:true,
                        armor:true,
                        itemsOwned:true,
                        teamId:true,
                        damageDealtInstant:true,
                        damageTakenInstant:true,
                        bombDefusing:true,
                      },
                      orderBy:{
                        player:{
                          name:'asc'
                        }
                      }
                    },
                    teamAId:true,
                    teamBId:true,
                    teamAName:true,
                    teamBName:true,
                    roundsWonTeamA:true,
                    roundsWonTeamB:true,
                    wonTeamId:true,
                    bombPlanted:true,
                    bombExploded:true,
                    bombDiffused:true,
                  }
                }
              }
            }
          }
        })

        //console.log('tournamentScoreboard',tournamentScoreboard)

        await pubsub.publish(`SCOREBOARD_CHANGED_${object.events[m].seriesStateDelta.id}`,{scoreBoardChanged:{tournamentScoreboard,eventCreated:{matchId:object.events[m].seriesStateDelta.games[0].id}}});
        

      }
    }

};

let currentTimeIndex = null;
let previousTimeIndex = null;

function waitForTimeout(ms) {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve("Timeout finished");
      }, ms);
  });
}

const processQueue = async () => {
  while (!queue.isEmpty()) {
    processRunning = 1;
    const task = queue.dequeue();

    if(currentTimeIndex == null){
      previousTimeIndex = task.occurredAt;
      currentTimeIndex = task.occurredAt;
      await doTask(task);
    }

    else{
      currentTimeIndex = task.occurredAt;
      await waitForTimeout((timeDifference(currentTimeIndex,previousTimeIndex))*1000)
      await doTask(task);
      previousTimeIndex = currentTimeIndex;
    }
  }
  if (queue.isEmpty()) {
    processRunning = 0;
  }
};

socket.onmessage = async (event) => {
  const object = JSON.parse(event.data);
  queue.enqueue(object);
  if (processRunning == 0) {
    processQueue();
  }
};

