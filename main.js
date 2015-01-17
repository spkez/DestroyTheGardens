// Create constants that can be used later on.
// This is the height and width of the game.
const GAMEWIDTH   = 640;
const GAMEHEIGHT  = 480;

// Store 0 as "ORIGIN" for geometry purposes.
const ORIGIN = 0;

//  Store the DOM element you would like to append to.
const DOM = '';

var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.CANVAS, 'DestroyTheGardens', { preload: preload, create: create, update: update });
/*
// Do the phaser stuff.
var game = new Phaser.Game(
    GAMEWIDTH,
    GAMEHEIGHT,
    DOM,
    {
      preload: preload,
      create:  create,
      update:  update
    }
  )
*/

var imagefolder = 'TagJam18/images/';

// Load the images
function preload(){
  game.load.image('background', imagefolder + 'Background.png');
  game.load.image('platform',   imagefolder + 'Platform.png');
  game.load.image('Wall',       imagefolder + 'Wall.png');

  // Sprite sizes are inconsistent so there is no way to do these with constants
  // The only real way is to resize the window sprite.
  // I definiitely do not feel like doing that.
  game.load.spritesheet('dog',    imagefolder + 'DogSprite.png', 16, 8);
  game.load.spritesheet('window', imagefolder + 'WindowSprite.png', 16, 16);
};

// Create the scene
function create(){
  // Physics is a perfectly fine way to do things for this.
  // The ARCADE engine has all the physics we need for a simple platformer

  // watch for typos :)
  game.physics.startSystem(Phaser.Physics.ARCADE);
  // game.physics.StartSystem(Phaser.Physics.ARCADE);

  // Add in the background.
  game.add.sprite(ORIGIN, ORIGIN, 'background');

  // Program everything that you need to know about the platforms.
  // Platforms need to be solid.
  // You will also need to place platforms.
  // That might take some time.
  // So let's just place one and then work on procedurally generating them later
  platforms = game.add.group();
  platforms.enableBody = true;

  // Place a platform for the ceiling
  // Make it the game width minus 32, and then offset it 16 by 16 pixels.
  var ceiling = platforms.create()
};

// Ruin Gardens
function update(){

};
