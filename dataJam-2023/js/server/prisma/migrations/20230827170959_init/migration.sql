-- CreateTable
CREATE TABLE "Auction" (
    "auctionId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "auctionStatus" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "winningBidValue" INTEGER NOT NULL DEFAULT 0,
    "sponsorId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("auctionId")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "sponsorId" TEXT NOT NULL,
    "sponsorName" TEXT NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("sponsorId")
);

-- CreateTable
CREATE TABLE "SponsorOnAuction" (
    "sponsorId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,

    CONSTRAINT "SponsorOnAuction_pkey" PRIMARY KEY ("sponsorId","auctionId")
);

-- CreateTable
CREATE TABLE "Bid" (
    "bidId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "bidValue" INTEGER NOT NULL DEFAULT 0,
    "winnerBid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("bidId")
);

-- CreateTable
CREATE TABLE "Events" (
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "averageViewsAchieved" INTEGER NOT NULL,
    "averageConcurrentViewersOfStream" INTEGER NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auction_auctionId_key" ON "Auction"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_sponsorId_key" ON "Sponsor"("sponsorId");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_bidId_key" ON "Bid"("bidId");

-- CreateIndex
CREATE UNIQUE INDEX "Events_eventId_key" ON "Events"("eventId");

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("sponsorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorOnAuction" ADD CONSTRAINT "SponsorOnAuction_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("sponsorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorOnAuction" ADD CONSTRAINT "SponsorOnAuction_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("auctionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("auctionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("sponsorId") ON DELETE RESTRICT ON UPDATE CASCADE;
