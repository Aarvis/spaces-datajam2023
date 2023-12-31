const { gql } = require('apollo-server')

const typeDefs = gql`
  scalar JSON

  type Query {
    PlayerAuctionHistory(playerId: String!): JSON
    GetTournamentEvents(startDate: String!, endDate: String!): JSON
    GetOverallStatsForPlayers(playerId: String!):JSON
    CurrentlyOpenAuctions: JSON
    GetBidsFromAuction(auctionId: String!): JSON
    GetAuctionsWonBySponsor(sponsorId: String!): JSON
    GetBidsFromOpenAuctionSponsorParticipated(sponsorId: String!): JSON
    GetSponsorTenureStats(sponsorTenureStatsId: String!): JSON
    GetSponsorDetails(sponsorId: String!): JSON
    SearchPlayersByName(name: String!): JSON
  }
  

  type PlayerAuctionHistoryResponse {
    winningBid: Int!
    sponsorName: String!
    startDate: String!
    term: String!
  }
  
  type TournamentEvent {
    eventId: String!
    name: String!
    startDate: String!
    endDate: String!
    averageViewsAchieved: Int!
    averageConcurrentViewersOfStream: Int!
  }
  
  type Player {
    playerId: String!
    name: String!
    numberOfMatches: Int!
    numberOfRounds: Int!
    kills: Int!
    deaths: Int!
    killAssistsReceived: Int!
    killAssistsGiven: Int!
    selfKills: Int!
    headshots: Int!
    overallViewTime: Float!
    tournamentReach: Float!
    overallRoundEstimatedViewTime: Float!
    overallMomentsViewTime: Float!
    overallPercentageOfOpponentTeamKilled: Float!
    overallRoundViewPercentage: Float!
    overallDamageDealt: Int!
    overallDamageTaken: Int!
  }
  
  type Auction {
    auctionId: String!
    startDate: String!
    endDate: String!
    auctionStatus: String!
  }

  type Mutation {
    BidForAuction(auctionId: String!, bidValue: Int!, sponsorId: String!): JSON!
    OpenBid(playerId: String!, startingValue: Int!, term: Int!, startDate: String!): JSON!
    playerLogin(playerIdentifier: String!, password: String!): JSON!
    sponsorLogin(sponsorIdentifier: String!, password: String!): JSON!
  }

  type Subscription {
    scoreBoardChanged(tournamentId: String!): JSON!
  }
`

module.exports = {
  typeDefs,
}