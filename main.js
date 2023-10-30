  var gameData = {
    time: 0,
    timemodLevel: 1,
    temporalResets: 0,
    alpha: 0,
    beta: 0,
    taste: 0,
    progression: 0,
    activeTime: false,
    update: 1.4,
  }

  var sure = 0

  var gameDataDef = {
    time: 0,
    timemodLevel: 1,
    temporalResets: 0,
    alpha: 0,
    beta: 0,
    taste: 0,
    progression: 0,
    activeTime: false,
    update: 1.4,
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function StartGaining() {
    gameData.activeTime = true
    document.getElementById("beginGaining").style.display = "none"
  }

  function eatMeat() {
    if (gameData.alpha >= 0.1) {
      gameData.alpha -= 0.1
      gameData.taste += 0.5
      gameData.time += 500 * Math.sqrt(gameData.taste + 1)
    }
  }

  function gainTime() {
    if (gameData.activeTime == true) {
      gameData.time += (gameData.timemodLevel * (1 + gameData.temporalResets / 2)) / 20
    }
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
      document.getElementById("beginGaining").style.display = "initial"
      gameData.activeTime = false
    }
  }

  function buyAlpha() {
    if (gameData.temporalResets >= 8) {
      gameData.time = 0
      gameData.alpha += 0.5 * Math.sqrt(gameData.temporalResets - 7)
      gameData.temporalResets = 0
      gameData.timemodLevel = 1
      document.getElementById("beginGaining").style.display = "initial"
      gameData.activeTime = false
    }
  }

  function temporalReset() {
    if (gameData.time >= 150) {
      gameData.temporalResets += 0.05 * Math.sqrt(gameData.time - 149) + 0.95
      gameData.time = 0
      gameData.timemodLevel = 1
      document.getElementById("beginGaining").style.display = "initial"
      gameData.activeTime = false
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
    if (gameData.activeTime == false) {timepersec = 0}else {timepersec = format(gameData.timemodLevel * (1 + gameData.temporalResets / 2), "scientific")}
    document.getElementById("timeGained").innerHTML = format(gameData.time, "scientific") + " Time gained, current speed: " + timepersec + "/s" 
    document.getElementById("tempResetsGained").innerHTML = format(gameData.temporalResets, "scientific") + " Temporal Resets gained"
    document.getElementById("alphaGained").innerHTML = format(gameData.alpha, "scientific") + " α gained"
    document.getElementById("betaGained").innerHTML = format(gameData.beta, "scientific") + " β gained"
    document.getElementById("tasteGained").innerHTML = "You have " + format(gameData.taste, "scientific") + " taste of food"
  }, 50)

  var uiLoop = window.setInterval(function() {
    if(gameData.time >= 150) {TRgain = 0.05 * Math.sqrt(gameData.time - 149) + 0.95}else {TRgain = 0}
    if(gameData.temporalResets >= 8) {alphagain = 0.5 * Math.sqrt(gameData.temporalResets - 7)}else {alphagain = 0}
    if(gameData.alpha >= 3) {betagain = Math.sqrt(gameData.alpha - 2)}else {betagain = 0}
    document.getElementById("buyAlphaButton").innerHTML = "Reset Time, Time Modulator and Temporal Resets for " + format(alphagain, "scientific") + " α based on Temporal Resets (8 minimum)"
    document.getElementById("buyBetaButton").innerHTML = "Reset Time, Time Modulator, Temporal Resets and alpha for " + format(betagain, "scientific") + " β based on α (3 minimum)"
    document.getElementById("perClickUpgrade").innerHTML = "Currently Level " + format(gameData.timemodLevel, "scientific") + ", Cost: " + format(5 * 2 ** gameData.timemodLevel, "scientific") + " Time"
    document.getElementById("tempResetButton").innerHTML = "Get " + format(TRgain, "scientific") + " Temporal Resets, resets Time and Time Modulator and is based on Time (150 minimum)"
    document.getElementById("eatMeatButton").innerHTML = "Eat 1 piece of Meat to gain " + format(500 * Math.sqrt(gameData.taste + 1), "scientific") + " time and improve your taste by +0.5 for 0.1 α"
    if (gameData.temporalResets < 8) {
      document.getElementById("buyAlphaButton2").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("buyAlphaButton2").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.alpha < 3) {
      document.getElementById("buyBetaButton2").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("buyBetaButton2").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.time < 150) {
      document.getElementById("tempResetButton2").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("tempResetButton2").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.time < 5 * 2 ** gameData.timemodLevel) {
      document.getElementById("perClickUpgrade2").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("perClickUpgrade2").style.backgroundColor = "rgb(48, 48, 48)"
    }
    if (gameData.alpha < 0.1) {
      document.getElementById("eatMeatButton2").style.backgroundColor = "rgb(20, 20, 20)"
    }else {
      document.getElementById("eatMeatButton2").style.backgroundColor = "rgb(48, 48, 48)"
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
      document.getElementById("tempResetButton2").style.display = "none"
      document.getElementById("tempResetsGained").style.display = "none"
    }else {
      document.getElementById("tempResetButton2").style.display = "initial"
      document.getElementById("tempResetsGained").style.display = "block"
    }
    if (gameData.progression < 2) {
      document.getElementById("buyAlphaButton2").style.display = "none"
      document.getElementById("alphaGained").style.display = "none"
      document.getElementById("tasteGained").style.display = "none"
      document.getElementById("eatMeatButton2").style.display = "none"
    }else {
      document.getElementById("buyAlphaButton2").style.display = "initial"
      document.getElementById("alphaGained").style.display = "block"
      document.getElementById("tasteGained").style.display = "block"
      document.getElementById("eatMeatButton2").style.display = "initial"
    }
    if (gameData.progression < 3) {
      document.getElementById("buyBetaButton2").style.display = "none"
      document.getElementById("betaGained").style.display = "none"
    }else {
      document.getElementById("buyBetaButton2").style.display = "initial"
      document.getElementById("betaGained").style.display = "block"
    }
    if (gameData.activeTime == true) {
      document.getElementById("beginGaining").style.display = "none"
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
        if (typeof savegame.taste !== "undefined") gameData.taste = savegame.taste;
        if (typeof savegame.progression !== "undefined") gameData.progression = savegame.progression;
        if (typeof savegame.activeTime !== "undefined") gameData.activeTime = savegame.activeTime;
      }
    }
