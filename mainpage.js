const startx = 1075;
const starty = 650;
let posx = startx;
let posy = starty;
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
        posy=posy-5;
        jackdaw.style.top = posy + "px";
    }
    if(keys.down)
    {
        posy=posy+5;
        jackdaw.style.top = posy + "px";
    }
    if(keys.left)
    {
        posx=posx-5;
        jackdaw.style.left = posx + "px";
    }
    if(keys.right)
    {
        posx=posx+5;
        jackdaw.style.left = posx + "px";
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