/* OvO Unblocked - Minimal JS (~4KB) */
(function () {
  "use strict";

  /* === Iframe Lazy Loader with Fallback Chain === */
  const gameFrame = document.getElementById("game-frame");
  const overlay = document.getElementById("game-overlay");
  const startBtn = document.getElementById("start-game-btn");
  const fallbackBtn = document.getElementById("try-fallback-btn");
  let currentFallback = 0;

  function loadGame() {
    if (!gameFrame) return;
    const src = gameFrame.getAttribute("data-src");
    if (src && gameFrame.src !== src) {
      gameFrame.src = src;
    }
    if (overlay) overlay.classList.add("hidden");
  }

  function tryNextSource() {
    currentFallback++;
    const key = "data-fallback-" + currentFallback;
    const src = gameFrame.getAttribute(key);
    if (src) {
      gameFrame.src = src;
    } else {
      currentFallback = 0;
      loadGame(); // loop back to primary
    }
  }

  if (startBtn) {
    startBtn.addEventListener("click", loadGame);
  }

  if (fallbackBtn) {
    fallbackBtn.addEventListener("click", function () {
      tryNextSource();
    });
  }

  /* === Game Tab Switcher (OvO / OvO 2) === */
  var currentGame = "ovo";
  var tabOvo = document.getElementById("tab-ovo");
  var tabOvo2 = document.getElementById("tab-ovo2");
  var overlayBtn = document.getElementById("start-game-btn");

  function switchGame(game) {
    if (game === currentGame) return;
    currentGame = game;

    // Update tab styles
    if (tabOvo) tabOvo.classList.toggle("active", game === "ovo");
    if (tabOvo2) tabOvo2.classList.toggle("active", game === "ovo2");

    // Update iframe source
    if (gameFrame) {
      if (game === "ovo2") {
        gameFrame.src = gameFrame.getAttribute("data-ovo2-src");
      } else {
        gameFrame.src = gameFrame.getAttribute("data-src");
      }
    }

    // Hide overlay if visible
    if (overlay) overlay.classList.add("hidden");

    // Update overlay button text
    if (overlayBtn) {
      var label = overlayBtn.querySelector("span:last-child");
      if (label) label.textContent = game === "ovo2" ? "Click to Play OvO 2" : "Click to Play OvO";
    }
  }

  if (tabOvo) tabOvo.addEventListener("click", function () { switchGame("ovo"); });
  if (tabOvo2) tabOvo2.addEventListener("click", function () { switchGame("ovo2"); });

  /* === Fullscreen Toggle === */
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const gameContainer = document.getElementById("game-container");

  if (fullscreenBtn && gameContainer) {
    fullscreenBtn.addEventListener("click", function () {
      if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
          gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
          gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
          gameContainer.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });
  }

  /* === Star Rating Widget === */
  const STORAGE_KEY = "ovo_rating";
  const starsContainer = document.getElementById("rating-stars");
  const ratingValueEl = document.getElementById("rating-value");
  const ratingCountEl = document.getElementById("rating-count");

  // Base values
  const BASE_RATING = 4.7;
  const BASE_COUNT = 3856;

  function loadRating() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  function saveRating(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: value, time: Date.now() }));
  }

  function updateStarsDisplay(rating) {
    if (!starsContainer) return;
    const stars = starsContainer.querySelectorAll(".star");
    stars.forEach(function (star) {
      const val = parseInt(star.getAttribute("data-value"), 10);
      star.classList.toggle("selected", val <= rating);
    });
  }

  function updateRatingDisplay(userRating) {
    if (!ratingValueEl || !ratingCountEl) return;
    if (userRating) {
      // Blend user rating into display
      var count = BASE_COUNT + 1;
      var avg = ((BASE_RATING * BASE_COUNT + userRating) / count).toFixed(1);
      ratingValueEl.textContent = avg;
      ratingCountEl.textContent = count.toLocaleString();
    } else {
      ratingValueEl.textContent = BASE_RATING.toFixed(1);
      ratingCountEl.textContent = BASE_COUNT.toLocaleString();
    }
  }

  if (starsContainer) {
    var saved = loadRating();
    if (saved) {
      updateStarsDisplay(saved.value);
      updateRatingDisplay(saved.value);
    }

    // Hover effect
    var stars = starsContainer.querySelectorAll(".star");
    stars.forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        var val = parseInt(this.getAttribute("data-value"), 10);
        stars.forEach(function (s) {
          s.classList.toggle("active", parseInt(s.getAttribute("data-value"), 10) <= val);
        });
      });

      star.addEventListener("mouseleave", function () {
        stars.forEach(function (s) {
          s.classList.remove("active");
        });
      });

      star.addEventListener("click", function () {
        var val = parseInt(this.getAttribute("data-value"), 10);
        saveRating(val);
        updateStarsDisplay(val);
        updateRatingDisplay(val);
      });
    });
  }

  /* === Smooth Scroll for Anchor Links === */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* === Auto-load game if URL has #play hash === */
  if (window.location.hash === "#play") {
    setTimeout(loadGame, 500);
  }
})();
