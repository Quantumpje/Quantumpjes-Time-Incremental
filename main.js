  var gameData = {
    time: 0,
    timemodLevel: 1,
    temporalResets: 0,
    alpha: 0,
    beta: 0,
    progression: 0,
    update: 1.2,
  }

  var sure = 0

  var gameDataDef = {
    time: 0,
    timemodLevel: 1,
    temporalResets: 0,
    alpha: 0,
    beta: 0,
    progression: 0,
    update: 1.2,
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function gainTime() {
    gameData.time += (gameData.timemodLevel * (1 + gameData.temporalResets / 2)) / 20
  }
  
  function buyTimePerClick() {
    if (gameData.time >= 5 * 2 ** gameData.timemodLevel) {
      gameData.time -= 5 * 2 ** gameData.timemodLevel
      gameData.timemodLevel += 1
    }
  }

  function buyBeta() {
    if (gameData.alpha >= 3) {
      gameData.beta = Math.sqrt(gameData.alpha - 2)
      gameData.alpha = 0
      gameData.temporalResets = 0
      gameData.timemodLevel = 1
      gameData.time = 0
    }
  }

  function buyAlpha() {
    if (gameData.temporalResets >= 8) {
      gameData.time = 0
      gameData.alpha += 0.5 * Math.sqrt(gameData.temporalResets - 7)
      gameData.temporalResets = 0
      gameData.timemodLevel = 1
    }
  }

  function temporalReset() {
    if (gameData.time >= 150 * 1.65 ** gameData.temporalResets) {
      gameData.time = 0
      gameData.timemodLevel = 1
      gameData.temporalResets += 1 + gameData.alpha
    }
  }

  function DeleteSave() {
    if (sure >= 50) {
      localStorage.setItem("TimeIncrementalSave", JSON.stringify(gameDataDef))
      location.reload()
      document.getElementById("DeleteSaveButton").innerHTML = "Delete Save"
      sure = 0
    } else {
      sure += 1
      document.getElementById("DeleteSaveButton").innerHTML = "Click " + (51 - sure) + " more times to delete save."
    }
  }

  function format(number, type) {
    let exponent = Math.floor(Math.log10(number))
    let mantissa = number / Math.pow(10, exponent)
    if (exponent < 3) return number.toFixed(1)
    if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
    if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
  }

  var mainGameLoop = window.setInterval(function() {
    gainTime()
    document.getElementById("timeGained").innerHTML = format(gameData.time, "scientific") + " Time gained, current speed: " + format(gameData.timemodLevel * (1 + gameData.temporalResets / 2), "scientific") + "/s" 
    document.getElementById("tempResetsGained").innerHTML = format(gameData.temporalResets, "scientific") + " Temporal Resets gained"
    document.getElementById("alphaGained").innerHTML = format(gameData.alpha, "scientific") + " α gained"
    document.getElementById("betaGained").innerHTML = format(gameData.beta, "scientific") + " β gained"
  }, 50)

  var uiLoop = window.setInterval(function() {
    if(gameData.temporalResets >= 8) {alphagain = 0.5 * Math.sqrt(gameData.temporalResets - 7)}else {alphagain = 0}
    if(gameData.alpha >= 3) {betagain = Math.sqrt(gameData.alpha - 2)}else {betagain = 0}
    document.getElementById("buyAlphaButton").innerHTML = "Reset Time, Time Modulator and Temporal Resets for " + format(alphagain, "scientific") + " α, Cost: " + format(gameData.temporalResets, "scientific") + " Temporal Resets(8 minimum)"
    document.getElementById("buyBetaButton").innerHTML = "Reset Time, Time Modulator, Temporal Resets and alpha for " + format(betagain, "scientific") + " β, Cost: " + format(gameData.alpha, "scientific") + " α(3 minimum)"
    document.getElementById("perClickUpgrade").innerHTML = "Upgrade Time Modulator (Currently Level " + format(gameData.timemodLevel, "scientific") + "), Cost: " + format(5 * 2 ** gameData.timemodLevel, "scientific") + " Time"
    document.getElementById("tempResetButton").innerHTML = "Initiate Temporal Reset, Cost: " + format((150 * 1.65 ** gameData.temporalResets), "scientific") + " Time and resets Time and Time Modulator"
    if (gameData.temporalResets < 8) {
      document.getElementById("buyAlphaButton").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("buyAlphaButton").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.alpha < 3) {
      document.getElementById("buyBetaButton").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("buyBetaButton").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.time < 150 * 1.25 ** gameData.temporalResets) {
      document.getElementById("tempResetButton").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("tempResetButton").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.time < 5 * 2 ** gameData.timemodLevel) {
      document.getElementById("perClickUpgrade").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("perClickUpgrade").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.time >= 150) {
      if (gameData.progression < 1) {
        gameData.progression = 1
      }
    }
    if (gameData.temporalResets >= 8) {
      if (gameData.progression < 2) {
        gameData.progression = 2
      }
    }
    if (gameData.alpha >= 3) {
      if (gameData.progression < 3) {
        gameData.progression = 3
      }
    }
    if (gameData.progression < 1) {
      document.getElementById("tempResetButton").style.display = "none"
      document.getElementById("tempResetsGained").style.display = "none"
    }else {
      document.getElementById("tempResetButton").style.display = "initial"
      document.getElementById("tempResetsGained").style.display = "block"
    }
    if (gameData.progression < 2) {
      document.getElementById("buyAlphaButton").style.display = "none"
      document.getElementById("alphaGained").style.display = "none"
    }else {
      document.getElementById("buyAlphaButton").style.display = "initial"
      document.getElementById("alphaGained").style.display = "block"
    }
    if (gameData.progression < 3) {
      document.getElementById("buyBetaButton").style.display = "none"
      document.getElementById("betaGained").style.display = "none"
    }else {
      document.getElementById("buyBetaButton").style.display = "initial"
      document.getElementById("betaGained").style.display = "block"
    }
  }, 200)

  var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("TimeIncrementalSave", JSON.stringify(gameData))
  }, 15000)

  var savegame = JSON.parse(localStorage.getItem("TimeIncrementalSave"))
    if (savegame !== null) {
      if (gameData.update == savegame.update) {
        gameData = savegame
      } else {
        if (typeof savegame.time !== "undefined") gameData.time = savegame.time;
        if (typeof savegame.timemodAmount !== "undefined") gameData.timemodLevel = savegame.timePerClick;
        if (typeof savegame.temporalResets !== "undefined") gameData.temporalResets = savegame.temporalResets;
        if (typeof savegame.alpha !== "undefined") gameData.alpha = savegame.alpha;
        if (typeof savegame.beta !== "undefined") gameData.beta = savegame.beta;
        if (typeof savegame.progression !== "undefined") gameData.progression = savegame.progression;
      }
    }