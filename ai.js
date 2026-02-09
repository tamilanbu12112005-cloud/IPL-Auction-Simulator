// =================================================================
// 🏏 REALISTIC IPL SIMULATION ENGINE v2.2
// CRITICAL BUG FIXES: Bowling SR, Extras, Maidens, Margins, Strike Rotation, NRR
// =================================================================

// --- 1. REALISTIC OUTCOME WEIGHTS (Based on actual T20 data) ---
const OUTCOME_WEIGHTS = {
  // Conservative - Building innings (SR: 110-120)
  anchor: { 0: 32, 1: 40, 2: 16, 3: 3, 4: 5, 6: 1, 'W': 2, 'WD': 1, 'NB': 0 },
  
  // Standard T20 - Balanced (SR: 130-140)
  normal: { 0: 26, 1: 34, 2: 20, 3: 5, 4: 8, 6: 3, 'W': 3, 'WD': 1, 'NB': 0 },
  
  // Accelerating - Pushing the run rate (SR: 150-160)
  controlled: { 0: 22, 1: 30, 2: 22, 3: 6, 4: 10, 6: 5, 'W': 4, 'WD': 1, 'NB': 0 },
  
  // Aggressive - Taking risks (SR: 170-190)
  aggressive: { 0: 18, 1: 24, 2: 18, 3: 7, 4: 14, 6: 10, 'W': 7, 'WD': 1, 'NB': 1 },
  
  // All-out attack - Death overs/desperate (SR: 200+)
  desperate: { 0: 14, 1: 18, 2: 14, 3: 6, 4: 16, 6: 18, 'W': 12, 'WD': 1, 'NB': 1 },
  
  // Powerplay specific - Field restrictions
  powerplay: { 0: 24, 1: 32, 2: 18, 3: 4, 4: 12, 6: 6, 'W': 3, 'WD': 1, 'NB': 0 },
  
  // Death overs - Hitting out or getting out
  death: { 0: 16, 1: 20, 2: 15, 3: 6, 4: 16, 6: 16, 'W': 9, 'WD': 1, 'NB': 1 }
};

// Pitch characteristics (subtle, not extreme)
const PITCH_EFFECTS = {
  flat:   { 4: 2, 6: 2, 'W': -1, 1: -1 },      // Easier scoring
  green:  { 'W': 2, 0: 2, 4: -1, 1: 1 },       // Pace-friendly
  dusty:  { 'W': 1, 0: 2, 2: -1 },             // Spin-friendly
  slow:   { 6: -2, 2: 2, 1: 2, 4: -1 }         // Hard to score
};

const VENUE_MAP = {
  "CSK": { 
    name: "M. A. Chidambaram Stadium", 
    city: "Chennai", 
    avgFirst: 168, avgSecond: 162,
    chaseWinRate: 0.42,
    pitch: "dusty", 
    boundary: "large",
    dewFactor: 0.5
  },
  "MI": { 
    name: "Wankhede Stadium", 
    city: "Mumbai", 
    avgFirst: 182, avgSecond: 176,
    chaseWinRate: 0.52,
    pitch: "flat", 
    boundary: "small",
    dewFactor: 0.3
  },
  "RCB": { 
    name: "M. Chinnaswamy Stadium", 
    city: "Bengaluru", 
    avgFirst: 191, avgSecond: 184,
    chaseWinRate: 0.48,
    pitch: "flat", 
    boundary: "tiny",
    dewFactor: 0.2
  },
  "GT": { 
    name: "Narendra Modi Stadium", 
    city: "Ahmedabad", 
    avgFirst: 175, avgSecond: 168,
    chaseWinRate: 0.45,
    pitch: "green", 
    boundary: "large",
    dewFactor: 0.4
  },
  "LSG": { 
    name: "Ekana Cricket Stadium", 
    city: "Lucknow", 
    avgFirst: 158, avgSecond: 151,
    chaseWinRate: 0.38,
    pitch: "slow", 
    boundary: "large",
    dewFactor: 0.6
  },
  "PBKS": { 
    name: "PCA Stadium Mohali", 
    city: "Mohali", 
    avgFirst: 179, avgSecond: 172,
    chaseWinRate: 0.47,
    pitch: "green", 
    boundary: "medium",
    dewFactor: 0.3
  },
  "KKR": { 
    name: "Eden Gardens", 
    city: "Kolkata", 
    avgFirst: 180, avgSecond: 174,
    chaseWinRate: 0.51,
    pitch: "slow", 
    boundary: "medium",
    dewFactor: 0.7
  },
  "RR": { 
    name: "Sawai Mansingh Stadium", 
    city: "Jaipur", 
    avgFirst: 172, avgSecond: 165,
    chaseWinRate: 0.43,
    pitch: "dusty", 
    boundary: "large",
    dewFactor: 0.2
  },
  "DC": { 
    name: "Arun Jaitley Stadium", 
    city: "Delhi", 
    avgFirst: 183, avgSecond: 177,
    chaseWinRate: 0.49,
    pitch: "flat", 
    boundary: "small",
    dewFactor: 0.5
  },
  "SRH": { 
    name: "Rajiv Gandhi Intl", 
    city: "Hyderabad", 
    avgFirst: 187, avgSecond: 179,
    chaseWinRate: 0.46,
    pitch: "flat", 
    boundary: "medium",
    dewFactor: 0.4
  }
};

