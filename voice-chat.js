// ======================================================
// 🎤 VOICE CHAT SYSTEM (WebRTC)
// ======================================================

(function() {
  let isMicEnabled = false;
  let localStream = null;
  let peerConnections = {}; // Map of socketId -> RTCPeerConnection

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Wait for socket and DOM to be ready
  function initVoiceChat() {
    const socket = window.socket;
    if (!socket) {
        console.warn("[VoiceChat] Socket not ready, retrying in 500ms...");
        setTimeout(initVoiceChat, 500);
        return;
    }

    const micBtn = document.getElementById("micToggleBtn");
    if (micBtn) {
      micBtn.addEventListener("click", toggleMicrophone);
    }
    
    setupSocketListeners(socket);
    console.log("[VoiceChat] Initialized successfully.");
  }

  async function toggleMicrophone() {
    const micBtn = document.getElementById("micToggleBtn");
    const socket = window.socket;
    if (!socket) return;
    
    if (!isMicEnabled) {
      // Enable microphone
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }, 
          video: false 
        });
        
        isMicEnabled = true;
        micBtn.classList.remove("btn-outline-danger");
        micBtn.classList.add("btn-success");
        micBtn.innerHTML = '<i class="bi bi-mic-fill"></i>';
        micBtn.title = "Voice Chat: ON";
        
        // Notify server that we're ready for voice chat
        socket.emit("voice_ready", { roomId: window.myRoomId });
        
        if (typeof logEvent === "function") logEvent("🎤 Microphone enabled", true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("⚠️ Microphone access denied!\n\nPlease allow microphone permission in your browser settings.");
      }
    } else {
      // Disable microphone
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
      
      // Close all peer connections
      Object.values(peerConnections).forEach(pc => pc.close());
      peerConnections = {};
      
      isMicEnabled = false;
      micBtn.classList.remove("btn-success");
      micBtn.classList.add("btn-outline-danger");
      micBtn.innerHTML = '<i class="bi bi-mic-mute-fill"></i>';
      micBtn.title = "Voice Chat: OFF";
      
      socket.emit("voice_stopped", { roomId: window.myRoomId });
      
      if (typeof logEvent === "function") logEvent("🎤 Microphone disabled", true);
    }
  }

  function setupSocketListeners(socket) {
    // WebRTC Signaling
    socket.on("voice_user_ready", async (data) => {
      const { userId } = data;
      if (userId === socket.id) return; // Don't connect to ourselves
      
      console.log(`📞 Creating peer connection to ${userId}`);
      
      const pc = new RTCPeerConnection(iceServers);
      peerConnections[userId] = pc;
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      } else {
        pc.addTransceiver('audio', { direction: 'recvonly' });
      }
      
      pc.ontrack = (event) => {
        console.log(`🔊 Receiving audio from ${userId}`);
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch(e => console.error("Audio play error:", e));
      };
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("voice_ice_candidate", {
            to: userId,
            candidate: event.candidate
          });
        }
      };
      
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("voice_offer", {
          to: userId,
          offer: pc.localDescription
        });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    });

    socket.on("voice_offer", async (data) => {
      const { from, offer } = data;
      console.log(`📞 Received offer from ${from}`);
      
      const pc = new RTCPeerConnection(iceServers);
      peerConnections[from] = pc;
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }
      
      pc.ontrack = (event) => {
        console.log(`🔊 Receiving audio from ${from}`);
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch(e => console.error("Audio play error:", e));
      };
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("voice_ice_candidate", {
            to: from,
            candidate: event.candidate
          });
        }
      };
      
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("voice_answer", {
          to: from,
          answer: pc.localDescription
        });
      } catch (err) {
        console.error("Error answering offer:", err);
      }
    });

    socket.on("voice_answer", async (data) => {
      const { from, answer } = data;
      const pc = peerConnections[from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      }
    });

    socket.on("voice_ice_candidate", async (data) => {
      const { from, candidate } = data;
      const pc = peerConnections[from];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    socket.on("voice_user_stopped", (data) => {
      const { userId } = data;
      if (peerConnections[userId]) {
        peerConnections[userId].close();
        delete peerConnections[userId];
        console.log(`📡 Peer ${userId} stopped voice chat.`);
      }
    });
  }

  // Start initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVoiceChat);
  } else {
    initVoiceChat();
  }
})();
