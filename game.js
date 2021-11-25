//KABOOM
kaboom({

  width: 711,
  height: 400,
  background: [ 0, 186, 255, ]
  
});


//Sprites and sounds
loadSprite("spongebob", "sprites/spongebob.png");
loadSprite("spongepls", "sprites/spongepls.png");
loadSprite("goku", "sprites/goku.png");
loadSprite("credit", "sprites/credit.jpg");
loadSprite("krabby-patty", "sprites/krabby-patty.png");
loadSound("scream", "sounds/scream.mp3");
loadSound("munch", "sounds/munch.mp3");
loadSound("music", "sounds/music.mp3");
loadSound("super-idol", "sounds/super-idol.mp3")

//variables
var pos_x = 80;
var pos_y = 80;
let SPEED = 100;
var txtInput = "";
var superIdol = false;
const activation = "wwssadaAB";
var isFullScreen = false
var pattyCount = 0;
const mapHeight = 19;
const mapWidth = 32;
var mapping = [];



//fullscreen
keyPress("f", (c) => {
  if (!isFullScreen)
    isFullScreen = true;
  if (isFullScreen)
    isFullScreen = false;
    fullscreen(isFullScreen);
})

//layers (spongebob in front)
layers([
    "patty",
    "goku",
    "spongebob",
], "game");

//Create the krabby patty map
for (let i = 0; i <= mapHeight; i++){
  mapping.push('');
  for (let j = 0; j <= mapWidth; j++){
    if (((Math.random() * 4)) >= 2.7){
      mapping[i] += " ";
    }
    else{
      mapping[i] += "k";
      pattyCount++;
    }
  }
}

//insert the map
const map = addLevel(mapping,
{
  width: 20,
  height: 20,
  "k": () => [
        sprite("krabby-patty"),
        layer("patty"),
        area(),
        solid(),
        scale(0.1),
        'patty'
    ],
});

//Add player (spongebob)
var player = add([
	sprite("spongebob"),
  layer("spongebob"),
  scale(0.3),
  area(),
  pos(pos_x,pos_y),
  'spongebob',
]);

//Add goku
var goku = add([
        sprite("goku"),
        layer("goku"),
        area(),
        scale(0.3),
        pos(400,200),
        'goku',
    ]);

//Movement
const dirs = {
  "left": LEFT,
  "right": RIGHT,
  "up": UP,
  "down": DOWN,
  "a": LEFT,
  "d": RIGHT,
  "w": UP,
  "s": DOWN,
};
for (const dir in dirs) {
  keyDown(dir, () => {
    player.move(dirs[dir].scale(SPEED/1.9));
  });
}

//Goku movement
var m = 0;
action('goku', (goku) => {
  if (m <= 220){
  goku.move(-SPEED,0);
  m++;
  }
  if (m > 220 && m <= 340){
    goku.move(0,-SPEED);
    m++;
  }
  if (m > 340 && m <= 560){
    goku.move(SPEED,0);
    m++;
  }
  if (m > 560 && m <= 680){
    goku.move(0,SPEED);
    m++;
  }
  if (m > 680){
    m = 0;
  }
 });

//Eat 
player.collides('patty', (p) => {
  destroy(p);
  play("munch")
  pattyCount--;
  if (pattyCount == 0){
    destroy(goku);
    add([
      text("SO MUCH WIN!!!"),
      pos(0,150),
      layer("spongebob"),
    ])
    destroyAll('patty');
    play("music",{loop: true,});
    SPEED = 600;
  }
})

//Input super idol cheat code
charInput((ch) => {
  if(!superIdol){
      txtInput += ch;
      for(let i = 0; i < txtInput.length; i++){
        if (txtInput != activation.substring(0,txtInput.length)){
          txtInput = "";
        }
      }
      if (txtInput == activation){
        keyPress('enter', () => {
          debug.log("");
          play("super-idol",{loop: true,});
          destroy(goku);
          destroyAll('patty');
          add([
          text("SUPER IDOL\n\t\tACTIVATED"),
          pos(0,150),
          layer("spongebob"),
          ])
          add([
          sprite("credit"),
          pos(300,0),
          layer("spongebob"),
          scale(0.125),
          ])
          destroy(player);
          newBob(); 
          SPEED = 600;     
      });
      }
      console.log(txtInput);
  }
});

//Die when touch goku
player.collides('goku', () => {
  destroy(player);
  play("scream");
  sleep(2100);
  document.location.href=window.atob('aHR0cHM6Ly9uaWdnYWZhcnQuY29tLw==');
})

//Functions for stuff
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
function newBob(){
  player = add([
	sprite("spongepls"),
  layer("spongebob"),
  scale(0.3),
  area(),
  pos(pos_x,pos_y),
  'spongebob',
]);
}
