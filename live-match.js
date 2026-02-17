/**
 * LIVE MATCH ENGINE - Real-time Multiplayer IPL Match System
 * Handles Toss, Team Selection, Bowler Selection, Ball-by-Ball Simulation, and Sync
 */

const AI = require("./ai");

function setupLiveMatch(io, rooms) {
  const activeMatches = new Map(); // roomId -> matchState

  // Generate unique match ID
  function generateMatchId() {
    return 'match_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // --- 1. CHALLENGE SYSTEM ---

  // Handle challenge request
  function handleMatchChallenge(socket, data) {
    const { targetTeamId, roomId } = data;
    const room = rooms[roomId];
    if (!room) return;

    const senderTeam = room.teams.find(t => t.bidKey === socket.teamId);
    const targetTeam = room.teams.find(t => t.bidKey === targetTeamId);

    if (!senderTeam || !targetTeam) return socket.emit("error_message", "Teams not found");
    if (!targetTeam.ownerSocketId) return socket.emit("error_message", "Opponent is offline");

    // Send request to target
    io.to(targetTeam.ownerSocketId).emit("match_challenge_received", {
      fromTeam: senderTeam.name,
      fromTeamId: senderTeam.bidKey,
      roomId: roomId
    });
    
    socket.emit("notification", { title: "Challenge Sent", message: `Request sent to ${targetTeam.name}` });
  }

  // Handle challenge response
  function handleChallengeResponse(socket, data) {
    const { fromTeamId, accepted, roomId } = data;
    const room = rooms[roomId];
    if (!room) return;

    const challengerTeam = room.teams.find(t => t.bidKey === fromTeamId);
    const myTeam = room.teams.find(t => t.bidKey === socket.teamId);

    if (!challengerTeam || !myTeam) return;

    if (accepted) {
      // Initialize Match
      startNewLiveMatch(roomId, challengerTeam, myTeam);
    } else {
      if (challengerTeam.ownerSocketId) {
        io.to(challengerTeam.ownerSocketId).emit("challenge_rejected", { by: myTeam.name });
      }
    }
  }

  // --- 2. MATCH INITIALIZATION ---

  function startNewLiveMatch(roomId, team1, team2) {
    const matchId = generateMatchId();
    
    const matchState = {
      matchId,
      roomId,
      teams: [team1, team2],
      players: {
        [team1.bidKey]: { socketId: team1.ownerSocketId, name: team1.name, squad: team1.roster },
        [team2.bidKey]: { socketId: team2.ownerSocketId, name: team2.name, squad: team2.roster }
      },
      status: "TOSS",
      toss: {
        winnerId: null,
        decision: null, // 'BAT' or 'BOWL'
        selections: {} // userId -> 'HEADS' or 'TAILS'
      },
      battingTeamId: null,
      bowlingTeamId: null,
      innings: 1,
      score: 0,
      wickets: 0,
      balls: 0,
      target: null,
      currentOver: [],
      matchLog: [],
      batsmen: {
        striker: null,
        nonStriker: null,
        available: [],
        stats: {} // playerName -> { runs: 0, balls: 0 }
      },
      bowlers: {
        current: null,
        stats: {} // bowlerName -> { overs: 0, runs: 0, wkts: 0 }
      },
      isGameOver: false,
      venue: AI.getVenueForTeam(team1.name), // Use home team's venue
      partnershipRuns: 0,
      partnershipBalls: 0
    };

    activeMatches.set(matchId, matchState);

    // Join players to match room
    const s1 = io.sockets.sockets.get(team1.ownerSocketId);
    const s2 = io.sockets.sockets.get(team2.ownerSocketId);
    if (s1) s1.join(matchId);
    if (s2) s2.join(matchId);

    // Notify match start
    io.to(matchId).emit("match_started", {
      matchId,
      teams: [team1.name, team2.name],
      venue: matchState.venue
    });
  }

  // --- 3. TOSS LOGIC ---

  function handleTossSelection(socket, data) {
    const { matchId, selection } = data;
    const match = activeMatches.get(matchId);
    if (!match || match.status !== "TOSS") return;

    match.toss.selections[socket.teamId] = selection;

    const keys = Object.keys(match.toss.selections);
    if (keys.length === 2) {
      // Perform Toss
      const result = Math.random() < 0.5 ? "HEADS" : "TAILS";
      const teamIds = Object.keys(match.players);
      // Winner is the one who picked correctly, or random if both picked same (shouldn't happen UI-wise)
      let winnerId = teamIds[0];
      if (match.toss.selections[teamIds[1]] === result) {
        winnerId = teamIds[1];
      } else if (match.toss.selections[teamIds[0]] === result) {
        winnerId = teamIds[0];
      } else {
        // Both wrong? Give to teamIds[0] randomly
        winnerId = teamIds[Math.floor(Math.random() * 2)];
      }

      match.toss.winnerId = winnerId;
      match.status = "TOSS_DECISION";
      
      io.to(matchId).emit("toss_result", {
        winnerId,
        winnerName: match.players[winnerId].name,
        result
      });
    }
  }

  function handleTossDecision(socket, data) {
    const { matchId, decision } = data;
    const match = activeMatches.get(matchId);
    if (!match || match.status !== "TOSS_DECISION" || socket.teamId !== match.toss.winnerId) return;

    match.toss.decision = decision;
    match.status = "TEAM_SETUP";

    const teamIds = Object.keys(match.players);
    const winnerId = match.toss.winnerId;
    const otherId = teamIds.find(id => id !== winnerId);

    if (decision === "BAT") {
      match.battingTeamId = winnerId;
      match.bowlingTeamId = otherId;
    } else {
      match.battingTeamId = otherId;
      match.bowlingTeamId = winnerId;
    }

    io.to(matchId).emit("setup_teams", {
      battingTeamId: match.battingTeamId,
      bowlingTeamId: match.bowlingTeamId,
      battingTeamName: match.players[match.battingTeamId].name,
      bowlingTeamName: match.players[match.bowlingTeamId].name,
      squads: {
        [match.battingTeamId]: match.players[match.battingTeamId].squad,
        [match.bowlingTeamId]: match.players[match.bowlingTeamId].squad
      }
    });
  }

  // --- 4. TEAM SETUP & BATTING/BOWLING ---

  function handlePlayerSelection(socket, data) {
    const { matchId, type, playerNames } = data; // type: 'OPENERS' or 'BOWLER' or 'NEXT_BATSMAN'
    const match = activeMatches.get(matchId);
    if (!match) return;

    if (type === "OPENERS" && socket.teamId === match.battingTeamId) {
      match.batsmen.striker = playerNames[0];
      match.batsmen.nonStriker = playerNames[1];
      // Initialize stats
      if (!match.batsmen.stats[playerNames[0]]) match.batsmen.stats[playerNames[0]] = { runs: 0, balls: 0 };
      if (!match.batsmen.stats[playerNames[1]]) match.batsmen.stats[playerNames[1]] = { runs: 0, balls: 0 };
      checkStartMatch(match);
    } else if (type === "BOWLER" && socket.teamId === match.bowlingTeamId) {
      match.bowlers.current = playerNames[0];
      if (!match.bowlers.stats[playerNames[0]]) {
        match.bowlers.stats[playerNames[0]] = { overs: 0, balls: 0, runs: 0, wkts: 0 };
      }
      checkStartMatch(match);
    } else if (type === "NEXT_BATSMAN" && socket.teamId === match.battingTeamId) {
      match.batsmen.striker = playerNames[0];
      if (!match.batsmen.stats[playerNames[0]]) match.batsmen.stats[playerNames[0]] = { runs: 0, balls: 0 };
      match.status = "LIVE";
      syncMatchState(match);
    }
  }

  function checkStartMatch(match) {
    if (match.batsmen.striker && match.bowlers.current && match.status === "TEAM_SETUP") {
      match.status = "LIVE";
      syncMatchState(match);
    } else if (match.batsmen.striker && match.bowlers.current && match.status === "WAITING_FOR_BOWLER") {
        match.status = "LIVE";
        syncMatchState(match);
    }
  }

  // --- 5. BALL ENGINE ---

  function simulateBall(socket, data) {
    const { matchId } = data;
    const match = activeMatches.get(matchId);
    if (!match || match.status !== "LIVE") return;

    // Only allow simulation if it's the bowling team's turn or let server auto-simulate?
    // User said: "Each ball should auto-simulate"
    // So maybe a "Next Ball" button for both, but only one needs to click? Or recurring?
    // Let's make it so anyone can click "Next Delivery" to advance.

    const batter = match.players[match.battingTeamId].squad.find(p => p.name === match.batsmen.striker);
    const bowler = match.players[match.bowlingTeamId].squad.find(p => p.name === match.bowlers.current);

    // Map match state for AI calculateBallOutcome
    const aiState = {
      phase: match.balls < 36 ? "pp" : match.balls < 90 ? "mid" : "death",
      reqRR: match.target ? (match.target - match.score) / ((120 - match.balls) / 6) : 0,
      isChasing: match.innings === 2,
      ballsLeft: 120 - match.balls,
      ballsBowled: match.balls,
      currentScore: match.score,
      dewActive: false, // Could randomize
      partnershipRuns: match.partnershipRuns || 0,
      partnershipBalls: match.partnershipBalls || 0,
      innIndex: match.innings,
      batterBalls: match.batsmen.stats[match.batsmen.striker]?.balls || 0,
      batterRuns: match.batsmen.stats[match.batsmen.striker]?.runs || 0,
      recentCollapse: match.recentWickets > 0,
      recentWickets: match.recentWickets || 0,
      momentum: 0, // Could track this
    };

    const outcome = AI.battingLogic.calculateBallOutcome(batter, bowler, aiState, match.venue);

    // Update State
    processOutcome(match, outcome);
    
    // Check for Mid-over wicket pause
    if (outcome.wicket && match.wickets < 10) {
        match.status = "SELECT_BATSMAN";
        match.batsmen.striker = null;
    }

    // Check for Over End
    if (!outcome.extra && match.balls % 6 === 0 && match.status === "LIVE") {
        match.status = "WAITING_FOR_BOWLER";
        match.bowlers.current = null;
        match.currentOver = [];
        // Strike rotation on over end
        const temp = match.batsmen.striker;
        match.batsmen.striker = match.batsmen.nonStriker;
        match.batsmen.nonStriker = temp;
    }

    // Check for Innings End
    if (match.wickets >= 10 || match.balls >= 120 || (match.innings === 2 && match.score > match.target)) {
        if (match.innings === 1) {
            match.innings = 2;
            match.recentWickets = 0;
            match.target = match.score + 1;
            match.score = 0;
            match.wickets = 0;
            match.balls = 0;
            match.currentOver = [];
            // Swap roles
            const temp = match.battingTeamId;
            match.battingTeamId = match.bowlingTeamId;
            match.bowlingTeamId = temp;
            match.status = "TEAM_SETUP";
            match.batsmen.striker = null;
            match.batsmen.nonStriker = null;
            match.batsmen.available = [];
            match.bowlers.current = null;
        } else {
            match.isGameOver = true;
            match.status = "FINISHED";
        }
    }

    syncMatchState(match);
  }

  function processOutcome(match, outcome) {
    if (outcome.wicket) {
      match.wickets++;
      match.recentWickets = Math.min(5, (match.recentWickets || 0) + 2);
      const bStat = match.bowlers.stats[match.bowlers.current];
      if (outcome.wicketType !== 'run out') bStat.wkts++;
      
      const batStat = match.batsmen.stats[match.batsmen.striker];
      if (batStat) batStat.balls++;
      
      match.partnershipRuns = 0;
      match.partnershipBalls = 0;
    } else if (outcome.extra) {
      match.score += outcome.runs;
      const bStat = match.bowlers.stats[match.bowlers.current];
      bStat.runs += outcome.runs;
    } else {
      match.score += outcome.runs;
      match.balls++;
      const bStat = match.bowlers.stats[match.bowlers.current];
      bStat.runs += outcome.runs;
      bStat.balls++;
      
      // Strike rotation
      if (outcome.runs % 2 !== 0) {
        const temp = match.batsmen.striker;
        match.batsmen.striker = match.batsmen.nonStriker;
        match.batsmen.nonStriker = temp;
      }
      match.partnershipRuns += outcome.runs;
      match.partnershipBalls++;
      
      const batStat = match.batsmen.stats[match.batsmen.striker];
      if (batStat) {
        batStat.runs += outcome.runs;
        batStat.balls++;
      }
    }

    if (match.balls > 0 && match.balls % 6 === 0) {
      if (match.recentWickets > 0) match.recentWickets--;
    }

    match.currentOver.push(outcome);
    match.matchLog.push({ balls: match.balls, score: match.score, wickets: match.wickets, outcome });
  }

  // --- SYNC ---

  function syncMatchState(match) {
    io.to(match.matchId).emit("match_update", {
      status: match.status,
      score: match.score,
      wickets: match.wickets,
      balls: match.balls,
      innings: match.innings,
      target: match.target,
      striker: match.batsmen.striker,
      nonStriker: match.batsmen.nonStriker,
      bowler: match.bowlers.current,
      currentOver: match.currentOver,
      isGameOver: match.isGameOver,
      battingTeamId: match.battingTeamId,
      bowlingTeamId: match.bowlingTeamId
    });
  }

  return {
    handleMatchChallenge,
    handleChallengeResponse,
    handleTossSelection,
    handleTossDecision,
    handlePlayerSelection,
    simulateBall
  };
}

module.exports = { setupLiveMatch };
