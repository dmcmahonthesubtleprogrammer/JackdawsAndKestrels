//let startx = 1075;
//let starty = 650;
const spawns = [];
class Spawn {
    width = "100px";
    height = "100px";
    color = "brown";
    entityName = "";
    xposition = 0;
    yposition = 0;
    component = null;
    constructor(entityName,xposition,yposition) {
    this.entityName = entityName;
    this.xposition = xposition;
    this.yposition = yposition;
    this.component = document.createElement("div");
    this.component.className = "nest";
    this.component.style.position = "relative";
    this.component.style.width = this.width;
    this.component.style.height = this.height;
    this.component.style.backgroundColor = this.color;
    this.component.style.top = this.yposition - 100 + "px";
    this.component.style.left = this.xposition + "px";
    this.component.style.zIndex = -1;
    document.body.appendChild(this.component);
    }
    getXPosition() {
        return this.xposition;
    }
    getYPosition() {
        return this.yposition;
    }
}
//document.body.appendChild(null);
//2000
//1300
spawns.push(new Spawn("Jackdaw", Math.floor(Math.random() * 2000),Math.floor(Math.random() * 1200)));
let nestVis = spawns.find((value,index,obj) => {
    return value.entityName = "Jackdaw";
}).component.style.visibility = "visible";
let posx = spawns.find((value,index,obj) => {
    return value.entityName = "Jackdaw";
}).getXPosition()+25;
let posy = spawns.find((value,index,obj) => {
    return value.entityName = "Jackdaw";
}).getYPosition()-25;
//console.log(posx);
//console.log(spawns);
let keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    enter: false
};
let states = {
    initialized: false,
    started: false
};
document.addEventListener('keydown', (event) => {
    let name = event.key;
    if(name.toLowerCase()==='w')
    {
        keys.up = true;
    }
    if(name.toLowerCase()==='s')
    {
        keys.down = true;
    }
    if(name.toLowerCase()==='a')
    {
        keys.left = true;
    }
    if(name.toLowerCase()==='d')
    {
        keys.right = true;
    }
    if(name.toLowerCase()==='enter')
    {
        keys.enter = true;
    }
},false);

document.addEventListener('keyup', (event) => {
    let name = event.key;
    if(name.toLowerCase()==='w')
    {
        keys.up = false;
    }
    if(name.toLowerCase()==='s')
    {
        keys.down = false;
    }
    if(name.toLowerCase()==='a')
    {
        keys.left = false;
    }
    if(name.toLowerCase()==='d')
    {
        keys.right = false;
    }
    if(name.toLowerCase()==='enter')
    {
        keys.enter = false;
    }
},false);
setInterval(() => {
    const jackdaw = document.getElementById("jackdaw");
    if(states.started)
    {
    if(keys.up)
    {
        if(posy > 0)
        {
            posy=posy-2;
            jackdaw.style.top = posy + "px";
        }
    }
    if(keys.down)
    {
        if(posy < 1300)
        {
            posy=posy+2;
            jackdaw.style.top = posy + "px";
        }
    }
    if(keys.left)
    {
        if(posx > 0)
        {
            posx=posx-2;
            jackdaw.style.left = posx + "px";
        }
    }
    if(keys.right)
    {
        if(posx < 2100)
        {
            posx=posx+2;
            jackdaw.style.left = posx + "px";
        }
    }
    }
    if(!states.started)
    {
    if(keys.enter)
    {
        states.initialized = true;
    }
    if(states.initialized)
    {
        jackdaw.style.top = posy + "px";
        jackdaw.style.left = posx + "px";
        states.started = true;
    }
    }
}, 5);

console.log('Code is running');