// Seeded RNG for reproducibility
let rngSeed = Date.now();
function seededRandom() {
  rngSeed = (rngSeed * 9301 + 49297) % 233280;
  return rngSeed / 233280;
}

// Reset RNG seed (useful for testing)
function resetRNGSeed(seed = Date.now()) {
  rngSeed = seed;
}

// --- IMPROVED FORM TRACKING (More Stable) ---
const formTracker = {};

function getForm(name) {
  if (!formTracker[name]) formTracker[name] = 1.0;
  return formTracker[name];
}

// More gradual form changes (realistic)
function updateBattingForm(name, runs, balls) {
  if (!formTracker[name]) formTracker[name] = 1.0;
  if (balls < 5) return; // Ignore very short innings
  
  const sr = (runs / balls) * 100;
  let adjustment = 0;
  
  // Gradual adjustments based on performance
  if (runs > 50) adjustment = 0.03;
  else if (runs > 30 && sr > 140) adjustment = 0.02;
  else if (runs < 10 && balls > 10) adjustment = -0.02;
  else if (sr < 90 && balls > 15) adjustment = -0.03;
  
  formTracker[name] = Math.max(0.85, Math.min(1.15, formTracker[name] + adjustment));
}

function updateBowlingForm(name, runs, wickets, overs) {
  if (!formTracker[name]) formTracker[name] = 1.0;
  if (overs < 2) return;
  
  const economy = runs / overs;
  let adjustment = 0;
  
  if (wickets >= 3) adjustment = 0.03;
  else if (wickets >= 2 && economy < 8) adjustment = 0.02;
  else if (wickets === 0 && economy > 12) adjustment = -0.02;
  else if (economy > 14) adjustment = -0.03;
  
  formTracker[name] = Math.max(0.85, Math.min(1.15, formTracker[name] + adjustment));
}

// --- VENUE HELPERS ---
function getVenueForTeam(teamName) {
  const upperName = (teamName || '').toUpperCase();
  for (const key of Object.keys(VENUE_MAP)) {
    if (upperName.includes(key)) return VENUE_MAP[key];
  }
  // Random venue as fallback
  const keys = Object.keys(VENUE_MAP);
  return VENUE_MAP[keys[Math.floor(seededRandom() * keys.length)]];
}

// --- 2. BOWLING LOGIC (IMPROVED) ---
const bowlingLogic = {
  getBowlerType: (player) => {
    const role = (player.roleKey?.toLowerCase() || player.role?.toLowerCase() || '');
    const name = (player.name || '').toLowerCase();
    
    if (role.includes('off') || name.includes('ashwin') || name.includes('narine')) {
      return 'off-spinner';
    }
    if (role.includes('leg') || name.includes('chahal') || name.includes('rashid')) {
      return 'leg-spinner';
    }
    if (role.includes('spin') || name.includes('jadeja') || name.includes('kuldeep')) {
      return 'spinner';
    }
    
    return 'pacer'; // Default
  },

  prepareBowlersForInnings: (playing11) => {
    // Get genuine bowlers first
    let bowlers = playing11
      .filter(p => {
        const r = (p.roleKey || p.role || '').toLowerCase();
        if (r.includes('wk')) return false; // No keepers
        return (r.includes('bowl') || r.includes('fast') || r.includes('spin') || r.includes('ar') || r.includes('all'));
      })
      .map(p => ({
        ...p,
        maxOvers: 4,
        remaining: 4,
        oversUsed: 0,
        balls: 0,
        maidens: 0,
        wkts: 0,
        runs: 0,
        runsThisOver: 0, // Track runs in current over
        lastBowledOver: -99,
        economy: "0.00",
        oversDisplay: "0.0"
      }));

    let totalCapacity = bowlers.reduce((sum, b) => sum + b.remaining, 0);

    // Add part-timers if needed
    if (totalCapacity < 20) {
      const others = playing11.filter(p => !bowlers.find(b => b.name === p.name));
      let needed = Math.ceil((20 - totalCapacity) / 4);
      
      for (let i = 0; i < Math.min(needed, others.length); i++) {
        bowlers.push({
          ...others[i],
          isPartTime: true,
          maxOvers: 4,
          remaining: 4,
          oversUsed: 0,
          balls: 0,
          maidens: 0,
          wkts: 0,
          runs: 0,
          runsThisOver: 0,
          lastBowledOver: -99,
          economy: "0.00",
          oversDisplay: "0.0"
        });
        totalCapacity += 4;
      }
    }

    // Sort by bowling skill
    return bowlers.sort((a, b) => (b.stats?.bowl || 50) - (a.stats?.bowl || 50));
  },

  selectBowlerForOver: (bowlable, overNumber, phase, recentBowlers) => {
    // Filter: Must have overs remaining
    let candidates = bowlable.filter(b => b.remaining > 0);
    
    if (candidates.length === 0) return null;

    // REALISTIC: Avoid bowling same bowler back-to-back (unless desperate)
    const lastBowler = recentBowlers[recentBowlers.length - 1];
    let preferred = candidates.filter(b => b.name !== lastBowler);
    
    if (preferred.length === 0) preferred = candidates; // Fallback

    // Phase-based selection weights
    const getPhaseScore = (b) => {
      let score = b.stats?.bowl || 60;
      const type = bowlingLogic.getBowlerType(b);
      
      // Powerplay: Prefer pacers with swing
      if (phase === 'pp') {
        if (type.includes('pacer')) score += 15;
        else score -= 5;
      }
      
      // Middle overs: Spinners dominate
      if (phase === 'mid') {
        if (type.includes('spin')) score += 12;
      }
      
      // Death: Premium pacers only
      if (phase === 'death') {
        if (type.includes('pacer') && score > 75) score += 20;
        else if (type.includes('spin')) score -= 10;
      }

      // Penalize expensive bowlers (economy > 10)
      const overs = b.balls / 6;
      if (overs > 0 && (b.runs / overs) > 10) {
        score -= 15;
      }

      // Part-timers only in desperation
      if (b.isPartTime) score -= 25;

      return score + (seededRandom() * 10); // Small randomness
    };

    preferred.sort((a, b) => getPhaseScore(b) - getPhaseScore(a));
    return preferred[0];
  },

  updateBowlerStats: (bowler, runs) => {
    bowler.runs += runs;
    bowler.runsThisOver += runs; // Track for maiden detection
  },

  startBowlerOver: (bowler) => {
    bowler.runsThisOver = 0; // Reset at start of over
  },

  // ✅ FIX #3: Corrected maiden over detection
  endBowlerOver: (bowler) => {
    bowler.remaining--;
    bowler.oversUsed++;
    
    const overs = Math.floor(bowler.balls / 6);
    const balls = bowler.balls % 6;
    bowler.oversDisplay = `${overs}.${balls}`;
    
    const totalOvers = bowler.balls / 6;
    bowler.economy = totalOvers > 0 ? (bowler.runs / totalOvers).toFixed(2) : "0.00";
    
    // Check for maiden over - if no runs conceded this over
    if (bowler.runsThisOver === 0) {
      bowler.maidens++;
    }
  }
};

