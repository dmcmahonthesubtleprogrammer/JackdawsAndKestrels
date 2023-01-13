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
         this.graphic = Crafty.e("2D, Canvas, Color, Fourway")
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
        constructor(entityName, xposition, yposition) {
            this.entityName = entityName;
            this.xposition = xposition;
            this.yposition = yposition;
            this.graphic = Crafty.e("2D, Canvas, Color, Fourway").attr({x:this.xposition, y:this.yposition, w:this.width, h:this.height}).color(this.color).fourway(3);
            if(entityName === "Egg")
            {
                this.graphic.color("white");
                this.graphic.attr({w:50,h:50,z:1});
            }
        }
  }
    const players = [];
    const nest = [];
    let trees = [];
    let required = 0;
    let score = 0;
    document.body.style.backgroundColor = "chartreuse";
    players.push(new Player("Jackdaw",Math.random() * 2000,Math.random() * 1350,5));
    for(let i = 0; i < 100; i++)
    {
        trees.push(new Tree("Tree",Math.random() * 2000,Math.random() * 1350));
    }
    for(let i = 0; i < 1; i++)
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
    const player = players.find((value,index,obj) => {
        return value.playerName === "Jackdaw";
    });
        const keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            enter: false,
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
            },
            false
          );
          let collide = false;
setInterval(() => {
    if (states.started) {

    let collide = trees.find((value,index,obj) => {
            if (
                player.graphic.x < value.graphic.x + value.graphic.w && 
                player.graphic.x + player.graphic.w > value.graphic.x &&
                player.graphic.y < value.graphic.y + value.graphic.h &&
                player.graphic.h + player.graphic.y > value.graphic.y
              ) {
                // Collision detected!
                return true;
              }
        });

        if(collide)
        {
            if(player.graphic.y + player.graphic.h > collide.graphic.y + collide.graphic.h)
            {
                collisionDirections.up = true;
                collisionDirections.down = false;
                collisionDirections.left = false;
                collisionDirections.right = false;
            }
            if(player.graphic.y < collide.graphic.y)
            {
                collisionDirections.down = true;
                collisionDirections.up = false;
                collisionDirections.left = false;
                collisionDirections.right = false;
            }
            if(player.graphic.x + player.graphic.w > collide.graphic.x + collide.graphic.w)
            {
                collisionDirections.left = true;
                collisionDirections.up = false;
                collisionDirections.down = false;
                collisionDirections.right = false;
            }
            if(player.graphic.x < collide.graphic.x)
            {
                collisionDirections.right = true;
                collisionDirections.up = false;
                collisionDirections.down = false;
                collisionDirections.left = false;
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
        }

        if(collisionDirections.up)
        {
                //if(Math.abs(player.graphic.y < (collide.graphic.y + collide.graphic.h/2)) && Math.abs(player.graphic.y < (collide.graphic.y + collide.graphic.h/2)))
                //{
                    player.graphic.y = (collide.graphic.y + collide.graphic.h) + 1;
                //}
        }
        else if(collisionDirections.down)
        {
                player.graphic.y = (collide.graphic.y - player.graphic.h) - 1;
        }
        else if(collisionDirections.left)
        {
                player.graphic.x = (collide.graphic.x + collide.graphic.w) + 1;
        }
        else if(collisionDirections.right)
        {
                player.graphic.x = (collide.graphic.x - player.graphic.w) - 1;
        }
      if (keys.up) {
        if (player.graphic.y > 0 && !(collide && collisionDirections.up)) {
            player.graphic.y-=1;
        }
      }
      if (keys.down) {
        if (player.graphic.y < 1350 && !(collide && collisionDirections.down)) {
            player.graphic.y+=1;
        }
      }
      if (keys.left) {
        if (player.graphic.x > 0 && !(collide && collisionDirections.left)) {
            player.graphic.x-=1;
        }
      }
      if (keys.right) {
        if (player.graphic.x < 2000 && !(collide && collisionDirections.right)) {
            player.graphic.x+=1;
        }
      }
    }
    if (!states.started) {
      if (keys.enter) {
        states.initialized = true;
      }
      if (states.initialized) {
        states.started = true;
      }
    }
  }, 5);