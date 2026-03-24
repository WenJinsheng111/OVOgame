/* Boxing Random Sub-page JS */
(function () {
  "use strict";

  var overlay = document.getElementById("game-overlay");
  var gameContainer = document.getElementById("game-container");
  var defaultSrc = "https://games.crazygames.com/en_US/boxing-random/index.html?skipPrerollFirstSession=true&v=1.353";
  var iframeAllow = "autoplay; fullscreen; accelerometer; gyroscope; gamepad";

  function getGameFrame() {
    return document.getElementById("game-frame");
  }

  function loadGame() {
    var frame = getGameFrame();
    if (!frame) return;
    var src = frame.getAttribute("data-src") || defaultSrc;
    if (src && !frame.src) frame.src = src;
    if (overlay) overlay.classList.add("hidden");
  }

  var startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.addEventListener("click", loadGame);
    startBtn.addEventListener("touchend", function (e) { e.preventDefault(); loadGame(); });
  }

  /* Fullscreen */
  var fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", function () {
      var el = gameContainer || getGameFrame();
      if (!el) return;
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });
  }

  /* Game switching */
  var backBtn = document.getElementById("back-to-boxing");
  var gameTitle = document.getElementById("game-title");
  var gameCards = document.querySelectorAll(".game-card[data-game-src]");

  function replaceIframe(src) {
    var oldFrame = getGameFrame();
    if (oldFrame) oldFrame.remove();
    var f = document.createElement("iframe");
    f.id = "game-frame";
    f.src = src;
    f.title = "Game - Play Free Online";
    f.setAttribute("allow", iframeAllow);
    f.allowFullscreen = true;
    f.setAttribute("playsinline", "");
    f.scrolling = "no";
    gameContainer.appendChild(f);
  }

  gameCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      // Allow OvO card to navigate to homepage
      if (this.getAttribute("href") === "/") return;
      e.preventDefault();
      var src = this.getAttribute("data-game-src");
      var title = this.getAttribute("data-game-title");
      if (!src || !gameContainer) return;

      replaceIframe(src);
      if (overlay) overlay.classList.add("hidden");
      if (gameTitle) gameTitle.textContent = title + " - Play Free Online";
      if (backBtn) backBtn.classList.remove("hidden");
      gameCards.forEach(function (c) {
        c.classList.toggle("active", c.getAttribute("data-game-title") === title);
      });

      var gameSection = document.getElementById("play");
      if (gameSection) {
        var h = document.querySelector(".site-header");
        var top = gameSection.getBoundingClientRect().top + window.pageYOffset - (h ? h.offsetHeight : 60);
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      replaceIframe(defaultSrc);
      if (gameTitle) gameTitle.textContent = "Boxing Random - Play Free Unblocked Game Online";
      backBtn.classList.add("hidden");
      gameCards.forEach(function (c) { c.classList.remove("active"); });
    });
  }

  /* Smooth scroll */
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
})();
