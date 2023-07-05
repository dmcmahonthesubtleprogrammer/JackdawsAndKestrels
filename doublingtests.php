<!DOCTYPE html>
<html>
  <head>
    <style>
      input[type="text"] {
  font-size: 16px;
  color: #333;
  padding: 8px;
  margin: 4px 0;
  border: 2px solid #ccc;
  border-radius: 4px;
  box-shadow: none;
  transition: all 0.3s ease-in-out;
}

input[type="text"]:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 5px #66afe9;
}
#playerName {
  display: none;
}
#submitScore {
  display: none;
}
#gameOverText {
  display: none;
  font-size: 20px;
}
#backButton {
  display: none;
  border: 10px solid #ddd;
  padding-right: 50px;
  padding-left: 50px;
  margin: 50px;
  background-color: grey;
  font-size: 75px;
}
    </style>
  </head>
  <body>
    <div id="game"></div>
    <script src="../Jackdaws and Kestrels/doublingtests.js" defer></script>
    <script type="text/javascript" src="https://rawgithub.com/craftyjs/Crafty/release/dist/crafty-min.js"></script>
    <script>
      Crafty.init(0,1, document.getElementById('game'));
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <p id="beginText">Press enter to start!</p>
    <p id="continueText">Press enter to go to the next level!</p>
    <p id="gameOverText">Enter your name here: </p>
    <input id="playerName" type="text" ></input>
    <input id="submitScore" type="submit"></input>
    <div id="scoreBoardDiv">
      <ul id="scoreBoard"></ul>
    </div>
    <a id="backButton">Back</a>
  </body>
</html>