// --- 3. BATTING LOGIC (IMPROVED) ---
const battingLogic = {
  getRole: (p) => {
    const n = (p.name || '').toLowerCase();
    const role = (p.roleKey || p.role || '').toLowerCase();
    
    // Openers
    const openers = ['rohit', 'dhawan', 'warner', 'gill', 'buttler', 'shaw', 'bairstow', 'head', 'conway', 'gaikwad', 'samson'];
    if (openers.some(x => n.includes(x))) return 'opener';
    
    // Anchors (#3, #4)
    const anchors = ['kohli', 'williamson', 'rahul', 'du plessis', 'iyer', 'rana', 'kishan', 'tripathi'];
    if (anchors.some(x => n.includes(x))) return 'anchor';
    
    // Finishers (#5, #6, #7)
    const finishers = ['russell', 'hardik', 'pollard', 'pant', 'jadeja', 'maxwell', 'sky', 'miller', 'powell', 'curran', 'stoinis', 'livingstone'];
    if (finishers.some(x => n.includes(x))) return 'finisher';
    
    // All-rounders (adapt based on situation)
    if (role.includes('ar') || role.includes('all')) return 'allrounder';
    
    return 'middle'; // Default
  },

  // REALISTIC wicket type distribution
  getWicketType: (batter, bowler, phase) => {
    const r = seededRandom();
    const bowlType = bowlingLogic.getBowlerType(bowler);
    
    // Run outs are genuinely rare (3-5% of all dismissals)
    if (phase === 'death' && r < 0.06) return 'run out';
    if (r < 0.03) return 'run out';
    
    const wR = seededRandom();
    
    if (bowlType.includes('spin')) {
      // Spinners: More caught, some stumping
      if (wR < 0.55) return 'caught';
      if (wR < 0.75) return 'bowled';
      if (wR < 0.88) return 'lbw';
      if (wR < 0.95) return 'stumped';
      return 'caught and bowled';
    } else {
      // Pacers: Mainly caught and bowled
      if (wR < 0.65) return 'caught';
      if (wR < 0.82) return 'bowled';
      if (wR < 0.95) return 'lbw';
      return 'caught and bowled';
    }
  },

  calculateBallOutcome: (batter, bowler, matchState, venue, partnership) => {
    const { phase, reqRR, isChasing, wicketsDown, momentum, ballsLeft, currentScore, ballsBowled, dewActive } = matchState;
    
    let mode = 'normal';
    const role = battingLogic.getRole(batter);
    
    // --- SITUATION ANALYSIS ---
    
    // Partnership building (first 15 balls together)
    if (partnership && partnership.balls < 15) {
      mode = 'anchor'; // Build partnership first
    }
    
    // Wicket cluster handling (2+ wickets in last 3 overs)
    if (wicketsDown >= 2) {
      mode = 'anchor'; // Consolidate
    }
    
    // Phase-based defaults
    if (phase === 'pp' && wicketsDown === 0) {
      mode = 'powerplay'; // Utilize field restrictions
    } else if (phase === 'mid' && wicketsDown <= 3) {
      mode = 'controlled'; // Steady accumulation
    } else if (phase === 'death') {
      mode = 'death'; // Accelerate
    }
    
    // Role overrides
    if (role === 'finisher' && ballsLeft < 36) {
      mode = 'aggressive';
    }
    if (role === 'finisher' && ballsLeft < 18) {
      mode = 'desperate';
    }
    if (role === 'opener' && phase === 'pp') {
      mode = wicketsDown === 0 ? 'aggressive' : 'controlled';
    }
    if (role === 'anchor') {
      mode = wicketsDown >= 3 ? 'anchor' : 'controlled';
    }
    
    // Chase pressure (realistic thresholds)
    if (isChasing) {
      if (reqRR > 15) mode = 'desperate';
      else if (reqRR > 12) mode = 'death';
      else if (reqRR > 9) mode = 'aggressive';
      else if (reqRR < 6) mode = 'anchor'; // Cruising
      
      // Pressure increases with balls running out
      if (ballsLeft < 12 && reqRR > 10) mode = 'desperate';
    }
    
    // Momentum riding
    if (momentum > 3 && mode === 'normal') mode = 'aggressive';
    
    // --- BASE WEIGHTS ---
    let weights = { ...OUTCOME_WEIGHTS[mode] };
    
    // --- DEW EFFECT (Realistic - only in evening games, 2nd innings) ---
    if (dewActive) {
      weights['W'] = Math.max(1, weights['W'] - 1);
      weights[4] = (weights[4] || 0) + 1;
      weights[6] = (weights[6] || 0) + 1;
    }
    
    // --- VENUE EFFECTS ---
    const pitchEffect = PITCH_EFFECTS[venue.pitch];
    if (pitchEffect) {
      for (let k in pitchEffect) {
        if (weights[k] !== undefined) {
          weights[k] = Math.max(0, weights[k] + pitchEffect[k]);
        }
      }
    }
    
    // Boundary size matters
    if (venue.boundary === 'tiny') {
      weights[6] = (weights[6] || 0) + 3;
      weights[4] = (weights[4] || 0) + 2;
    } else if (venue.boundary === 'large') {
      weights[6] = Math.max(1, (weights[6] || 0) - 2);
      weights[1] = (weights[1] || 0) + 2;
      weights[2] = (weights[2] || 0) + 1;
    }
    
    // --- SKILL DIFFERENTIAL (Subtle) ---
    const batForm = getForm(batter.name);
    const bowlForm = getForm(bowler.name);
    
    const batSkill = (batter.stats?.bat || 70) * batForm;
    const bowlSkill = (bowler.stats?.bowl || 70) * bowlForm;
    const diff = batSkill - bowlSkill;
    
    // Adjust outcomes based on skill gap
    if (diff > 20) {
      weights[4] = (weights[4] || 0) + 3;
      weights[6] = (weights[6] || 0) + 2;
      weights['W'] = Math.max(1, (weights['W'] || 0) - 2);
      weights[0] = Math.max(5, (weights[0] || 0) - 2);
    } else if (diff < -20) {
      weights['W'] = (weights['W'] || 0) + 3;
      weights[0] = (weights[0] || 0) + 3;
      weights[6] = Math.max(1, (weights[6] || 0) - 1);
    }
    
    // --- SELECT OUTCOME ---
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let r = seededRandom() * total;
    let result = 0;
    
    for (const [outcome, weight] of Object.entries(weights)) {
      r -= weight;
      if (r <= 0) {
        result = outcome;
        break;
      }
    }
    
    let out = { runs: 0, wicket: false, extra: null, wicketType: null };
    
    if (result === 'W') {
      out.wicket = true;
      out.wicketType = battingLogic.getWicketType(batter, bowler, phase);
    } else if (result === 'WD' || result === 'NB') {
      out.extra = result;
      out.runs = 1;
      // No ball allows batsman to score runs too
      if (result === 'NB' && seededRandom() < 0.4) {
        const bonusRuns = [0, 1, 2, 4, 6];
        out.runs += bonusRuns[Math.floor(seededRandom() * bonusRuns.length)];
      }
    } else {
      out.runs = parseInt(result);
    }
    
    return out;
  }
};

