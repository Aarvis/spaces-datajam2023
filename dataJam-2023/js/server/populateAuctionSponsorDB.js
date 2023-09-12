const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
function generateHash(key1, key2) {
  const hash = crypto.createHash("sha256");
  hash.update(key1 + key2);
  return hash.digest("hex");
}

const data = require("./populaterData.json");

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const populateDatabase = async () => {
  const sponsorIds = {};

  for (let sponsorName of data.sponsors) {
    const createdSponsor = await prisma.sponsor.create({
      data: {
        sponsorName: sponsorName,
      },
    });
    sponsorIds[sponsorName] = createdSponsor.sponsorId;

    await prisma.sponsor.update({
      where: {
        sponsorId: createdSponsor.sponsorId,
      },
      data: {
        passwordHash: generateHash(createdSponsor.sponsorId, "sponsor@1234"),
      },
    });
  }

  for (let playerId of data.players) {
    const totalAuctionsForPlayer = getRandom(5, 10);

    // Start with an initial date a year ago.
    let currentDate = new Date("2020-01-01");
    let tenureDur = 0;
    for (let i = 0; i < totalAuctionsForPlayer; i++) {
      // const tenureDuration = getRandom(3, 6) * 30 * 24 * 60 * 60 * 1000; // 3 to 6 months in milliseconds
      let currentAuctionStatus = "CLOSED";
      const auctionDuration = getRandom(7, 10) * 24 * 60 * 60 * 1000; // 7 to 10 days in milliseconds

      // Setting the start date to somewhere in the last two weeks of the previous tenure.
      if (i !== 0) {
        currentDate = new Date(
          currentDate.getTime() +
            tenureDur * 30 * 24 * 60 * 60 * 1000 -
            getRandom(1, 2) * 7 * 24 * 60 * 60 * 1000
        );
      }

      // If it's the last auction for the player and the year is not beyond 2023
      if (
        i === totalAuctionsForPlayer - 1 &&
        currentDate.getFullYear() <= 2023
      ) {
        currentAuctionStatus = "OPEN";
      }

      const auctionStartDate = new Date(currentDate.getTime());
      const auctionEndDate = new Date(currentDate.getTime() + auctionDuration);
      tenureDur = getRandom(3, 6);

      let tenureStartDate = new Date(auctionEndDate);
      tenureStartDate.setDate(auctionEndDate.getDate() + 7);

      const auction = await prisma.auction.create({
        data: {
          startDate: auctionStartDate.toISOString(),
          endDate: auctionEndDate.toISOString(),
          auctionStatus: currentAuctionStatus,
          term: tenureDur,
          tenureStartDate: tenureStartDate.toISOString(),
          player: {
            connect: {
              playerId: playerId,
            },
          },
        },
        select: {
          auctionId: true,
        },
      });

      currentDate = auctionEndDate; // Update the currentDate to the end of the current auction

      const numberOfBids = getRandom(10, 20);
      const minBidValue = 30000; // 100K
      const maxBidValue = getRandom(200000, 800000); // 800K
      const incrementValue = (maxBidValue - minBidValue) / numberOfBids;
      const bids = [];
      let lastSponsorIndex = -1;

      for (let j = 0; j < numberOfBids; j++) {
        const bidValue =
          minBidValue + j * incrementValue + getRandom(0, incrementValue / 2);
        const isWinnerBid = j === numberOfBids - 1 ? true : false; // last bid is the winning bid

        // Randomly select a sponsor for the bid, ensuring it's not the same as the last sponsor
        let sponsorIndex;
        do {
          sponsorIndex = getRandom(0, data.sponsors.length - 1);
        } while (sponsorIndex === lastSponsorIndex);

        const participatingSponsor = data.sponsors[sponsorIndex];
        lastSponsorIndex = sponsorIndex; // Update the last sponsor index for the next iteration

        // Update SponsorOnAuction for this sponsor
        await prisma.sponsorOnAuction.upsert({
          where: {
            sponsorId_auctionId: {
              sponsorId: sponsorIds[participatingSponsor],
              auctionId: auction.auctionId,
            },
          },
          update: {},
          create: {
            sponsorId: sponsorIds[participatingSponsor],
            auctionId: auction.auctionId,
          },
        });

        const bid = await prisma.bid.create({
          data: {
            auctionId: auction.auctionId,
            sponsorId: sponsorIds[participatingSponsor],
            bidValue: Math.round(bidValue),
            winnerBid: isWinnerBid,
          },
        });
        bids.push(bid);

        if (isWinnerBid) {
          await prisma.auction.update({
            where: {
              auctionId: auction.auctionId,
            },
            data: {
              winningSponsor: {
                connect: {
                  sponsorId: sponsorIds[participatingSponsor],
                },
              },
              winningBidValue: Math.round(bidValue),
            },
          });
        }
      }
    }
  }
  console.log("Database populated successfully!");
  await prisma.$disconnect();
};

populateDatabase();

//Player History Bid Details
//Events
//Overall Stats
//currentAuctionDetails
//currentAuctionDetails for all players
