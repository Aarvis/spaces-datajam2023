const { gql } = require('@apollo/client/core');

export const SEARCH_PLAYERS_BY_NAME = gql`
query SearchPlayersByName($name: String!) {
  SearchPlayersByName(name: $name)
}`;

export const GET_AUCTIONS_WON_BY_SPONSOR = gql`
query GetAuctionsWonBySponsor($sponsorId: String!){
  GetAuctionsWonBySponsor(sponsorId:$sponsorId)
}`;

export const GET_BIDS_FROM_AUCTION_SPONSOR_PARTICIPATED = gql`
query GetBidsFromOpenAuctionSponsorParticipated($sponsorId: String!){
  GetBidsFromOpenAuctionSponsorParticipated(sponsorId:$sponsorId)
}`;

export const GET_PLAYER_AUCTION_HISTORY = gql`
  query PlayerAuctionHistory($playerId: String!) {
    PlayerAuctionHistory(playerId: $playerId)
  }
`;

export const GET_TOURNAMENT_EVENTS = gql`
  query GetTournamentEvents($startDate: String!, $endDate: String!) {
    GetTournamentEvents(startDate: $startDate, endDate: $endDate)
  }
`;

export const GET_OVERALL_STATS_FOR_PLAYERS = gql`
  query GetOverallStatsForPlayers($playerId: String!) {
    GetOverallStatsForPlayers(playerId: $playerId)
  }
`;

export const GET_CURRENTLY_OPEN_AUCTIONS = gql`
  query CurrentlyOpenAuctions {
    CurrentlyOpenAuctions 
  }
`;

export const GET_BIDS_FROM_AUCTION = gql`
  query GetBidsFromAuction($auctionId: String!) {
    GetBidsFromAuction(auctionId: $auctionId)
  }
`;

export const GET_SPONSOR_TENURE_STATS = gql`
query GetSponsorTenureStats($sponsorTenureStatsId: String!) {
  GetSponsorTenureStats(sponsorTenureStatsId: $sponsorTenureStatsId)
}
`;

export const GET_SPONSOR_DETAILS = gql`
query GetSponsorDetails($sponsorId: String!) {
  GetSponsorDetails(sponsorId: $sponsorId)
}
`;

// Mutations
export const BID_FOR_AUCTION = gql`
  mutation BidForAuction($auctionId: String!, $bidValue: Int!, $sponsorId: String!) {
    BidForAuction(auctionId: $auctionId, bidValue: $bidValue, sponsorId: $sponsorId) 
  }
`;

export const OPEN_BID = gql`
  mutation OpenBid($playerId: String!, $startingValue: Int!, $term: Int!, $startDate: String!) {
    OpenBid(playerId: $playerId, startingValue: $startingValue, term: $term, startDate: $startDate) 
  }
`;

export const PLAYER_LOGIN = gql`
  mutation PlayerLogin($playerIdentifier: String!, $password: String!) {
    playerLogin(playerIdentifier: $playerIdentifier, password: $password)
  }
`;

export const SPONSOR_LOGIN = gql`
  mutation SponsorLogin($sponsorIdentifier: String!, $password: String!) {
    sponsorLogin(sponsorIdentifier: $sponsorIdentifier, password: $password)
  }
`;

export const UPDATE_SCOREBOARD_VIEWTIME = gql`
  mutation updateScoreBoardViewTime($matchId: String!, $viewTime: Int!) {
    updateScoreBoardViewTime(matchId: $matchId, viewTime: $viewTime)
  }
`;

export const SCOREBOARD_CHANGED = gql`
  subscription ScoreBoardChanged($tournamentId: String!) {
    scoreBoardChanged(tournamentId: $tournamentId) 
}`;
