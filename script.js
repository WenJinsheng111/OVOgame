/* OvO Unblocked - Main JS */
(function () {
  "use strict";

  var overlay = document.getElementById("game-overlay");
  var gameContainer = document.getElementById("game-container");
  var defaultOvoSrc = "https://dedragames.com/games/ovo/1.4.5/";
  var ovo2Src = "https://dedragames.com/games/ovo2/0.2alpha/";
  var iframeAllow = "autoplay; fullscreen; accelerometer; gyroscope; gamepad";
  var currentFallback = 0;

  function getGameFrame() {
    return document.getElementById("game-frame");
  }

  /* === Iframe Lazy Loader with Fallback Chain === */
  function loadGame() {
    var frame = getGameFrame();
    if (!frame) return;
    var src = frame.getAttribute("data-src") || defaultOvoSrc;
    if (src && !frame.src) {
      frame.src = src;
    }
    if (overlay) overlay.classList.add("hidden");
  }

  function tryNextSource() {
    var frame = getGameFrame();
    if (!frame) return;
    currentFallback++;
    var src = frame.getAttribute("data-fallback-" + currentFallback);
    if (src) {
      frame.src = src;
    } else {
      currentFallback = 0;
      frame.src = defaultOvoSrc;
    }
  }

  var startBtn = document.getElementById("start-game-btn");
  var fallbackBtn = document.getElementById("try-fallback-btn");

  if (startBtn) {
    startBtn.addEventListener("click", loadGame);
    startBtn.addEventListener("touchend", function (e) {
      e.preventDefault();
      loadGame();
    });
  }

  if (fallbackBtn) {
    fallbackBtn.addEventListener("click", tryNextSource);
  }

  /* === Game Tab Switcher (OvO / OvO 2) === */
  var currentGame = "ovo";
  var tabOvo = document.getElementById("tab-ovo");
  var tabOvo2 = document.getElementById("tab-ovo2");

  function switchOvoTab(game) {
    if (game === currentGame) return;
    currentGame = game;
    if (tabOvo) tabOvo.classList.toggle("active", game === "ovo");
    if (tabOvo2) tabOvo2.classList.toggle("active", game === "ovo2");

    var frame = getGameFrame();
    if (frame) {
      frame.src = game === "ovo2" ? ovo2Src : defaultOvoSrc;
    }
    if (overlay) overlay.classList.add("hidden");

    // Hide back button and clear active game cards
    var backBtn = document.getElementById("back-to-ovo");
    if (backBtn) backBtn.classList.add("hidden");
    var gameTitle = document.getElementById("game-title");
    if (gameTitle) gameTitle.textContent = "Play OvO Game Online Free";
    document.querySelectorAll(".game-card.active").forEach(function (c) { c.classList.remove("active"); });
  }

  if (tabOvo) tabOvo.addEventListener("click", function () { switchOvoTab("ovo"); });
  if (tabOvo2) tabOvo2.addEventListener("click", function () { switchOvoTab("ovo2"); });

  /* === Fullscreen Toggle === */
  var fullscreenBtn = document.getElementById("fullscreen-btn");

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", function () {
      var el = gameContainer || getGameFrame();
      if (!el) return;
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });
  }

  /* === Game Switching (Sidebar Games) === */
  var backBtn = document.getElementById("back-to-ovo");
  var gameTitle = document.getElementById("game-title");
  var gameCards = document.querySelectorAll(".game-card[data-game-src]");

  function replaceIframe(src) {
    var oldFrame = getGameFrame();
    if (oldFrame) oldFrame.remove();

    var newFrame = document.createElement("iframe");
    newFrame.id = "game-frame";
    newFrame.src = src;
    newFrame.title = "Game - Play Free Online";
    newFrame.setAttribute("allow", iframeAllow);
    newFrame.allowFullscreen = true;
    newFrame.setAttribute("playsinline", "");
    newFrame.scrolling = "no";
    gameContainer.appendChild(newFrame);
  }

  gameCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      var src = this.getAttribute("data-game-src");
      var title = this.getAttribute("data-game-title");
      if (!src || !gameContainer) return;

      replaceIframe(src);
      if (overlay) overlay.classList.add("hidden");
      if (gameTitle) gameTitle.textContent = title + " - Play Free Online";
      if (backBtn) backBtn.classList.remove("hidden");
      // Hide OvO tabs when playing other games
      if (tabOvo) tabOvo.classList.remove("active");
      if (tabOvo2) tabOvo2.classList.remove("active");

      gameCards.forEach(function (c) {
        c.classList.toggle("active", c.getAttribute("data-game-title") === title);
      });

      // Scroll to game
      var gameSection = document.getElementById("play");
      if (gameSection) {
        var headerH = document.querySelector(".site-header");
        var offset = headerH ? headerH.offsetHeight : 60;
        var top = gameSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      replaceIframe(currentGame === "ovo2" ? ovo2Src : defaultOvoSrc);
      if (gameTitle) gameTitle.textContent = "Play OvO Game Online Free";
      backBtn.classList.add("hidden");
      if (tabOvo) tabOvo.classList.toggle("active", currentGame === "ovo");
      if (tabOvo2) tabOvo2.classList.toggle("active", currentGame === "ovo2");
      gameCards.forEach(function (c) { c.classList.remove("active"); });
    });
  }

  /* === Star Rating Widget === */
  var STORAGE_KEY = "ovo_rating";
  var starsContainer = document.getElementById("rating-stars");
  var ratingValueEl = document.getElementById("rating-value");
  var ratingCountEl = document.getElementById("rating-count");
  var BASE_RATING = 4.7;
  var BASE_COUNT = 3856;

  function loadRating() {
    var saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  function saveRating(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: value, time: Date.now() }));
  }

  function updateStarsDisplay(rating) {
    if (!starsContainer) return;
    starsContainer.querySelectorAll(".star").forEach(function (star) {
      star.classList.toggle("selected", parseInt(star.getAttribute("data-value"), 10) <= rating);
    });
  }

  function updateRatingDisplay(userRating) {
    if (!ratingValueEl || !ratingCountEl) return;
    if (userRating) {
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
    if (saved) { updateStarsDisplay(saved.value); updateRatingDisplay(saved.value); }

    starsContainer.querySelectorAll(".star").forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        var val = parseInt(this.getAttribute("data-value"), 10);
        starsContainer.querySelectorAll(".star").forEach(function (s) {
          s.classList.toggle("active", parseInt(s.getAttribute("data-value"), 10) <= val);
        });
      });
      star.addEventListener("mouseleave", function () {
        starsContainer.querySelectorAll(".star").forEach(function (s) { s.classList.remove("active"); });
      });
      star.addEventListener("click", function () {
        var val = parseInt(this.getAttribute("data-value"), 10);
        saveRating(val); updateStarsDisplay(val); updateRatingDisplay(val);
      });
    });
  }

  /* === Prevent Arrow Keys from Scrolling === */
  document.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(e.key) > -1) {
      e.preventDefault();
    }
  });

  /* === Smooth Scroll for Anchor Links === */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    if (anchor.hasAttribute("data-game-src")) return;
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