// --- GLOBAL STATS TRACKING ---
const allStats = {};
const playerToTeam = {};

const getPStat = (name, currentTeamName = "Unknown") => {
  if (!allStats[name]) {
    allStats[name] = {
      name,
      team: playerToTeam[name] || currentTeamName,
      runs: 0,
      ballsFaced: 0,
      wkts: 0,
      ballsBowled: 0,
      runsConceded: 0,
      pts: 0,
      fours: 0,
      sixes: 0,
      fifties: 0,
      hundreds: 0,
      catches: 0,
      runOuts: 0
    };
  }
  return allStats[name];
};

// --- GET ACTIVE XI (Handles Impact Players) ---
function getActiveXI(team, mode) {
  const squad = team.squad || [];
  const batImp = team.batImpact;
  const bowlImp = team.bowlImpact;

  if (!batImp || !bowlImp) return squad.slice(0, 11);

  const unwanted = mode === 'bat' ? bowlImp.name : batImp.name;
  return squad.filter(p => p.name !== unwanted).slice(0, 11);
}

// --- INNINGS SIMULATION (IMPROVED) ---
function simInnings(batTeam, bowlTeam, target, innIndex) {
  const batXI = getActiveXI(batTeam, 'bat');
  const bowlXI = getActiveXI(bowlTeam, 'bowl');
  
  let batOrder = [...batXI];
  const bowlers = bowlingLogic.prepareBowlersForInnings(bowlXI);
  
  let score = 0, wkts = 0, balls = 0;
  let striker = 0, nonStriker = 1;
  let nextBat = 2;
  let recentWicketsInLast3Overs = 0;
  let momentum = 0;
  
  const ballLog = [];
  const recentBowlers = []; // Track last few bowlers
  
  // Dew: Only in 2nd innings, venue-dependent
  const venue = getVenueForTeam(batTeam.name);
  const dewActive = (innIndex === 2 && seededRandom() < venue.dewFactor);
  
  // Partnership tracker
  let currentPartnership = { balls: 0, runs: 0 };
  
  // Batting cards
  const bCards = batOrder.map(p => ({
    name: p.name,
    runs: 0,
    balls: 0,
    status: 'dnb',
    fours: 0,
    sixes: 0,
    sr: "0.0"
  }));
  
  if (bCards[0]) bCards[0].status = 'not out';
  if (bCards[1]) bCards[1].status = 'not out';
  
  // Track wickets per over for collapse detection
  let wicketsThisOver = 0;
  let wicketsLast3Overs = [];
  
  for (let over = 0; over < 20; over++) {
    if (wkts >= 10 || (target && score >= target)) break;
    
    const phase = over < 6 ? 'pp' : over < 16 ? 'mid' : 'death';
    
    const bowler = bowlingLogic.selectBowlerForOver(bowlers, over, phase, recentBowlers);
    if (!bowler) break;
    
    bowlingLogic.startBowlerOver(bowler); // Reset runs for this over
    
    recentBowlers.push(bowler.name);
    if (recentBowlers.length > 3) recentBowlers.shift(); // Keep last 3
    
    wicketsThisOver = 0;
    let legalBalls = 0;
    
    while (legalBalls < 6) {
      if (wkts >= 10 || (target && score >= target)) break;
      
      const bat = batOrder[striker];
      const bStat = bCards[striker];
      
      // Calculate required run rate
      let reqRR = 0;
      if (target) {
        const needed = target - score;
        const ballsRem = 120 - balls;
        reqRR = ballsRem > 0 ? (needed / (ballsRem / 6)) : 0;
      }
      
      const outcome = battingLogic.calculateBallOutcome(
        bat,
        bowler,
        {
          phase,
          reqRR,
          isChasing: !!target,
          wicketsDown: recentWicketsInLast3Overs,
          momentum,
          ballsLeft: 120 - balls,
          ballsBowled: balls,
          currentScore: score,
          dewActive
        },
        venue,
        currentPartnership
      );
      
      score += outcome.runs;
      bowlingLogic.updateBowlerStats(bowler, outcome.runs);
      
      if (!outcome.extra) {
        bowler.balls++;
        currentPartnership.balls++;
      }
      
      currentPartnership.runs += outcome.runs;
      
      ballLog.push({
        over: `${over}.${legalBalls + 1}`,
        bat: bat.name,
        bowl: bowler.name,
        ...outcome
      });
      
      // Update bowler stats
      const bs = getPStat(bowler.name, bowlTeam.name);
      bs.runsConceded += outcome.runs;
      if (!outcome.extra) bs.ballsBowled++;
      
      if (outcome.wicket) {
        wkts++;
        wicketsThisOver++;
        momentum = 0;
        currentPartnership = { balls: 0, runs: 0 }; // Reset partnership
        
        bStat.status = `${outcome.wicketType}`;
        if (!outcome.extra) bStat.balls++;
        
        // Update batting form
        updateBattingForm(bat.name, bStat.runs, bStat.balls);
        
        // Credit bowler (except run outs)
        if (outcome.wicketType !== 'run out') {
          bs.wkts++;
          bs.pts += 25;
          bowler.wkts++;
        } else {
          // Credit a fielder for run out (random)
          const fielders = bowlXI.filter(p => p.name !== bowler.name);
          if (fielders.length > 0) {
            const fielder = fielders[Math.floor(seededRandom() * fielders.length)];
            const fs = getPStat(fielder.name, bowlTeam.name);
            fs.runOuts++;
            fs.pts += 12;
          }
        }
        
        // Next batter
        if (nextBat < batOrder.length) {
          striker = nextBat++;
          bCards[striker].status = 'not out';
        }
      } else {
        // ✅ FIX #5: Corrected strike rotation - NB should rotate, WD shouldn't
        if (!outcome.extra || outcome.extra === 'NB') {
          bStat.runs += outcome.runs;
          
          const ps = getPStat(bat.name, batTeam.name);
          ps.runs += outcome.runs;
          ps.pts += outcome.runs;

          // Ball only counts if NOT an extra
          if (!outcome.extra) {
            bStat.balls++;
            ps.ballsFaced++;
          }
          
          if (outcome.runs === 4) {
            ps.fours++;
            bStat.fours++;
          }
          if (outcome.runs === 6) {
            ps.sixes++;
            bStat.sixes++;
            momentum = Math.min(5, momentum + 1);
          }
          
          // Rotate strike on odd runs (including NB)
          if (outcome.runs % 2 !== 0) {
            [striker, nonStriker] = [nonStriker, striker];
          }
        }
        // Wide doesn't update batsman stats or rotate strike
      }
      
      if (!outcome.extra) {
        balls++;
        legalBalls++;
      }
    }
    
    // End of over
    bowlingLogic.endBowlerOver(bowler);
    
    // Update bowler form
    const bowlerOvers = bowler.balls / 6;
    updateBowlingForm(bowler.name, bowler.runs, bowler.wkts, bowlerOvers);
    
    // Rotate strike at over end
    [striker, nonStriker] = [nonStriker, striker];
    
    // Track wicket clusters
    wicketsLast3Overs.push(wicketsThisOver);
    if (wicketsLast3Overs.length > 3) wicketsLast3Overs.shift();
    recentWicketsInLast3Overs = wicketsLast3Overs.reduce((a, b) => a + b, 0);
    
    if (momentum > 0) momentum--;
  }
  
  // Final form updates
  bCards.forEach(c => {
    if (c.status === 'not out' && c.balls > 0) {
      updateBattingForm(c.name, c.runs, c.balls);
    }
    c.sr = c.balls > 0 ? ((c.runs / c.balls) * 100).toFixed(1) : "0.0";
    
    // Check for milestones
    const ps = getPStat(c.name, batTeam.name);
    if (c.runs >= 50 && c.runs < 100) ps.fifties++;
    if (c.runs >= 100) ps.hundreds++;
  });
  
  // ✅ FIX #2: Calculate extras properly (sum of runs, not count of balls)
  const extras = ballLog
    .filter(b => b.extra)
    .reduce((sum, b) => sum + b.runs, 0);
  
  return {
    team: batTeam.name,
    score,
    wkts,
    balls,
    overs: `${Math.floor(balls / 6)}.${balls % 6}`,
    batting: bCards,
    bowling: bowlers,
    ballLog,
    extras
  };
}

