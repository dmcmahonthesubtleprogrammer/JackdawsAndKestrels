Crafty.init();
  class Player {
    width = 50;
    height = 50;
    color = "black";
    playerName = "";
    xposition = 0;
    yposition = 0;
    speed = 0;
    graphic = null;
    constructor(playerName,xposition,yposition,speed) {
         this.playerName = playerName;
         this.xposition = xposition;
         this.yposition = yposition;
         this.speed = speed;
         this.graphic = Crafty.e("2D, Canvas, Color, Fourway, Renderable")
         .attr({x:this.xposition, y:this.yposition, w:this.width, h:this.height, z:1})
         .color(this.color)
         .fourway(3);
    }
  }
  class Tree {
        width = 100;
        height = 100;
        color = "sienna";
        entityName = "";
        xposition = 0;
        yposition = 0;
        graphic = null;
        treeStates = {
            alive: true,
            thinks: false,
            idle: false,
            wandering: false,
            chasing: false
        }
        speed = 0;
        maxSpeed = 0;
        sight = 0;
        idleTime = 0;
        wanderTime = 0;
        wanderPoint = [];
        chaseTarget = null;
        actionTicks = 0;
        constructor(entityName, xposition, yposition) {
            this.entityName = entityName;
            this.xposition = xposition;
            this.yposition = yposition;
            this.graphic = Crafty.e("2D, Canvas, Color, Fourway").attr({x:this.xposition, y:this.yposition, w:this.width, h:this.height}).color(this.color).fourway(3);
            if(entityName === "Egg")
            {
                this.graphic.color("white");
                this.graphic.attr({w:50,h:50,z:1});
            }else if(entityName === "Kestrel")
            {
                this.treeStates.thinks = true;
                this.treeStates.idle = true;
                this.maxSpeed = 0.5;
                this.sight = 500;
                this.idleTime = 500;
                this.wanderTime = 1500;
                this.graphic.color("chocolate");
                this.graphic.attr({w:50,h:50,z:1});
            }
        }
  }
    const players = [];
    const nest = [];
    let safex = 0;
    let safey = 0;
    let trees = [];
    let required = 0;
    let score = 0;
    document.body.style.backgroundColor = "chartreuse";
    for(let i = 0; i < 100; i++)
    {
        trees.push(new Tree("Tree",Math.random() * 2000,Math.random() * 1350));
    }
    for(let i = 0; i < 50; i++)
    {
        let x = Math.random() * 2000;
            let y = Math.random() * 1350;
        while(
            trees.find((value,index,obj) => {
                if(x < value.graphic.x + value.graphic.w && 
                x + 50 > value.graphic.x &&
                y < value.graphic.y + value.graphic.h &&
                50 + y > value.graphic.y) {
                    return true;
                }
                return false;
            })
        )
        {
            x = Math.random() * 2000;
            y = Math.random() * 1350;
        }
        trees.push(new Tree("Egg",x,y));
        required++;
    }
    for(let i = 0; i < 10; i++)
    {
        let kestx = Math.random() * 2000;
            let kesty = Math.random() * 1350;
        while(
            trees.find((value,index,obj) => {
                if(kestx < value.graphic.x + value.graphic.w && 
                    kestx + 50 > value.graphic.x &&
                    kesty < value.graphic.y + value.graphic.h &&
                50 + kesty > value.graphic.y) {
                    return true;
                }
                return false;
            })
        )
        {
            kestx = Math.random() * 2000;
            kesty = Math.random() * 1350;
        }
        trees.push(new Tree("Kestrel",kestx,kesty));
    }
    let spawnx = Math.random() * 2000;
    let spawny = Math.random() * 1350;
    while(
        trees.find((value,index,obj) => {
            if((spawnx < value.graphic.x + value.graphic.w + 50 && 
                spawnx + 50 > value.graphic.x - 50 &&
                spawny < value.graphic.y + value.graphic.h + 50 &&
            50 + spawny > value.graphic.y - 50)) {
                return true;
            }
            return false;
        })
    )
    {
        spawnx = Math.random() * 2000;
        spawny = Math.random() * 1350;
    }
    players.push(new Player("Jackdaw",spawnx,spawny,5));
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
setInterval(() => {
    if (states.started) {
        repositionTicks++;
        let collide = trees.find((value,index,obj) => {
            if (
                (player.graphic.x < value.graphic.x + value.graphic.w && 
                player.graphic.x + player.graphic.w > value.graphic.x &&
                player.graphic.y < value.graphic.y + value.graphic.h &&
                player.graphic.h + player.graphic.y > value.graphic.y) && (!states.highFlying)
              ) {
                // Collision detected!
                return true;
              }
        });

        if(repositionTicks>=50)
        {
            if(!collide && !states.highFlying)
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
                console.log("Ability ready!");
            }
        }

        if(collide)
        {
            if(player.graphic.y + player.graphic.h > collide.graphic.y + collide.graphic.h)
            {
                collisionDirections.up = true;
            }
            if(player.graphic.y < collide.graphic.y)
            {
                collisionDirections.down = true;
            }
            if(player.graphic.x + player.graphic.w > collide.graphic.x + collide.graphic.w)
            {
                collisionDirections.left = true;
            }
            if(player.graphic.x < collide.graphic.x)
            {
                collisionDirections.right = true;
            }
            if(collide.entityName === "Egg")
            {
                score++;
                console.log(`Score: ${score}/${required}`);
                trees[trees.findIndex((value,index,obj) => {
                    if(collide===value)
                    {
                        return true
                    }
                    return false;
                })] = new Tree("Null",-1000,-1000);
                collide.graphic.destroy();
                const collected = new Audio('eggCrack.mp3'); 
                collected.play();
            }
            if(collide.entityName === "Kestrel")
            {
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
                const deathSound = new Audio('jackdawDeath.mp3'); 
                deathSound.play();
            }
        }else{
            collisionDirections.up = false;
            collisionDirections.down = false;
            collisionDirections.left = false;
            collisionDirections.right = false;
        }

        if(score===required)
        {
            console.log("You're winner!");
            trees.forEach((value,index,array) => {
                value.graphic.destroy();
            });
            trees = [];
            document.body.style.backgroundImage = `url("../Jackdaws and Kestrels/air.png")`;
            document.body.style.backgroundRepeat = `no-repeat`;
            document.body.style.backgroundSize = `100%`;
            music.pause();
            music.currentTime = 0;
            if(!states.won)
            {
                const winsound = new Audio('wind.mp3'); 
                winsound.play();
                const wintheme = new Audio('skytheme.mp3'); 
                wintheme.loop = true;
                wintheme.play();
            }
            states.won = true;
        }

      if (keys.up) {
        if (player.graphic.y > 0 && !(collide && collisionDirections.up)) {
            player.graphic.y-=1;
        }else if(collide)
        {
            if(collisionDirections.up)
            {
                player.graphic.y = player.graphic.y + 1;
            }
            if(collisionDirections.down)
            {
                player.graphic.y = player.graphic.y - 1;
            }
            if(collisionDirections.left)
            {
                player.graphic.x = player.graphic.x + 1;
            }
            if(collisionDirections.right)
            {
                player.graphic.x = player.graphic.x - 1;
            }
            if((collisionDirections.up && collisionDirections.down && collisionDirections.left && collisionDirections.right) && collide.entityName === "Tree")
            {
                player.graphic.x = safex;
                player.graphic.y = safey;
            }
        }
      }
      if (keys.down) {
        if (player.graphic.y < 1350 && !(collide && collisionDirections.down)) {
            player.graphic.y+=1;
        }else if(collide)
        {
            if(collisionDirections.up)
            {
                player.graphic.y = player.graphic.y + 1;
            }
            if(collisionDirections.down)
            {
                player.graphic.y = player.graphic.y - 1;
            }
            if(collisionDirections.left)
            {
                player.graphic.x = player.graphic.x + 1;
            }
            if(collisionDirections.right)
            {
                player.graphic.x = player.graphic.x - 1;
            }
            if((collisionDirections.up && collisionDirections.down && collisionDirections.left && collisionDirections.right) && collide.entityName === "Tree")
            {
                player.graphic.x = safex;
                player.graphic.y = safey;
            }
        }
      }
      if (keys.left) {
        if (player.graphic.x > 0 && !(collide && collisionDirections.left)) {
            player.graphic.x-=1;
        }else if(collide)
        {
            if(collisionDirections.up)
            {
                player.graphic.y = player.graphic.y + 1;
            }
            if(collisionDirections.down)
            {
                player.graphic.y = player.graphic.y - 1;
            }
            if(collisionDirections.left)
            {
                player.graphic.x = player.graphic.x + 1;
            }
            if(collisionDirections.right)
            {
                player.graphic.x = player.graphic.x - 1;
            }
            if((collisionDirections.up && collisionDirections.down && collisionDirections.left && collisionDirections.right) && collide.entityName === "Tree")
            {
                player.graphic.x = safex;
                player.graphic.y = safey;
            }
        }
      }
      if (keys.right) {
        if (player.graphic.x < 2000 && !(collide && collisionDirections.right)) {
            player.graphic.x+=1;
        }else if(collide)
        {
            if(collisionDirections.up)
            {
                player.graphic.y = player.graphic.y + 1;
            }
            if(collisionDirections.down)
            {
                player.graphic.y = player.graphic.y - 1;
            }
            if(collisionDirections.left)
            {
                player.graphic.x = player.graphic.x + 1;
            }
            if(collisionDirections.right)
            {
                player.graphic.x = player.graphic.x - 1;
            }
            if((collisionDirections.up && collisionDirections.down && collisionDirections.left && collisionDirections.right) && collide.entityName === "Tree")
            {
                player.graphic.x = safex;
                player.graphic.y = safey;
            }
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
            console.log("cooldown started")
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
      });
    }
    if (!states.started) {
      if (keys.enter) {
        states.initialized = true;
      }
      if (states.initialized) {
        states.started = true;
        music.loop = true;
                music.play();
      }
    }
  }, 5);