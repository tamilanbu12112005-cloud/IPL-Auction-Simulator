// Handle challenge acceptance/rejection
document.addEventListener("DOMContentLoaded", () => {
  const acceptButton = document.getElementById("acceptChallenge");
  const rejectButton = document.getElementById("rejectChallenge");

  if (acceptButton) {
    acceptButton.addEventListener("click", () => {
      // Redirect to game.html on acceptance
      window.location.href = "game.html";
    });
  }

  if (rejectButton) {
    rejectButton.addEventListener("click", () => {
      // Close the modal on rejection
      const challengeModal = bootstrap.Modal.getInstance(
        document.getElementById("challengeModal"),
      );
      if (challengeModal) {
        challengeModal.hide();
      }
    });
  }
});

// Real-time match logic
if (typeof socket === 'undefined') {
  window.socket = (typeof io !== 'undefined') ? io() : null;
}

// Handle Toss Logic
document.addEventListener("DOMContentLoaded", () => {
  const tossScreen = document.getElementById("toss-screen");
  const tossResult = document.getElementById("toss-result");
  const headsBtn = document.getElementById("heads-btn");
  const tailsBtn = document.getElementById("tails-btn");

  // Show toss screen
  tossScreen.classList.remove("hidden");

  headsBtn.addEventListener("click", () => {
    socket.emit("toss", "heads");
  });

  tailsBtn.addEventListener("click", () => {
    socket.emit("toss", "tails");
  });

  // Listen for toss result
  socket.on("toss-result", (result) => {
    tossResult.textContent = `Toss Result: ${result}`;
    tossResult.classList.remove("hidden");
    tossScreen.classList.add("hidden");

    // Proceed to team selection
    document.getElementById("team-selection").classList.remove("hidden");

    // Initialize match after toss
    initializeMatch();
  });
});

// Team Selection Logic
socket.on("team-selection", (teams) => {
  const battingSquad = document.getElementById("batting-squad");
  const bowlingSquad = document.getElementById("bowling-squad");

  // Populate batting team
  teams.batting.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = player.name;
    battingSquad.appendChild(li);
  });

  // Populate bowling team
  teams.bowling.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = player.name;
    bowlingSquad.appendChild(li);
  });

  // Show live match section
  document.getElementById("team-selection").classList.add("hidden");
  document.getElementById("live-match").classList.remove("hidden");

  // Start match simulation
  startMatchSimulation();
});

// Match Initialization
function initializeMatch() {
  const teams = {
    CSK: [
      { name: "Player 1" },
      { name: "Player 2" },
      { name: "Player 3" },
      { name: "Player 4" },
      { name: "Player 5" },
      { name: "Player 6" },
      { name: "Player 7" },
      { name: "Player 8" },
      { name: "Player 9" },
      { name: "Player 10" },
      { name: "Player 11" },
    ],
    MI: [
      { name: "Player A" },
      { name: "Player B" },
      { name: "Player C" },
      { name: "Player D" },
      { name: "Player E" },
      { name: "Player F" },
      { name: "Player G" },
      { name: "Player H" },
      { name: "Player I" },
      { name: "Player J" },
      { name: "Player K" },
    ],
  };

  // Emit teams to the client
  socket.emit("team-selection", {
    batting: teams.CSK,
    bowling: teams.MI,
  });
}

function startMatchSimulation() {
  // Simulate each ball
  socket.on("ball-outcome", (outcome) => {
    const commentaryFeed = document.getElementById("commentary-feed");
    const overFeed = document.getElementById("over-feed");
    const currentScore = document.getElementById("current-score");
    const overs = document.getElementById("overs");

    // Update commentary
    const li = document.createElement("li");
    li.textContent = outcome.commentary;
    commentaryFeed.appendChild(li);

    // Update over history
    if (outcome.overUpdate) {
      const overLi = document.createElement("li");
      overLi.textContent = outcome.overUpdate;
      overFeed.appendChild(overLi);
    }

    // Update scoreboard
    currentScore.textContent = `Score: ${outcome.score}`;
    overs.textContent = `Overs: ${outcome.overs}`;
  });
}