// --- MATCH SIMULATION (IMPROVED) ---
function simulateMatch(t1, t2, type = "League") {
  const venue = getVenueForTeam(t1.name);
  
  // Toss
  const tossWinner = seededRandom() > 0.5 ? t1 : t2;
  const tossLoser = tossWinner === t1 ? t2 : t1;
  
  // ✅ FIX #6: Better toss decision logic
  let electedTo;
  if (venue.chaseWinRate > 0.5) {
    electedTo = "bowl"; // Prefer chasing if venue favors it
  } else if (venue.avgFirst > 185) {
    electedTo = "bowl"; // High-scoring venues favor chasing
  } else {
    electedTo = seededRandom() < 0.5 ? "bat" : "bowl";
  }
  
  let firstBat = electedTo === "bat" ? tossWinner : tossLoser;
  let secondBat = electedTo === "bat" ? tossLoser : tossWinner;
  
  // Simulate both innings
  const i1 = simInnings(firstBat, secondBat, null, 1);
  const i2 = simInnings(secondBat, firstBat, i1.score + 1, 2); // Target = score + 1
  
  // ✅ FIX #4: Corrected winner margin text
  let winner, margin;
  
  if (i2.score > i1.score) {
    winner = secondBat.name;
    const wkLeft = 10 - i2.wkts;
    margin = `${wkLeft} wicket${wkLeft === 1 ? '' : 's'}`;
  } else if (i1.score > i2.score) {
    winner = firstBat.name;
    const runDiff = i1.score - i2.score;
    margin = `${runDiff} run${runDiff === 1 ? '' : 's'}`;
  } else {
    winner = "Tie";
    margin = "Tied";

    // Handle Playoff Ties with Super Over
    if (type !== "League") {
      const getTeamStrength = (team) => {
        const squad = team.squad || [];
        let bat = 0, bowl = 0;
        squad.forEach(p => {
          bat += p.stats?.bat || 60;
          bowl += p.stats?.bowl || 60;
        });
        return bat + bowl;
      };

      const t1Form = getTeamStrength(t1);
      const t2Form = getTeamStrength(t2);
      const superOverWinner = (t1Form + (seededRandom() * 20)) > (t2Form + (seededRandom() * 20)) ? t1 : t2;
      winner = superOverWinner.name;
      margin = "won via Super Over";
    }
  }
  
  // Map scores to correct teams
  const t1Score = firstBat.name === t1.name ? i1 : i2;
  const t2Score = firstBat.name === t2.name ? i1 : i2;
  
  return {
    t1: t1.name,
    t2: t2.name,
    score1: `${t1Score.score}/${t1Score.wkts} (${t1Score.overs})`,
    score2: `${t2Score.score}/${t2Score.wkts} (${t2Score.overs})`,
    winner,
    winnerName: winner,
    margin,
    toss: `${tossWinner.name} won toss & chose to ${electedTo}`,
    tossDetails: { winner: tossWinner.name, decision: electedTo },
    venue,
    type,
    details: {
      i1: { ...i1, teamName: firstBat.name },
      i2: { ...i2, teamName: secondBat.name }
    },
    batFirst: firstBat.name
  };
}

