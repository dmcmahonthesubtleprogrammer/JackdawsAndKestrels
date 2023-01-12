let spawns = [];
let trees = [];
let checkCollisions = () => {
  let jackdaw = document.getElementById("jackdaw");
  let side = -1;
  trees.forEach((value, index, obj) => {
    if (
      Number(jackdaw.style.top.replace("px", "")) <
      Number(value.component.style.top.replace("px", "")) +
        Number(value.component.style.height.replace("px", "")) ||
        Number(jackdaw.style.top.replace("px", "")) + Number(jackdaw.style.height.replace("px", "") > Number(value.component.style.top.replace("px", ""))) ||
        Number(jackdaw.style.top.replace("px", "")) <
      Number(value.component.style.left.replace("px", "")) +
        Number(value.component.style.width.replace("px", "")) ||
        Number(jackdaw.style.left.replace("px", "")) + Number(jackdaw.style.width.replace("px", "") > Number(value.component.style.left.replace("px", "")))
    ) {
      side = 0;
    }
  });
  return side;
};
class Tree {
  width = "100px";
  height = "100px";
  color = "sienna";
  entityName = "";
  xposition = 0;
  yposition = 0;
  component = null;
  constructor(entityName, xposition, yposition) {
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
}

class Spawn {
  width = "100px";
  height = "100px";
  color = "burlywood";
  entityName = "";
  xposition = 0;
  yposition = 0;
  component = null;
  constructor(entityName, xposition, yposition) {
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
}
spawns.push(
  new Spawn(
    "Jackdaw",
    Math.floor(Math.random() * 2000),
    Math.floor(Math.random() * 1200)
  )
);
spawns.find((value, index, obj) => {
  return (value.entityName = "Jackdaw");
}).component.style.visibility = "visible";
let posx =
  spawns.find((value, index, obj) => {
    return (value.entityName = "Jackdaw");
  }).xposition + 25;
let posy =
  spawns.find((value, index, obj) => {
    return (value.entityName = "Jackdaw");
  }).yposition - 25;
trees.push(
  new Tree(
    "Tree",
    Math.floor(Math.random() * 2000),
    Math.floor(Math.random() * 1200)
  )
);
let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  enter: false,
};
let states = {
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
setInterval(() => {
  let jackdaw = document.getElementById("jackdaw");
  if (states.started) {
    if (keys.up) {
      if (posy > 0) {
        posy = posy - 2;
        jackdaw.style.top = posy + "px";
      }
    }
    if (keys.down) {
      if (posy < 1300) {
        posy = posy + 2;
        jackdaw.style.top = posy + "px";
      }
    }
    if (keys.left) {
      if (posx > 0) {
        posx = posx - 2;
        jackdaw.style.left = posx + "px";
      }
    }
    if (keys.right) {
      if (posx < 2100) {
        posx = posx + 2;
        jackdaw.style.left = posx + "px";
      }
    }
  }
  if (!states.started) {
    if (keys.enter) {
      states.initialized = true;
    }
    if (states.initialized) {
      jackdaw.style.top = posy + "px";
      jackdaw.style.left = posx + "px";
      states.started = true;
    }
  }
}, 5);
