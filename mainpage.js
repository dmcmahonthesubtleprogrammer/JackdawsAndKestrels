//const fx = require('fx');
let posx = 0;
let posy = 0;
let keys = {
    up: false,
    down: false,
    left: false,
    right: false
};
document.addEventListener('keydown', (event) => {
    let name = event.key;
    const elem = document.getElementById("jackdaw");
    if(name.toLowerCase()==='w')
    {
        keys.up = true;
        console.log(keys.up);
    }
    if(name.toLowerCase()==='s')
    {
        keys.down = true;
        console.log(keys.down);
    }
    if(name.toLowerCase()==='a')
    {
        keys.left = true;
        console.log(keys.left);
    }
    if(name.toLowerCase()==='d')
    {
        keys.right = true;
        console.log(keys.right);
    }
},false);

document.addEventListener('keyup', (event) => {
    let name = event.key;
    const elem = document.getElementById("jackdaw");
    if(name.toLowerCase()==='w')
    {
        keys.up = false;
        console.log(keys.up);
    }
    if(name.toLowerCase()==='s')
    {
        keys.down = false;
        console.log(keys.down);
    }
    if(name.toLowerCase()==='a')
    {
        keys.left = false;
        console.log(keys.left);
    }
    if(name.toLowerCase()==='d')
    {
        keys.right = false;
        console.log(keys.right);
    }
},false);

document.addEventListener('keypress', (event) => {
    const elem = document.getElementById("jackdaw");
    if(keys.up)
    {
        posy=posy-10;
        elem.style.top = posy + "px";
    }
    if(keys.down)
    {
        posy=posy+10;
        elem.style.top = posy + "px";
    }
    if(keys.left)
    {
        posx=posx-10;
        elem.style.left = posx + "px";
    }
    if(keys.right)
    {
        posx=posx+10;
        elem.style.left = posx + "px";
    }
},false);

console.log('Code is running');