// --- ACCURATE NRR CALCULATION ---
function calculateNRR(runsScored, oversFaced, runsConceded, oversBowled) {
  if (oversFaced === 0 || oversBowled === 0) return 0;
  const runRate = runsScored / oversFaced;
  const againstRate = runsConceded / oversBowled;
  return parseFloat((runRate - againstRate).toFixed(3));
}

// --- TOURNAMENT SIMULATION ---
function runLocalTournament(tourneyTeams) {
  if (!tourneyTeams || tourneyTeams.length < 2) {
    throw new Error("Need at least 2 teams");
  }
  
  // Reset stats
  for (const key in allStats) delete allStats[key];
  for (const key in playerToTeam) delete playerToTeam[key];
  for (const key in formTracker) delete formTracker[key];
  
  // Initialize teams
  tourneyTeams.forEach(t => {
    if (!t.squad) t.squad = [];
    
    // Fill dummy players if needed
    while (t.squad.length < 12) {
      t.squad.push({
        name: `Player_${t.name}_${t.squad.length + 1}`,
        roleKey: 'ar',
        stats: { bat: 65, bowl: 65, luck: 50 }
      });
    }
    
    // Map players
    t.squad.forEach(p => playerToTeam[p.name] = t.name);
    
    // Team stats
    t.stats = {
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      pts: 0,
      nrr: 0,
      totalRunsScored: 0,
      totalOversFaced: 0,
      totalRunsConceded: 0,
      totalOversBowled: 0
    };
  });
  
  const matches = [];
  
  // League stage helper
  function updateLeagueStats(match) {
    const t1 = tourneyTeams.find(t => t.name === match.t1);
    const t2 = tourneyTeams.find(t => t.name === match.t2);
    if (!t1 || !t2) return;
    
    t1.stats.played++;
    t2.stats.played++;
    
    // ✅ FIX #7: Parse scores properly and handle all-out NRR calculation
    const parseScore = (str, wickets) => {
      const parts = str.match(/(\d+)\/(\d+)\s*\((\d+)\.(\d+)\)/);
      if (!parts) return { runs: 0, overs: 20 };
      const overs = parseInt(parts[3]);
      const balls = parseInt(parts[4]);
      const wkts = parseInt(parts[2]);
      
      // IPL NRR rule: If all out, count full 20 overs
      const actualOvers = wkts === 10 ? 20 : (overs + (balls / 6));
      
      return {
        runs: parseInt(parts[1]),
        overs: actualOvers
      };
    };
    
    const s1 = parseScore(match.score1, match.details.i1.wkts);
    const s2 = parseScore(match.score2, match.details.i2.wkts);
    
    // Accumulate for NRR
    t1.stats.totalRunsScored += s1.runs;
    t1.stats.totalOversFaced += s1.overs;
    t1.stats.totalRunsConceded += s2.runs;
    t1.stats.totalOversBowled += s2.overs;
    
    t2.stats.totalRunsScored += s2.runs;
    t2.stats.totalOversFaced += s2.overs;
    t2.stats.totalRunsConceded += s1.runs;
    t2.stats.totalOversBowled += s1.overs;
    
    // Points
    if (match.winner === "Tie") {
      t1.stats.tied++;
      t2.stats.tied++;
      t1.stats.pts += 1;
      t2.stats.pts += 1;
    } else if (match.winner === t1.name) {
      t1.stats.won++;
      t1.stats.pts += 2;
      t2.stats.lost++;
    } else {
      t2.stats.won++;
      t2.stats.pts += 2;
      t1.stats.lost++;
    }
  }
  
  // League matches (Double Round Robin - Home & Away)
  for (let i = 0; i < tourneyTeams.length; i++) {
    for (let j = 0; j < tourneyTeams.length; j++) {
      if (i === j) continue;
      
      // t[i] is Home, t[j] is Away
      const m = simulateMatch(tourneyTeams[i], tourneyTeams[j], "League");
      updateLeagueStats(m);
      matches.push(m);
    }
  }
  
  // Calculate final NRR
  tourneyTeams.forEach(t => {
    t.stats.nrr = calculateNRR(
      t.stats.totalRunsScored,
      t.stats.totalOversFaced,
      t.stats.totalRunsConceded,
      t.stats.totalOversBowled
    );
  });
  
  // Standings
  const standings = [...tourneyTeams].sort((a, b) => {
    if (b.stats.pts !== a.stats.pts) return b.stats.pts - a.stats.pts;
    return b.stats.nrr - a.stats.nrr;
  });
  
  // Playoffs
  const playoffs = [];
  let champion = standings[0];
  let runnerUp = standings[1];
  
  if (standings.length >= 4) {
    const q1 = simulateMatch(standings[0], standings[1], "Qualifier 1");
    const eli = simulateMatch(standings[2], standings[3], "Eliminator");
    
    // Determine winner/loser of Q1 correctly
    const winQ1 = q1.winner === standings[0].name ? standings[0] : standings[1];
    const loseQ1 = q1.winner === standings[0].name ? standings[1] : standings[0];
    const winEli = eli.winner === standings[2].name ? standings[2] : standings[3];
    
    const q2 = simulateMatch(loseQ1, winEli, "Qualifier 2");
    const winQ2 = q2.winner === loseQ1.name ? loseQ1 : winEli;
    
    const final = simulateMatch(winQ1, winQ2, "Final");
    
    champion = final.winner === winQ1.name ? winQ1 : winQ2;
    runnerUp = final.winner === winQ1.name ? winQ2 : winQ1;
    
    playoffs.push(q1, eli, q2, final);
  } else if (standings.length === 3) {
    // Qualifier: 2nd vs 3rd
    const qualifier = simulateMatch(standings[1], standings[2], "Qualifier");
    const winQual = qualifier.winner === standings[1].name ? standings[1] : standings[2];
    
    // Final: 1st vs Winner of Qualifier
    const final = simulateMatch(standings[0], winQual, "Final");
    
    champion = final.winner === standings[0].name ? standings[0] : winQual;
    runnerUp = final.winner === standings[0].name ? winQual : standings[0];
    
    playoffs.push(qualifier, final);
  } else if (standings.length === 2) {
    // Direct Final for exactly 2 teams
    const final = simulateMatch(standings[0], standings[1], "Final");
    
    champion = final.winner === standings[0].name ? standings[0] : standings[1];
    runnerUp = final.winner === standings[0].name ? standings[1] : standings[0];
    
    playoffs.push(final);
  }
  
  // Awards
  const getTopBatsman = () => {
    let best = { name: "N/A", val: 0, team: "N/A" };
    for (let p in allStats) {
      if (allStats[p].runs > best.val) {
        best = {
          name: p,
          val: allStats[p].runs,
          team: allStats[p].team
        };
      }
    }
    return best;
  };
  
  const getTopBowler = () => {
    let best = { name: "N/A", val: 0, team: "N/A" };
    for (let p in allStats) {
      if (allStats[p].wkts > best.val) {
        best = {
          name: p,
          val: allStats[p].wkts,
          team: allStats[p].team
        };
      }
    }
    return best;
  };
  
  const getMVP = () => {
    let best = { name: "N/A", val: 0, team: "N/A" };
    for (let p in allStats) {
      if (allStats[p].pts > best.val) {
        best = {
          name: p,
          val: allStats[p].pts,
          team: allStats[p].team
        };
      }
    }
    return best;
  };
  
  const getMostSixes = () => {
    let best = { name: "N/A", val: 0, team: "N/A" };
    for (let p in allStats) {
      if (allStats[p].sixes > best.val) {
        best = {
          name: p,
          val: allStats[p].sixes,
          team: allStats[p].team
        };
      }
    }
    return best;
  };
  
  const getHighestSR = () => {
    let best = { name: "N/A", val: 0, team: "N/A" };
    for (let p in allStats) {
      const ps = allStats[p];
      if (ps.ballsFaced >= 50) { // Minimum 50 balls for SR qualification
        const sr = (ps.runs / ps.ballsFaced) * 100;
        if (sr > best.val) {
          best = {
            name: p,
            val: parseFloat(sr.toFixed(2)),
            team: ps.team
          };
        }
      }
    }
    return best;
  };
  
  const getBestEconomy = () => {
    let best = { name: "N/A", val: 999, team: "N/A" };
    for (let p in allStats) {
      const ps = allStats[p];
      if (ps.ballsBowled >= 24) { // Min 4 overs for economy qualification
        const overs = ps.ballsBowled / 6;
        const eco = ps.runsConceded / overs;
        if (eco < best.val) {
          best = {
            name: p,
            val: parseFloat(eco.toFixed(2)),
            team: ps.team
          };
        }
      }
    }
    return best;
  };
  
  // ✅ FIX #1: Corrected best bowling strike rate calculation
  const getBestStrikeRate = () => {
    let best = { name: "N/A", val: 999, team: "N/A" }; // Start at 999, not 0
    for (let p in allStats) {
      const ps = allStats[p];
      if (ps.ballsBowled >= 24 && ps.wkts > 0) { // Min 4 overs and at least 1 wicket
        const sr = ps.ballsBowled / ps.wkts;
        if (sr < best.val) { // Lower is better
          best = {
            name: p,
            val: parseFloat(sr.toFixed(2)),
            team: ps.team
          };
        }
      }
    }
    if (best.val === 999) {
      best = { name: "N/A", val: "N/A", team: "N/A" };
    }
    return best;
  };
  
  const totalSixes = Object.values(allStats).reduce((sum, p) => sum + (p.sixes || 0), 0);
  const totalFours = Object.values(allStats).reduce((sum, p) => sum + (p.fours || 0), 0);
  
  return {
    winner: { name: champion.name, playerName: champion.playerName },
    runnerUp: { name: runnerUp.name, playerName: runnerUp.playerName },
    standings: standings.map(s => ({
      name: s.name,
      playerName: s.playerName,
      stats: s.stats,
      bidKey: s.bidKey,
      squad: s.squad
    })),
    leagueMatches: matches,
    playoffs,
    orangeCap: getTopBatsman(),
    purpleCap: getTopBowler(),
    mvp: getMVP(),
    mostSixes: getMostSixes(),
    highestSr: getHighestSR(),
    bestEco: getBestEconomy(),
    bestBowlingSR: getBestStrikeRate(),
    tournamentSixes: totalSixes,
    tournamentFours: totalFours,
    allStats: Object.values(allStats).map(p => ({
      name: p.name,
      team: p.team,
      runs: p.runs,
      balls: p.ballsFaced,
      sr: p.ballsFaced > 0 ? ((p.runs / p.ballsFaced) * 100).toFixed(2) : "0.00",
      wickets: p.wkts,
      ballsBowled: p.ballsBowled,
      runsConceded: p.runsConceded,
      economy: p.ballsBowled > 0 ? ((p.runsConceded / (p.ballsBowled / 6))).toFixed(2) : "0.00",
      fours: p.fours,
      sixes: p.sixes,
      fifties: p.fifties,
      hundreds: p.hundreds,
      points: p.pts
    })).sort((a, b) => b.points - a.points)
  };
}

// --- TOURNAMENT ENTRY POINT (Local Engine Only) ---
async function runFullTournament(tourneyTeams, customPrompt = "") {
  console.log("🎮 Simulating tournament with Local Engine...");
  try {
    return runLocalTournament(tourneyTeams);
  } catch (err) {
    console.error("❌ Simulation failed:", err);
    return { error: "Simulation failed", details: err.message };
  }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    runFullTournament, 
    simulateMatch,
    resetRNGSeed,
    allStats,
    playerToTeam,
    formTracker
  };
}