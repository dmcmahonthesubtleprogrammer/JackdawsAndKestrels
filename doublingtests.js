let playerName = "";
let highScorePosted = false;

Crafty.init();
  class Player {
    width = 50;
    height = 50;
    color = "black";
    playerName = "";
    xposition = 0;
    yposition = 0;
    safex = 0;
    safey = 0;
    score = 0;
    speed = 0;
    graphic = null;
    constructor(playerName,xposition,yposition,speed) {
         this.playerName = playerName;
         this.xposition = xposition;
         this.yposition = yposition;
         this.safex = xposition;
         this.safey = yposition;
         this.speed = speed;
         this.graphic = Crafty.e("2D, Canvas, Color, Fourway")
         .attr({x:this.xposition, y:this.yposition, w:this.width, h:this.height, z:1})
         .color(this.color)
         //.image(Crafty.assets.images[0]).origin("center")
         .fourway(3);
    }
  }
  class Tree {
        width = 100;
        height = 100;
        color = "sienna";
        entityName = "Tree";
        xposition = 0;
        yposition = 0;
        graphic = null;
        treeStates = {
            alive: true,
            thinks: false,
            idle: false,
            wandering: false,
            chasing: false,
            returning: false,
            preChase: false,
        }
        speed = 0;
        maxSpeed = 0;
        sight = 0;
        idleTime = 0;
        wanderTime = 0;
        wanderPoint = [];
        chaseTarget = null;
        actionTicks = 0;
        homex = 0;
        homey = 0;
        constructor(entityName, xposition, yposition) {
            this.entityName = entityName;
            this.xposition = xposition;
            this.yposition = yposition;
            this.graphic = Crafty.e("2D, Canvas, Color, Fourway").attr({x:this.xposition, y:this.yposition, w:this.width, h:this.height}).color(this.color).fourway(3);
            switch(entityName)
            {
                case "Egg":
                    this.graphic.color("white");
                    this.graphic.attr({w:50,h:50,z:1});
                    //this.graphic.image(Crafty.assets.images[1]).origin("center");
                    break;
                case "Tree":
                    //this.graphic.image(Crafty.assets.images[6]).origin("center");
                    break;
                case "Kestrel":
                    this.treeStates.thinks = true;
                    this.treeStates.idle = true;
                    this.maxSpeed = 0.7;
                    this.sight = 500;
                    this.idleTime = 500;
                    this.wanderTime = 1500;
                    this.graphic.color("chocolate");
                    this.graphic.attr({w:50,h:50,z:1});
                    //this.graphic.image(Crafty.assets.images[2]).origin("center");
                    break;
                case "Bluejay":
                    this.treeStates.thinks = true;
                    this.treeStates.idle = true;
                    this.maxSpeed = 0.5;
                    this.sight = 700;
                    this.idleTime = 200;
                    this.wanderTime = 2000;
                    this.graphic.color("blue");
                    this.graphic.attr({w:50,h:50,z:1});
                    //this.graphic.image(Crafty.assets.images[3]).origin("center");
                        break;
                case "Nest":
                    this.graphic.color("darkgoldenrod");
                    //this.graphic.image(Crafty.assets.images[4]).origin("center");
                    break;
                case "Red-Tailed Hawk":
                    this.treeStates.thinks = true;
                    this.treeStates.idle = true;
                    this.maxSpeed = 5;
                    this.idleTime = 500 + Math.floor((Math.random() * 35) * 100);
                    this.graphic.color("brown");
                    this.graphic.attr({w:50,h:50,z:1});
                    this.homex = this.graphic.x;
                    this.homey = this.graphic.y;
                    //this.graphic.image(Crafty.assets.images[5]).origin("center");
                    break;
            }
        }
  }
    const wintheme = new Audio('skytheme.mp3'); 
    const winsound = new Audio('wind.mp3'); 
    const call = new Audio('Redtailhawkprechase.mp3'); 
    const screech = new Audio('redtailscreech.mp3'); 
    const gameover = new Audio('kestrelswin.mp3'); 
    const bluejay = new Audio('bluejay.mp3'); 
    let levelDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 200, w: 500 }).text("Level ").textFont({ size: '20px', weight: 'bold' });
    let eggDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 400, w: 500 }).text("Eggs").textFont({ size: '20px', weight: 'bold' });
    let levelScoreDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 600, w: 500 }).text("Level Score").textFont({ size: '20px', weight: 'bold' });
    let totalScoreDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 800, w: 500 }).text("Total Score").textFont({ size: '20px', weight: 'bold' });
    let timeDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 1000, w: 500 }).text("Time").textFont({ size: '20px', weight: 'bold' });
    let lifeDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 1200, w: 500 }).text("Lives").textFont({ size: '20px', weight: 'bold' });
    let ticks = 0;
    let time = 0;
    let lives = 3;
    let level = 1;
    let treeNum = 1;
    let eggNum = 1;
    let kestrelNum = 1;
    let nestNum = 1;
    let hawkNum = 0;
    let bluejayNum = 0;
    let players = [];
    const nest = [];
    let safex = 0;
    let safey = 0;
    let trees = [];
    let required = 0;
    let eggScore = ((10 * kestrelNum) * hawkNum) - (nestNum-1);
    let levelScore = 0;
    let totalScore = 0;
    let score = 0;
    document.body.style.backgroundColor = "chartreuse";
    const overlapCheck = (x,y,array,adjustment=0) => 
    {
        return array.find((value,index,obj) => {
            if(x < value.graphic.x + value.graphic.w + adjustment && 
            x + 50 > value.graphic.x - adjustment &&
            y < value.graphic.y + value.graphic.h + adjustment &&
            50 + y > value.graphic.y - adjustment) {
                return true;
            }
            return false;});
    }
    const spawnTrees = (name,amount) => {
        if(name==="Tree")
        {
            for(let i = 0; i < amount; i++)
            {
                trees.push(new Tree(name,Math.random() * 2000,Math.random() * 1350));
            }
        }else{
            for(let i = 0; i < amount; i++)
            {
                let x = Math.random() * 2000;
                let y = Math.random() * 1350;
                if(name!=="Red-Tailed Hawk")
                {
                    while(
                        overlapCheck(x,y,trees)
                    )
                    {
                        x = Math.random() * 2000;
                        y = Math.random() * 1350;
                    }
                }else{
                    x = Math.random() * 2000;
                    y = Math.random() * 1350;
                }
                trees.push(new Tree(name,x,y));
                if(name==="Egg")
                {
                    required++;
                }
            }
        }
    }
    const collisionEntity = () => {
        return trees.find((value,index,obj) => {
            if (
                (player.graphic.x < value.graphic.x + value.graphic.w && 
                player.graphic.x + player.graphic.w > value.graphic.x &&
                player.graphic.y < value.graphic.y + value.graphic.h &&
                player.graphic.h + player.graphic.y > value.graphic.y) && (!states.highFlying))
               {
                // Collision detected!
                return true;
              }else if(
                (player.graphic.x < value.graphic.x + value.graphic.w && 
                    player.graphic.x + player.graphic.w > value.graphic.x &&
                    player.graphic.y < value.graphic.y + value.graphic.h &&
                    player.graphic.h + player.graphic.y > value.graphic.y) && (states.highFlying && value.entityName==="Kestrel")
              ){
                return true;
              }else{
                return false
              }
        });
    }
    const playerReactToCollison = (playerEntity) => 
    {
            if(collisionDirections.up)
            {
                playerEntity.graphic.y = playerEntity.graphic.y + 1;
            }
            if(collisionDirections.down)
            {
                playerEntity.graphic.y = playerEntity.graphic.y - 1;
            }
            if(collisionDirections.left)
            {
                playerEntity.graphic.x = playerEntity.graphic.x + 1;
            }
            if(collisionDirections.right)
            {
                playerEntity.graphic.x = playerEntity.graphic.x - 1;
            }
            if((collisionDirections.up && collisionDirections.down && collisionDirections.left && collisionDirections.right) && collisionEntity().entityName === "Tree")
            {
                playerEntity.graphic.x = safex;
                playerEntity.graphic.y = safey;
            }
    }
    const findTreeIndex = (entity) => {
        return trees.findIndex((value,index,obj) => {
            if(entity===value)
            {
                return true
            }
            return false;
        });
    }
    const spawnPlayer = () => {
        let spawnx = Math.random() * 2000;
        let spawny = Math.random() * 1350;
        while(
            overlapCheck(spawnx,spawny,trees,50)
        )
        {
            spawnx = Math.random() * 2000;
            spawny = Math.random() * 1350;
        }
        players.push(new Player("Jackdaw",spawnx,spawny,5));
    }
    spawnTrees("Tree",treeNum);
    spawnTrees("Egg",eggNum);
    spawnTrees("Kestrel",kestrelNum);
    spawnTrees("Nest",nestNum);
    spawnTrees("Red-Tailed Hawk",hawkNum);
    spawnTrees("Bluejay",bluejayNum);
    spawnPlayer();
    let player = players.find((value,index,obj) => {
        return value.playerName === "Jackdaw";
    });
        const keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            enter: false,
            space: false,
          };
        const collisionDirections = {
            up: false,
            down: false,
            left: false,
            right: false,
        };
          const states = {
            initialized: false,
            started: false,
            highFlyingReady: true,
            highFlying: false,
            cooldown: false,
            won: false,
            lost: false,
            protected: false,
            spawnProtection: true,
          };
          document.addEventListener(
            "keydown",
            (event) => {
              let name = event.key;
              if (name.toLowerCase() === "w") {
                keys.up = true;
              }
              if (name.toLowerCase() === "s") {
                keys.down = true;
              }
              if (name.toLowerCase() === "a") {
                keys.left = true;
              }
              if (name.toLowerCase() === "d") {
                keys.right = true;
              }
              if (name.toLowerCase() === "enter") {
                keys.enter = true;
              }
              if (event.code.toLowerCase() === "space") {
                keys.space = true;
              }
            },
            false
          );
          
          document.addEventListener(
            "keyup",
            (event) => {
              let name = event.key;
              if (name.toLowerCase() === "w") {
                keys.up = false;
              }
              if (name.toLowerCase() === "s") {
                keys.down = false;
              }
              if (name.toLowerCase() === "a") {
                keys.left = false;
              }
              if (name.toLowerCase() === "d") {
                keys.right = false;
              }
              if (name.toLowerCase() === "enter") {
                keys.enter = false;
              }
              if (event.code.toLowerCase() === "space") {
                keys.space = false;
              }
            },
            false
          );
          let music = new Audio('bgm1.mp3'); 
          let collide = false;
          let repositionTicks = 0;
          let highFlyingTicks = 0;
          let abilityCooldownTicks = 0;
          let spawnTicks = 0;
          let protectionTime = 600;
          /*
            let levelDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 200, w: 500 }).text("Level ").textFont({ size: '20px', weight: 'bold' });
    let eggDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 400, w: 500 }).text("Eggs").textFont({ size: '20px', weight: 'bold' });
    let totalScoreDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 600, w: 500 }).text("Score").textFont({ size: '20px', weight: 'bold' });
    let timeDisplay = Crafty.e("2D, DOM, Text").attr({ x: 2000, y: 600, w: 500 }).text("Score").textFont({ size: '20px', weight: 'bold' });
          */
