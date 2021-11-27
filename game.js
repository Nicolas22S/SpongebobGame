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
loadSprite("ZAMN", "sprites/ZAMN.jpg");
loadSprite("krabby-patty", "sprites/krabby-patty.png");
loadSprite("super_idol", "sprites/super_idol.jpg");
loadSprite("easy", "sprites/baby.jpg");
loadSprite("medium", "sprites/strong.jpg");
loadSprite("hard", "sprites/hard.jpg");
loadSound("scream", "sounds/scream.mp3");
loadSound("munch", "sounds/munch.mp3");
loadSound("music", "sounds/music.mp3");
loadSound("super-idol", "sounds/super-idol.mp3");
loadSound("tick", "sounds/tick.wav");
loadSound("boom", "sounds/vine-boom.mp3");
loadSound("DamnDaniel", "sounds/DamnDaniel.mp3");
loadSound("UltraInstinct", "sounds/UltraInstinct.mp3");

//variables
var pos_x = 80;
var pos_y = 80;
var SPEED = 100;
var txtInput = "";
var superIdol = false;
const activation = "wwssadadBA";
var isFullScreen = false
var pattyCount = 0;
const mapHeight = 19;
const mapWidth = 32;
var mapping = [];
var intensity = 2.5;



//layers (spongebob in front)
layers([
    "patty",
    "goku",
    "spongebob",
], "game");

//
scene("startUp", () => {
  //fullscreen
  screen();
  
  //Text
  add([
    text("Select your intensity\nusing the left/right keys.\nPress Enter to continue.",{size: 20, font: "sinko"}),
    pos(130,100),
  ]);
  //Difficulty text
  var diff = add([
    text(intensity,{size: 30, font: "sinko"}),
    pos(270,210),
  ]);
  updatePic("spongebob",0.6,220);
  //Left to decrease difficulty Right to increase
  keyPress('left', () => {
    if (intensity > 1){
      intensity-=0.1;
      diff.text = (Math.ceil(intensity*10))/10;
      intesity = diff.text;
      play("tick");
      switch (diff.text){
      case 2.4:
        updatePic("easy",0.4,220); break; 
      case 4.9:
        updatePic("medium",0.4,220); break;
      case 1.2:
        updatePic("ZAMN",0.4,160); play("DamnDaniel"); break;
      case 1.1:
        updatePic("easy",0.4,240); break;
      case 2.5:
        updatePic("spongebob",0.6,220); break;
      }    
    }
  });
  keyPress('right', () => {
    if (intensity < 4.9){
    intensity+=0.1;
    diff.text = (Math.ceil(intensity*10))/10;
    intesity = diff.text;
    play("tick");
    switch (diff.text){
      case 2.6:
        updatePic("medium",0.4,220); break;
      case 5:
        updatePic("hard",0.25,220); play("boom"); break;
      case 4.9:
        updatePic("medium",0.4,220); break;
      case 1.2:
        updatePic("ZAMN",0.4,160); play("DamnDaniel"); break;
      case 1.3:
        updatePic("easy",0.4,220); break;
      case 2.5:
        updatePic("spongebob",0.6,220); break;
      }
    }
  });
keyPress('enter', () => {
    go("game");
    console.log(intensity)
    });
});

//Playing the game
scene("game", () => {
screen();

//Create the krabby patty map
for (let i = 0; i <= mapHeight; i++){
  mapping.push('');
  for (let j = 0; j <= mapWidth; j++){
    if (((Math.random() * 5)) >= intensity){
      mapping[i] += " ";
    }
    else{
      mapping[i] += "k";
      pattyCount++;
    }
  }
}
console.log(mapping);
console.log(pattyCount);

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

//Ultra Instinct
const music = play("UltraInstinct", {loop: true});

//Add goku
var goku = add([
        sprite("goku"),
        layer("goku"),
        area(),
        scale(0.375),
        pos(445,200),
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
    player.move(dirs[dir].scale(SPEED/(0.42*intensity)));
  });
}

//Goku movement
var mList = [270,400,720,850];
var m = 0;
action('goku', (goku) => {
  if (m <= mList[0]){
  goku.move(-SPEED,0);
  m++;
  }
  if (m > mList[0] && m <= mList[1]){
    goku.move(0,-SPEED);
    m++;
  }
  if (m > mList[1] && m <= mList[2]){
    goku.move(SPEED,0);
    m++;
  }
  if (m > mList[2] && m <= mList[3]){
    goku.move(0,SPEED);
    m++;
  }
  if (m > mList[3]){
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
    music.pause();
    add([
      text("SO MUCH WIN!!!"),
      pos(0,150),
      layer("spongebob"),
    ])
    destroyAll('patty');
    play("music",{loop: true,});
    SPEED = 600;
    superIdol = true;
  }
})

//Die when touch goku
player.collides('goku', () => {
  destroy(player);
  play("scream");
  music.pause();
  sleep(2100);
  document.location.href=window.atob('aHR0cHM6Ly9uaWdnYWZhcnQuY29tLw==');
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
          music.pause();
          console.log(txtInput);
          superIdol = true;   
          destroy(player);
          play("super-idol",{loop: true,});
          destroy(goku);
          destroyAll('patty');
          idol(); 
          add([
          text("SUPER IDOL\n\t\tACTIVATED"),
          pos(0,150),
          layer("spongebob"),
          ])
          player = add([sprite("spongepls"),
          layer("spongebob"),
          scale(0.3),
          area(),
          pos(pos_x,pos_y),
          'spongebob',
          ]);
          SPEED = 600;  
      });
      }
      
      console.log(txtInput);
  }
});

});
go("startUp");





//Functions for stuff
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function idol(){

  add([sprite("credit"),
  pos(300,0),
  layer("spongebob"),
  scale(0.125),]);

  add([sprite("credit"),
  pos(150,230),
  layer("goku"),
  ,scale(0.125),
  ]);

  add([
    sprite("super_idol"),
    pos(100,0),
    layer("goku"),
    scale(0.5),
    ]);
}

function screen(){
  //fullscreen
keyPress("f", (c) => {
  if (!isFullScreen)
    isFullScreen = true;
  if (isFullScreen)
    isFullScreen = false;
    fullscreen(isFullScreen);
})
}

function updatePic(d,s,p){
  destroyAll('pic');
  add([
    sprite(d),
    pos(500,p),
    scale(s),
    'pic',
  ])
}
