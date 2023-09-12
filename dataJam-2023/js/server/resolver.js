const { prisma } = require("./database.js");
const GraphQLJSON = require("graphql-type-json");
const crypto = require("crypto");
const cron = require('node-cron');
const { addAbortSignal } = require("stream");
const { transformDocument } = require("@prisma/client/runtime/index.js");
function generateHash(key1, key2) {
  const hash = crypto.createHash("sha256");
  hash.update(key1 + key2);
  return hash.digest("hex");
}


let runningIntervalsStack = [];
class OpenAuctionsInterval {
  constructor(auctionId,startDateTime,duration){
    this.intervalId = null
    this.auctionId = auctionId
    this.startDateTime = startDateTime
    this.duration = duration
    this.start(this.startDateTime,this.duration, prisma);
  }
  start(startDateTime,duration,prisma){
    //* * * * *
    //0 */12 * * *
    console.log('startDateTime',startDateTime)
    console.log('duration',duration)
    let cronJob = cron.schedule('* * * * *',async function(){
      console.log('CRON JOB RAN')
      console.log('startDateTime',startDateTime)
      console.log('duration',duration)
      console.log('new Date().getTime()',parseInt(new Date().getTime()))
      console.log('(parseInt(startDateTime) + duration*1000)',(parseInt(startDateTime) + duration*1000))
      if (parseInt(new Date().getTime()) > (parseInt(startDateTime) + duration*1000)){
        console.log('IN')
        await prisma.auction.update({
          where:{
            auctionId:this.auctionId,
          },
          data:{
            auctionStatus:'CLOSED',
          }
        })
        console.log('CRON JOB SHOULD HAVE STOPPED HERE')
        cronJob.stop();
      }
    });

  }

}

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    async SearchPlayersByName(parent, args, context, info){
      const players = await prisma.player.findMany({
        where: {
          name: {
            contains: args.name,
           mode:'insensitive'
          }
        },
        select: {
          playerId: true,
          name:true,
        }
      });
      return players;
    },

    async PlayerAuctionHistory(parent, args, context, info) {
      const playerAuctions = await prisma.auction.findMany({
        where: {
          playerId: args.playerId,
        },
        select: {
          winningBidValue: true,
          winningSponsor: {
            select: {
              sponsorName: true,
            },
          },
          startDate: true,
          term: true,
          sponsorId: true,
          auctionStatus: true,
          auctionId: true,
          tenureStartDate: true,
          endDate: true,
        },
      });

      return playerAuctions.map((auction) => ({
        winningBid: auction.winningBidValue,
        sponsorName:
          auction.sponsorId == null ? null : auction.winningSponsor.sponsorName,
        startDate: auction.startDate,
        endDate: auction.endDate,
        tenureStartDate: auction.tenureStartDate,
        term: auction.term,
        sponsorId: auction.sponsorId,
        auctionStatus: auction.auctionStatus,
        auctionId: auction.auctionId,
      }));
    },

    async GetTournamentEvents(parent, args, context, info) {
      return await prisma.tournametEvent.findMany({
        where: {
          startDate: {
            gte: args.startDate,
          },
          endDate: {
            lte: args.endDate,
          },
        },
      });
    },

    async GetOverallStatsForPlayers(parent, args, context, info) {
      return await prisma.player.findUnique({
        where: {
          playerId: args.playerId,
        },
      });
    },

    async GetSponsorTenureStats(parent,args,context,info){
      return await prisma.sponsorTenureStats.findUnique({
        where: {
          sponsorTenureStatsId: args.sponsorTenureStatsId
        },
        select:{
          sponsorTenureStatsId:true,
          numberOfMatches:true,
          numberOfRounds:true,
          kills:true,
          deaths:true,
          killAssistsReceived:true,
          killAssistsGiven:true,
          selfKills:true,
          headshots:true,
          overallViewTime:true,
          tournamentReach:true,
          overallRoundEstimatedViewTime:true,
          overallMomentsViewTime:true,
          overallPercentageOfOpponentTeamKilled:true,
          overallRoundViewPercentage:true,
          overallDamageDealt:true,
          overallDamageTaken:true,
          weaponKills:true,
          overallAce:true,
          overallClutch:true,
          teamId:true,
          playerId:true,
          player:{
            select:{
              name:true,
            }
          }
        }
      });
    },

    async CurrentlyOpenAuctions(parent, args, context, info) {
      return await prisma.auction.findMany({
        where: {
          auctionStatus: "OPEN",
        },
        select: {
          auctionId: true,
          startDate: true,
          endDate: true,
          tenureStartDate: true,
          auctionStatus: true,
          term: true,
          winningBidValue: true,
          sponsorId: true,
          playerId: true,
          player: {
            select: {
              name: true,
              profilePic:true,
              numberOfMatches: true,
              numberOfRounds: true,
              overallAce: true,
              overallClutch: true,
              overallRoundEstimatedViewTime: true,
              overallViewTime: true,
              auctions: {
                where: {
                  auctionStatus: "CLOSED",
                },
                select: {
                  winningBidValue: true,
                  term:true
                },
              },
            },
          },
        },
      });
    },

    async GetBidsFromAuction(parent, args, context, info) {
      return await prisma.auction.findMany({
        where: {
          auctionId: args.auctionId,
        },
        select: {
          auctionId: true,
          startDate: true,
          endDate: true,
          tenureStartDate: true,
          auctionStatus: true,
          term: true,
          winningBidValue: true,
          sponsorId: true,
          playerId: true,
          bids: {
            select: {
              bidId: true,
              bidValue: true,
              winnerBid: true,
            },
          },
        },
      });
    },

    async GetAuctionsWonBySponsor(parent, args, context, info) {
      return await prisma.sponsor.findFirst({
        where: {
          sponsorId: args.sponsorId,
        },
        select: {
          sponsorId: true,
          auctionsWon: {
            select:{
              auctionId:true,
              auctionStatus:true,
              winningBidValue:true,
              player:{
                select:{
                  playerId:true,
                  name:true,
                }
              },
              startDate:true,
              endDate:true,
              tenureStartDate:true,
              term:true,
              // winningSponsorTenureStats:true,
              sponsorTenureStatsId:true,
            }
          }
        },
      });
    },

    async GetBidsFromOpenAuctionSponsorParticipated(parent, args, context, info){
      return await prisma.sponsorOnAuction.findMany({
        where:{
          sponsorId:args.sponsorId,
        },
        select:{
          sponsorId:true,
          auction:{
            select:{
              auctionId:true,
              endDate:true,
              auctionStatus:true,
              term:true,
              bids:{
                select:{
                  sponsorId:true,
                  bidValue:true,
                  winnerBid:true,
                }
              },
              player:{
                select:{
                name:true,
                playerId:true,
                }
              }
            }
          }
        },
      })
    },

    async GetSponsorDetails(parent, args, context, info){
    
      return await prisma.sponsor.findFirst({
        where:{
          sponsorId:args.sponsorId
        },
        select:{
          sponsorName:true,
        }
      })

    }

  },
  Mutation: {
    async BidForAuction(parent, args, context, info) {
      const { auctionId, bidValue, sponsorId } = args;

      // Check if the auction is open
      const auction = await prisma.auction.findUnique({ where: { auctionId } });
      if (
        !auction ||
        auction.auctionStatus !== "OPEN" ||
        new Date(auction.endDate) < new Date()
      ) {
        return {
          success: false,
          message: "Auction is CLOSED and does not accept bids.",
        };
      }

      const increment = auction.winningBidValue < 500000 ? 10000 : 50000;
      if (bidValue < auction.winningBidValue + increment) {
        return {
          success: false,
          message: "Bid not sufficient",
        };
      }

      if (auction.sponsorId == sponsorId) {
        return {
          success: false,
          message: "The current Sponsor has the winning bid",
        };
      }

      const previousWinningBid = await prisma.bid.updateMany({
        where: {
          auctionId,
          winnerBid: true,
        },
        data: {
          winnerBid: false,
        },
      });

      await prisma.bid.create({
        data: {
          bidValue,
          winnerBid: true,
          auction: {
            connect: {
              auctionId,
            },
          },
          sponsor: {
            connect: {
              sponsorId,
            },
          },
        },
      });

      await prisma.auction.update({
        where: { auctionId },
        data: {
          winningBidValue: bidValue,
          winningSponsor: {
            connect: {
              sponsorId,
            },
          },
        },
      });

      await prisma.sponsorOnAuction.upsert({
        where: {
          sponsorId_auctionId: {
            sponsorId,
            auctionId,
          },
        },
        update: {},
        create: {
          sponsor: {
            connect: {
              sponsorId,
            },
          },
          auction: {
            connect: {
              auctionId,
            },
          },
        },
      });

      return {
        success: true,
        message: "Bid successfully placed.",
      };
    },

    async OpenBid(parent, args, context, info) {
      console.log('in')
      const { playerId, startingValue, term, startDate } = args;

      const previousAuctions = await prisma.auction.findMany({
        where: {
          playerId,
          auctionStatus: "OPEN",
        },
      });

      if (previousAuctions.length > 0) {
        return {
          success: false,
          message: "An auction is already open for this player.",
        };
      }

      console.log('starting')
      const endDate = new Date(startDate);
      console.log('endDate',endDate)
      endDate.setDate(endDate.getDate() + 7);

      let tenureStartDate = new Date(startDate);
      tenureStartDate.setDate(tenureStartDate.getDate() + 14);

      const auction = await prisma.auction.create({
        data: {
          startDate,
          endDate: endDate,
          auctionStatus: "OPEN",
          term: term,
          tenureStartDate: tenureStartDate,
          winningBidValue: startingValue,
          player: {
            connect: {
              playerId,
            },
          },
        },
        select:{
          auctionId:true,
        }
      });

      console.log('auction',auction)

      runningIntervalsStack.push({
        auctionId:auction.auctionId,
        endDate:endDate,
        intervalSize:86430000
      })

      console.log('new Date(startDate).getTime()',new Date(startDate).getTime())

      // let interval = new OpenAuctionsInterval(auction.auctionId,new Date(startDate).getTime(),70)

      let startDateTime = new Date(startDate).getTime()
      let duration = 70

      let cronJob = cron.schedule('* * * * *',async function(){
        console.log('CRON JOB RAN')
        console.log('startDateTime',startDateTime)
        console.log('duration',duration)
        console.log('new Date().getTime()',parseInt(new Date().getTime()))
        console.log('(parseInt(startDateTime) + duration*1000)',(parseInt(startDateTime) + duration*1000))
        if (parseInt(new Date().getTime()) > (parseInt(startDateTime) + duration*1000)){
          console.log('IN')
          
          let winningSponsor = await prisma.auction.findFirst({
            where:{
              auctionId:auction.auctionId,
            },
            select:{
              sponsorId:true,
              playerId:true,
            }
          })

          let sponsorTenureStats = null;
          if(winningSponsor.sponsorId != null){

            sponsorTenureStats = await prisma.sponsorTenureStats.create({
              data:{
                player:{
                  connect:{
                    playerId:winningSponsor.playerId
                  }
                }
              },
              select:{
                sponsorTenureStatsId:true,
              }
            })

          }

          if(sponsorTenureStats != null){
            await prisma.auction.update({
              where:{
                auctionId:auction.auctionId,
              },
              data:{
                auctionStatus:'CLOSED',
                winningSponsorTenureStats:{
                  connect:{
                    sponsorTenureStatsId:sponsorTenureStats.sponsorTenureStatsId
                  }
                }
              }
            })
          }
          else{
            await prisma.auction.update({
              where:{
                auctionId:auction.auctionId,
              },
              data:{
                auctionStatus:'CLOSED',
              }
            })
          }
          console.log('CRON JOB SHOULD HAVE STOPPED HERE')
          cronJob.stop();
        }
      });

      return {
        success: true,
        message: "Auction successfully opened.",
        auction,
      };
    },

    async playerLogin(parent, args, context, info) {
      const { playerIdentifier, password } = args;

      const player = await prisma.player.findFirst({
        where: {
          OR: [{ playerId: playerIdentifier }, { name: playerIdentifier }],
        },
      });

      if (!player) {
        return { success: false, message: "Player not found.", token: "" };
      }

      const hashedInputPassword = generateHash(player.playerId, password);
      if (hashedInputPassword !== player.passwordHash) {
        return { success: false, message: "Invalid password.", token: "" };
      }

      // Generate token logic goes here if needed.
      return {
        success: true,
        message: "Login successful.",
        token: "YOUR_GENERATED_TOKEN",
        playerId: player.playerId,
      };
    },

    async sponsorLogin(parent, args, context, info) {
      const { sponsorIdentifier, password } = args;

      const sponsor = await prisma.sponsor.findFirst({
        where: {
          OR: [
            { sponsorId: sponsorIdentifier },
            { sponsorName: sponsorIdentifier },
          ],
        },
      });

      if (!sponsor) {
        return { success: false, message: "Sponsor not found.", token: "" };
      }

      const hashedInputPassword = generateHash(sponsor.sponsorId, password);
      if (hashedInputPassword !== sponsor.passwordHash) {
        return { success: false, message: "Invalid password.", token: "" };
      }

      // Generate token logic goes here if needed.
      return {
        success: true,
        message: "Login successful.",
        token: "YOUR_GENERATED_TOKEN",
        sponsorId: sponsor.sponsorId,
      };
    },
  },
};

module.exports = {
  resolvers,
};
