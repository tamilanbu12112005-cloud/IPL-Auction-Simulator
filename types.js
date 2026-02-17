/**
 * @typedef {Object} Player
 * @property {string} name - Player name
 * @property {string} role - Player role (bat/bowl/ar/wk)
 * @property {string} type - Player type (Indian/Foreign)
 * @property {number} basePrice - Base auction price
 * @property {number} [price] - Sold price
 * @property {string} [status] - Player status (SOLD/UNSOLD)
 */

/**
 * @typedef {Object} PlayerStats
 * @property {number} bat - Batting skill (0-100)
 * @property {number} bowl - Bowling skill (0-100)
 * @property {number} luck - Luck factor (0-100)
 * @property {string} trait - Player trait (clutch/finisher/anchor/etc)
 * @property {string} [hand] - Batting hand (rhb/lhb)
 */

/**
 * @typedef {Object} Team
 * @property {string} name - Team name
 * @property {string} bidKey - Unique team identifier
 * @property {Player[]} roster - Team roster
 * @property {Player[]} squad - Playing XI
 * @property {number} budget - Remaining budget
 * @property {number} totalSpent - Total amount spent
 * @property {number} totalPlayers - Total players bought
 */

/**
 * @typedef {Object} Venue
 * @property {string} name - Stadium name
 * @property {string} city - City name
 * @property {number[]} range - Score range [min, max]
 * @property {number} chaseProb - Chase win probability
 * @property {string} pitch - Pitch type (flat/green/dusty/slow)
 * @property {string} boundary - Boundary size (tiny/small/medium/large)
 * @property {number} six - Six-hitting factor
 * @property {number} pace - Pace bowling factor
 * @property {number} spin - Spin bowling factor
 */

/**
 * @typedef {Object} BallOutcome
 * @property {number|string} runs - Runs scored (0-6, WD, NB, W)
 * @property {boolean} isWicket - Whether it's a wicket
 * @property {Object} [wicket] - Wicket details
 * @property {string} wicket.type - Wicket type
 * @property {string} [wicket.fielder] - Fielder name
 */

/**
 * @typedef {Object} MatchState
 * @property {string} phase - Match phase (pp/mid/death)
 * @property {number} reqRR - Required run rate
 * @property {boolean} isChasing - Is team chasing
 * @property {boolean} recentCollapse - Recent wicket collapse
 * @property {number} momentum - Current momentum
 * @property {number} ballsLeft - Balls remaining
 * @property {number} currentScore - Current score
 * @property {number} ballsBowled - Balls bowled
 * @property {boolean} dewActive - Dew factor active
 * @property {number} [batterBalls] - Balls faced by batter
 * @property {number} [bowlerConfidence] - Bowler confidence
 * @property {boolean} [isKnockout] - Is knockout match
 * @property {number} [partnershipRuns] - Partnership runs
 * @property {number} [innIndex] - Innings index
 * @property {number} [consecutiveDots] - Consecutive dot balls
 * @property {number} [teamBatStrength] - Team batting strength
 * @property {number} [teamBowlStrength] - Team bowling strength
 */

/**
 * @typedef {Object} InningsResult
 * @property {number} runs - Total runs
 * @property {number} wickets - Total wickets
 * @property {number} balls - Total balls
 * @property {string} overs - Overs bowled
 * @property {Object[]} batting - Batting scorecard
 * @property {Object[]} bowling - Bowling figures
 * @property {Object[]} log - Ball-by-ball log
 * @property {Object[]} wicketLog - Wicket log
 */

/**
 * @typedef {Object} MatchResult
 * @property {string} winner - Winner team name
 * @property {string} loser - Loser team name
 * @property {string} result - Match result description
 * @property {InningsResult} inn1 - First innings
 * @property {InningsResult} inn2 - Second innings
 * @property {string} venue - Venue name
 * @property {string} toss - Toss result
 */

/**
 * @typedef {Object} TournamentResult
 * @property {string} winner - Tournament winner
 * @property {string} runnerUp - Runner up
 * @property {Object[]} pointsTable - Points table
 * @property {MatchResult[]} matches - All matches
 * @property {Object} awards - Tournament awards
 * @property {Object[]} playoffs - Playoff matches
 */

module.exports = {};