setInterval(() => {
    eggScore = ((10 * kestrelNum) + (20 * hawkNum) - (nestNum-1));
    if (states.started) {
        if(states.protected)
        {
            player.graphic.color("aqua");
        }else{
            player.graphic.color("black");
        }
        ticks++;
        if(states.spawnProtection)
        {
            states.protected = true;
            spawnTicks++;
        }
        if(states.spawnProtection)
        {
        if(spawnTicks>=protectionTime)
        {
            states.protected = false;
            states.spawnProtection = false;
        }else{
            states.protected = true;
        }}
        if(ticks>=200)
        {
            ticks=0;
            time++;
            timeDisplay.text("Time: " + time).textFont({ size: '20px', weight: 'bold' });
        }
        repositionTicks++;

        if(repositionTicks>=50)
        {
            if(!collisionEntity() && !states.highFlying)
            {
                safex = player.graphic.x;
                safey = player.graphic.y;
            }
            repositionTicks = 0;
        }

        if(states.cooldown)
        {
            if(abilityCooldownTicks<1500)
            {
                abilityCooldownTicks++;
            }else{
                states.cooldown = false;
                states.highFlyingReady = true;
                abilityCooldownTicks = 0;
            }
        }

        if(collisionEntity())
        {
            if(collisionEntity().entityName !== "Nest")
            {
            if(player.graphic.y + player.graphic.h > collisionEntity().graphic.y + collisionEntity().graphic.h)
            {
                collisionDirections.up = true;
            }
            if(player.graphic.y < collisionEntity().graphic.y)
            {
                collisionDirections.down = true;
            }
            if(player.graphic.x + player.graphic.w > collisionEntity().graphic.x + collisionEntity().graphic.w)
            {
                collisionDirections.left = true;
            }
            if(player.graphic.x < collisionEntity().graphic.x)
            {
                collisionDirections.right = true;
            }
            if(collisionEntity().entityName === "Egg")
            {
                score++;
                eggDisplay.text("Eggs: " + score + "/" + required).textFont({ size: '20px', weight: 'bold' });
                levelScore = levelScore + eggScore;
                levelScoreDisplay.text("Level Score: " + levelScore).textFont({ size: '20px', weight: 'bold' });
                const index = findTreeIndex(collisionEntity());
                trees[index].graphic.destroy();
                trees[index] = new Tree("Null",-1000,-1000);
                const collected = new Audio('eggCrack.mp3'); 
                collected.play();
            }
            if(collisionEntity().entityName === "Kestrel")
            {
                if(!states.protected)
                {
                states.lost = true;
                trees.forEach((value,index,array) => {
                    value.graphic.destroy();
                });
                trees = [];
                player.graphic.destroy();
                document.body.style.backgroundImage = `url("../Jackdaws and Kestrels/jackdawfail.jpg")`;
                document.body.style.backgroundRepeat = `no-repeat`;
                document.body.style.backgroundSize = `100%`;
                music.pause();
                music.currentTime = 0;
                lives--;
                lifeDisplay.text("Lives").textFont({ size: '20px', weight: 'bold' });
                const deathSound = new Audio('jackdawDeath.mp3'); 
                deathSound.play();
                }
            }
            if(collisionEntity().entityName === "Bluejay")
            {
                if(!states.protected)
                {
                states.lost = true;
                trees.forEach((value,index,array) => {
                    value.graphic.destroy();
                });
                trees = [];
                player.graphic.destroy();
                document.body.style.backgroundImage = `url("../Jackdaws and Kestrels/jackdawfail.jpg")`;
                document.body.style.backgroundRepeat = `no-repeat`;
                document.body.style.backgroundSize = `100%`;
                music.pause();
                music.currentTime = 0;
                lives--;
                lifeDisplay.text("Lives").textFont({ size: '20px', weight: 'bold' });
                const deathSound = new Audio('jackdawDeath.mp3'); 
                deathSound.play();
                }
            }
            if(collisionEntity().entityName === "Red-Tailed Hawk")
            {
                if(!states.protected)
                {
                states.lost = true;
                trees.forEach((value,index,array) => {
                    value.graphic.destroy();
                });
                trees = [];
                player.graphic.destroy();
                document.body.style.backgroundImage = `url("../Jackdaws and Kestrels/jackdawfail.jpg")`;
                document.body.style.backgroundRepeat = `no-repeat`;
                document.body.style.backgroundSize = `100%`;
                music.pause();
                music.currentTime = 0;
                lives--;
                lifeDisplay.text("Lives").textFont({ size: '20px', weight: 'bold' });
                const deathSound = new Audio('jackdawDeath.mp3'); 
                deathSound.play();
                }
            }
        }
        if(collisionEntity().entityName === "Nest")
            {
                states.protected = true;
                trees.forEach((value,index,array) => {
                    if(value.entityName!=="Red-Tailed Hawk")
                    {
                        value.treeStates.chasing = false;
                    }
                    value.treeStates.wandering = true;
                });
            }
        }else{
            collisionDirections.up = false;
            collisionDirections.down = false;
            collisionDirections.left = false;
            collisionDirections.right = false;
            states.protected = false;
        }

        if(score===required)
        {
            trees.forEach((value,index,array) => {
                value.graphic.destroy();
            });
            trees = [];
            document.body.style.backgroundImage = `url("../Jackdaws and Kestrels/air.png")`;
            document.body.style.backgroundRepeat = `no-repeat`;
            document.body.style.backgroundSize = `100%`;
            music.pause();
            music.currentTime = 0;
            levelScore = levelScore - time;
            if(levelScore < 0)
            {
                levelScore = 0;
            }
            totalScore = totalScore + levelScore;
            totalScoreDisplay.text("Total Score: " + totalScore).textFont({ size: '20px', weight: 'bold' });
            if(!states.won)
            {

                winsound.play();
                wintheme.loop = true;
                wintheme.play();
            }
            else{

            }
            states.won = true;
        }
      if (keys.up) {
        if (player.graphic.y > 0 && !(collisionEntity() && collisionDirections.up)) {
            player.graphic.y-=1;
        }else if(collisionEntity())
        {
            playerReactToCollison(player);
        }
      }
      if (keys.down) {
        if (player.graphic.y < 1350 && !(collisionEntity() && collisionDirections.down)) {
            player.graphic.y+=1;
        }else if(collisionEntity())
        {
            playerReactToCollison(player);
        }
      }
      if (keys.left) {
        if (player.graphic.x > 0 && !(collisionEntity() && collisionDirections.left)) {
            player.graphic.x-=1;
        }else if(collisionEntity())
        {
            playerReactToCollison(player);
        }
      }
      if (keys.right) {
        if (player.graphic.x < 2000 && !(collisionEntity() && collisionDirections.right)) {
            player.graphic.x+=1;
        }else if(collisionEntity())
        {
            playerReactToCollison(player);
        }
      }
      if(keys.space)
      {
        if(states.highFlyingReady)
        {
            states.highFlyingReady = false;
            states.highFlying = true;
            player.graphic.attr({alpha:0.5,z:2});
        }
      }
      if(states.highFlying)
      {
        if(highFlyingTicks<500)
        {
            highFlyingTicks++;
        }else{
            states.highFlying = false;
            player.graphic.attr({alpha:1.0});
            states.cooldown = true;
            highFlyingTicks = 0;
        }
      }
      else{
        player.graphic.attr({alpha:1.0});
      }
      trees.forEach((value,index,array) => {
        if(value.entityName === "Kestrel")
        {
            let threatenedEgg = trees.find((value, index, obj) => {
                if(value.entityName === "Egg" && (Math.abs(value.graphic.x+(value.graphic.w/2) - player.graphic.x+(player.graphic.w/2)) < 500 && Math.abs(value.graphic.y+(value.graphic.h/2) - player.graphic.y+(player.graphic.h/2)) < 500))
                {
                    return true;
                }
                return false;
            });
            if(!states.protected)
            {
            if(threatenedEgg)
            {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < 500 && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < 500))
                {
                    value.treeStates.idle = false;
                    value.treeStates.wandering = false;
                    value.chaseTarget = player;
                    value.speed = value.maxSpeed;
                    value.treeStates.chasing = true;
                    value.actionTicks = 0;
                }
            }
            }
            if(value.treeStates.idle)
            {
                if(value.actionTicks < value.idleTime)
                {
                    value.actionTicks++;
                }else{
                    value.treeStates.idle = false;
                    value.treeStates.wandering = true;
                    value.wanderPoint = [Math.random() * 2000, Math.random() * 1350];
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                }
            }else if(value.treeStates.wandering)
            {
                if(value.actionTicks < value.wanderTime)
                {
                    if(value.graphic.x > value.wanderPoint[0])
                    {
                        value.graphic.x = value.graphic.x - value.speed;
                    }
                    if(value.graphic.x < value.wanderPoint[0])
                    {
                        value.graphic.x = value.graphic.x + value.speed;
                    }
                    if(value.graphic.y > value.wanderPoint[1])
                    {
                        value.graphic.y = value.graphic.y - value.speed;
                    }
                    if(value.graphic.y < value.wanderPoint[1])
                    {
                        value.graphic.y  = value.graphic.y + value.speed;
                    }
                    value.actionTicks++;
                }else{
                    value.treeStates.wandering = false;
                    value.treeStates.idle = true;
                    value.wanderPoint = [];
                    value.speed = 0;
                    value.actionTicks = 0;
                }
            }else if(value.treeStates.chasing)
            {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < 500 && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < 500))
                {
                    if(value.graphic.x < player.graphic.x)
                    {
                        value.graphic.x = value.graphic.x + value.speed;
                    }
                    if(value.graphic.x > player.graphic.x)
                    {
                        value.graphic.x = value.graphic.x - value.speed;
                    }
                    if(value.graphic.y < player.graphic.y)
                    {
                        value.graphic.y  = value.graphic.y + value.speed;
                    }
                    if(value.graphic.y > player.graphic.y)
                    {
                        value.graphic.y = value.graphic.y - value.speed;
                    }
                }else{
                    value.treeStates.chasing = false;
                    value.treeStates.wandering = true;
                    value.wanderPoint = [Math.random() * 2000, Math.random() * 1350];
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                }
            }
        }
        if(value.entityName === "Red Wing")
        {
            if(!states.protected)
            {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < 500 && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < 500))
                {
                    value.treeStates.idle = false;
                    value.treeStates.wandering = false;
                    value.chaseTarget = player;
                    value.speed = value.maxSpeed;
                    value.treeStates.chasing = true;
                    value.actionTicks = 0;
                }
            }
            if(value.treeStates.idle)
            {
                if(value.actionTicks < value.idleTime)
                {
                    value.actionTicks++;
                }else{
                    value.treeStates.idle = false;
                    value.treeStates.wandering = true;
                    value.wanderPoint = [Math.random() * 2000, Math.random() * 1350];
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                }
            }else if(value.treeStates.wandering)
            {
                if(value.actionTicks < value.wanderTime)
                {
                    if(value.graphic.x > value.wanderPoint[0])
                    {
                        value.graphic.x = value.graphic.x - value.speed;
                    }
                    if(value.graphic.x < value.wanderPoint[0])
                    {
                        value.graphic.x = value.graphic.x + value.speed;
                    }
                    if(value.graphic.y > value.wanderPoint[1])
                    {
                        value.graphic.y = value.graphic.y - value.speed;
                    }
                    if(value.graphic.y < value.wanderPoint[1])
                    {
                        value.graphic.y  = value.graphic.y + value.speed;
                    }
                    value.actionTicks++;
                }else{
                    value.treeStates.wandering = false;
                    value.treeStates.idle = true;
                    value.wanderPoint = [];
                    value.speed = 0;
                    value.actionTicks = 0;
                }
            }else if(value.treeStates.chasing)
            {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < 500 && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < 500))
                {
                    if(value.graphic.x < player.graphic.x)
                    {
                        value.graphic.x = value.graphic.x + value.speed;
                    }
                    if(value.graphic.x > player.graphic.x)
                    {
                        value.graphic.x = value.graphic.x - value.speed;
                    }
                    if(value.graphic.y < player.graphic.y)
                    {
                        value.graphic.y  = value.graphic.y + value.speed;
                    }
                    if(value.graphic.y > player.graphic.y)
                    {
                        value.graphic.y = value.graphic.y - value.speed;
                    }
                }else{
                    value.treeStates.chasing = false;
                    value.treeStates.wandering = true;
                    value.wanderPoint = [Math.random() * 2000, Math.random() * 1350];
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                }
            }
        }
        if(value.entityName === "Bluejay")
        {
            if(value.treeStates.idle)
            {
                if(!states.protected)
                {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < value.sight && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < value.sight))
                {
                    bluejay.play();
                    value.treeStates.idle = false;
                    value.treeStates.wandering = false;
                    value.chaseTarget = player;
                    value.speed = value.maxSpeed;
                    value.treeStates.chasing = true;
                    value.actionTicks = 0;
                }
                }

                if(value.actionTicks < value.idleTime)
                {
                    value.actionTicks++;
                }else{
                    value.treeStates.idle = false;
                    value.treeStates.wandering = true;
                    value.wanderPoint = [Math.random() * 2000, Math.random() * 1350];
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                }
            }else if(value.treeStates.wandering)
            {
                if(!states.protected)
                {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < value.sight && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < value.sight))
                {
                    bluejay.play();
                    value.treeStates.idle = false;
                    value.treeStates.wandering = false;
                    value.chaseTarget = player;
                    value.speed = value.maxSpeed;
                    value.treeStates.chasing = true;
                    value.actionTicks = 0;
                }
                }
                if(value.actionTicks < value.wanderTime)
                {
                    if(value.graphic.x > value.wanderPoint[0])
                    {
                        value.graphic.x = value.graphic.x - value.speed;
                    }
                    if(value.graphic.x < value.wanderPoint[0])
                    {
                        value.graphic.x = value.graphic.x + value.speed;
                    }
                    if(value.graphic.y > value.wanderPoint[1])
                    {
                        value.graphic.y = value.graphic.y - value.speed;
                    }
                    if(value.graphic.y < value.wanderPoint[1])
                    {
                        value.graphic.y  = value.graphic.y + value.speed;
                    }
                    value.actionTicks++;
                }else{
                    value.treeStates.wandering = false;
                    value.treeStates.idle = true;
                    value.wanderPoint = [];
                    value.speed = 0;
                    value.actionTicks = 0;
                }
            }else if(value.treeStates.chasing)
            {
                if((Math.abs(player.graphic.x+(player.graphic.w/2) - value.graphic.x+(value.graphic.w/2)) < 500 && Math.abs(player.graphic.y+(player.graphic.h/2) - value.graphic.y+(value.graphic.h/2)) < 500))
                {
                    if(value.graphic.x < player.graphic.x)
                    {
                        value.graphic.x = value.graphic.x + value.speed;
                    }
                    if(value.graphic.x > player.graphic.x)
                    {
                        value.graphic.x = value.graphic.x - value.speed;
                    }
                    if(value.graphic.y < player.graphic.y)
                    {
                        value.graphic.y  = value.graphic.y + value.speed;
                    }
                    if(value.graphic.y > player.graphic.y)
                    {
                        value.graphic.y = value.graphic.y - value.speed;
                    }
                }else{
                    value.treeStates.chasing = false;
                    value.treeStates.wandering = true;
                    value.wanderPoint = [Math.random() * 2000, Math.random() * 1350];
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                }
            }
        }
        if(value.entityName === "Red-Tailed Hawk")
        {
            if(value.treeStates.chasing)
            {
                if(states.protected)
                {
                    value.treeStates.chasing = false;
                    value.treeStates.returning = true;
                    value.actionTicks = 0;
                    value.idleTime = 700;
                }

                if(value.graphic.x < player.graphic.x)
                {
                    value.graphic.x = value.graphic.x + value.speed;
                }
                if(value.graphic.x > player.graphic.x)
                {
                    value.graphic.x = value.graphic.x - value.speed;
                }
                if(value.graphic.y < player.graphic.y)
                {
                    value.graphic.y = value.graphic.y + value.speed;
                }
                if(value.graphic.y > player.graphic.y)
                {
                    value.graphic.y = value.graphic.y - value.speed;
                }
            }
            else if(value.treeStates.returning)
            {
                if(value.actionTicks < value.idleTime)
                {
                    value.actionTicks++;
                }else{
                    value.treeStates.returning = false;
                    value.treeStates.idle = true;
                    value.actionTicks = 0;
                    value.speed = 0;
                    value.idleTime = 500 + Math.floor((Math.random() * 35) * 100);
                }

                if(value.graphic.x < value.homex)
                {
                    value.graphic.x = value.graphic.x + value.speed;
                }
                if(value.graphic.x > value.homex)
                {
                    value.graphic.x = value.graphic.x - value.speed;
                }
                if(value.graphic.y < value.homey)
                {
                    value.graphic.y = value.graphic.y + value.speed;
                }
                if(value.graphic.y > value.homey)
                {
                    value.graphic.y = value.graphic.y - value.speed;
                }
            }
            else if(value.treeStates.idle)
            {
                if(value.actionTicks < value.idleTime)
                {
                    value.actionTicks++;
                }
                else{
                    value.actionTicks = 0;
                    value.idleTime = 1000;
                    call.play();
                    value.graphic.color("red");
                    value.treeStates.idle = false;
                    value.treeStates.preChase = true;
                }
            }
            else if(value.treeStates.preChase)
            {
                if(value.actionTicks < value.idleTime)
                {
                    value.actionTicks++;
                }
                else{
                    screech.play();
                    value.speed = value.maxSpeed;
                    value.actionTicks = 0;
                    value.graphic.color("brown");
                    value.treeStates.preChase = false;
                    value.treeStates.chasing = true;
                }
            }
        }
      });
      let increase = 0;
    if (states.won) {
        states.started =  false;
        states.initialized = false;
        if (keys.enter) {
            increase = Math.floor(Math.random() * 6);
            if(increase==0)
            {
                treeNum++;
            }else if(increase==1)
            {
                eggNum++;
            }else if(increase==2)
            {
                kestrelNum++;
            }else if(increase==3)
            {
                nestNum++;
            }else if(increase==4)
            {
                hawkNum++;
            }else if(increase==5)
            {
                bluejayNum++;
            }
            document.body.style.backgroundImage = "";
            score = 0;
            required = 0;
            wintheme.pause();
            wintheme.currentTime = 0;
            player.graphic.destroy();
            player = undefined;
            players.forEach((value,index,array) => {
                value.graphic.destroy();
            });
            players = [];

            states.won = false;
            spawnTrees("Tree",treeNum);
            spawnTrees("Egg",eggNum);
            spawnTrees("Kestrel",kestrelNum);
            spawnTrees("Nest",nestNum);
            spawnTrees("Red-Tailed Hawk",hawkNum);
            spawnTrees("Bluejay",bluejayNum);
            spawnPlayer();
            player = players.find((value,index,obj) => {
                return value.playerName === "Jackdaw";
            });
            totalScore = totalScore + levelScore;
            level++;
            levelScore = 0;
            levelDisplay.text("Level: " + level).textFont({ size: '20px', weight: 'bold' });
            timeDisplay.text("Time: " + time).textFont({ size: '20px', weight: 'bold' });
            eggDisplay.text("Eggs: " + score + "/" + required).textFont({ size: '20px', weight: 'bold' });
            levelScoreDisplay.text("Level Score: " + levelScore).textFont({ size: '20px', weight: 'bold' });
            totalScoreDisplay.text("Total Score: " + totalScore).textFont({ size: '20px', weight: 'bold' });
            lifeDisplay.text("Lives: " + lives).textFont({ size: '20px', weight: 'bold' });
            ticks=0;
            time=0;
        }
    }
    if(states.lost)
    {
        if(lives>0)
        {
            states.started =  false;
            states.initialized = false;
            if (keys.enter) {
                document.body.style.backgroundImage = "";
                score = 0;
                required = 0;
                player.graphic.destroy();
                player = undefined;
                players.forEach((value,index,array) => {
                    value.graphic.destroy();
                });
                players = [];
    
                states.lost = false;
                spawnTrees("Tree",treeNum);
                spawnTrees("Egg",eggNum);
                spawnTrees("Kestrel",kestrelNum);
                spawnTrees("Nest",nestNum);
                spawnTrees("Red-Tailed Hawk",hawkNum);
                spawnTrees("Bluejay",bluejayNum);
                spawnPlayer();
                player = players.find((value,index,obj) => {
                    return value.playerName === "Jackdaw";
                });
                document.body.style.backgroundImage = "";
            }
        }else{
            gameover.loop = true;
            gameover.play();
            document.body.style.backgroundImage = `url("../Jackdaws and Kestrels/kestrel_with_chicks.jpg")`;
            levelDisplay.destroy();
            timeDisplay.destroy();
            eggDisplay.destroy();
            levelScoreDisplay.destroy();
            totalScoreDisplay.destroy();
            lifeDisplay.destroy();
            document.getElementById("playerName").style.display = 'inline';
            document.getElementById("submitScore").style.display = 'inline';
            document.getElementById("submitScore").addEventListener("click",(event) => {
                submitScore(totalScore);
            });
            document.getElementById("gameOverText").style.display = 'inline';
        }
    }
    }
    if (!states.started) {
      if (keys.enter) {
        states.initialized = true;
      }
      if (states.initialized) {
        spawnTicks = 0;
        states.spawnProtection = true;
        states.highFlyingReady = true,
        states.highFlying = false,
        levelDisplay.text("Level: " + level).textFont({ size: '20px', weight: 'bold' });
        timeDisplay.text("Time: " + time).textFont({ size: '20px', weight: 'bold' });
        eggDisplay.text("Eggs: " + score + "/" + required).textFont({ size: '20px', weight: 'bold' });
        levelScoreDisplay.text("Level Score: " + levelScore).textFont({ size: '20px', weight: 'bold' });
        totalScoreDisplay.text("Total Score: " + totalScore).textFont({ size: '20px', weight: 'bold' });
        lifeDisplay.text("Lives: " + lives).textFont({ size: '20px', weight: 'bold' });
        states.started = true;
        music.loop = true;
        music.play();
      }
    }
  }, 5);
  const submitScore = (score) => {
    playerName = document.getElementById("playerName").value;

    const now = new Date();
            const year = now.getFullYear();
            const month = ('0' + (now.getMonth() + 1)).slice(-2);
            const day = ('0' + now.getDate()).slice(-2);
            const hours = ('0' + now.getHours()).slice(-2);
            const minutes = ('0' + now.getMinutes()).slice(-2);
            const seconds = ('0' + now.getSeconds()).slice(-2);
            const currentDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const data = {
        name: playerName,
        score: score,
        date: currentDateTimeString
    };
    if(playerName!="" && highScorePosted!=true)
    {
        const nameField = document.getElementById("playerName");
            const scoreField = document.getElementById("submitScore");
            const promptText = document.getElementById("gameOverText");
            nameField.parentNode.removeChild(nameField);
            scoreField.parentNode.removeChild(scoreField);
            promptText.parentNode.removeChild(promptText);
        highScorePosted=true;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
            }
          };
          xhr.open("POST", "mainpage.php", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify(data));

        var xhr2 = new XMLHttpRequest();
        xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var data = JSON.parse(response);
            var table = document.createElement("table");
            var headerRow = document.createElement("tr");
            var headerCellIndex = document.createElement("th");
            headerCellIndex.innerHTML = "Rank";
            headerCellIndex.style.fontSize = '75px';
            headerCellIndex.style.fontWeight = 'bold';
            var headerCellName = document.createElement("th");
            headerCellName.innerHTML = "Player";
            headerCellName.style.fontSize = '75px';
            headerCellName.style.fontWeight = 'bold';
            var headerCellScore = document.createElement("th");
            headerCellScore.innerHTML = "Score";
            headerCellScore.style.fontSize = '75px';
            headerCellScore.style.fontWeight = 'bold';
            var headerCellDate = document.createElement("th");
            headerCellDate.innerHTML = "Date";
            headerCellDate.style.fontSize = '75px';
            headerCellDate.style.fontWeight = 'bold';
            headerRow.appendChild(headerCellIndex);
            headerRow.appendChild(headerCellName);
            headerRow.appendChild(headerCellScore);
            headerRow.appendChild(headerCellDate);
            table.appendChild(headerRow);
            data.map((value,index,array) => {
                var row = document.createElement("tr");
                var indexCell = document.createElement("td");
                indexCell.innerHTML = index + 1;
                indexCell.style.fontSize = '75px';
                indexCell.style.paddingRight = '100px';
                var nameCell = document.createElement("td");
                nameCell.innerHTML = value.name;
                nameCell.style.fontSize = '75px';
                nameCell.style.paddingRight = '100px';
                var scoreCell = document.createElement("td");
                scoreCell.innerHTML = value.score;
                scoreCell.style.fontSize = '75px';
                scoreCell.style.paddingRight = '100px';
                var dateCell = document.createElement("td");
                dateCell.innerHTML = value.date;
                dateCell.style.fontSize = '75px';
                dateCell.style.paddingRight = '100px';
                row.appendChild(indexCell);
                row.appendChild(nameCell);
                row.appendChild(scoreCell);
                row.appendChild(dateCell);
                table.appendChild(row);
            });
            document.getElementById("scoreBoardDiv").appendChild(table);
            document.getElementById("scoreBoardDiv").style.backgroundColor = 'white';
            document.getElementById("scoreBoardDiv").style.padding = '50px';
            var menuButton = document.getElementById("backButton");
            menuButton.style.display = "inline";
            menuButton.setAttribute("href", "mainMenu.php");
        }};
    setTimeout(() => {
        xhr2.open("GET", "getScores.php?table=highscores", true);
        xhr2.send();
    },3000);

        
    }
    };