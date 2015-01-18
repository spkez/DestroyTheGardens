// We're going to need random number generation.

// Create constants that can be used later on.
// This is the height and width of the game.
const GAMEWIDTH   = 640;
const GAMEHEIGHT  = 480;

// Store 0 as "ORIGIN" for geometry purposes.
const ORIGIN = 0;

//  Store the DOM element you would like to append to.
const DOM = 'DestroyTheGardens';

// Divide the game space into tiles.
const TILESIZE = 16;

// Store the location where the images will be loaded from.
const imagefolder = 'Assets/images/';

var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.CANVAS,  DOM, { preload: preload, create: create, update: update });

// Load the images
function preload(){
  game.load.image('background', imagefolder + 'Background.png');
  game.load.image('platform',   imagefolder + 'Platform.png');
  game.load.image('wall',       imagefolder + 'Wall.png');

  // Sprite sizes are inconsistent so there is no way to do these with constants
  // The only real way is to resize the window sprite.
  // I definitely do not feel like doing that.
  game.load.spritesheet('dog',    imagefolder + 'DogSprite.png', 16, 8);
  game.load.spritesheet('window', imagefolder + 'WindowSprite.png', 16, 16);
};

// Create the scene
function create(){
  // Physics is a perfectly fine way to do things for this.
  // The ARCADE engine has all the physics we need for a simple platformer

  // watch for typos :)
  // Oh geez, thanks Madmarcel!
  game.physics.startSystem(Phaser.Physics.ARCADE);
  // game.physics.StartSystem(Phaser.Physics.ARCADE); // <-- Code left for anyone who looked over this or saw that I was having trouble with this stuff.

  // Add in the background.
  // Disable when testing the ceiling generation.
  // Also for walls.
  game.add.sprite(ORIGIN, ORIGIN, 'background');

  // Program everything that you need to know about the platforms.
  // Platforms need to be solid.
  // You will also need to place platforms.
  // That might take some time.
  // So let's just place one and then work on procedurally generating them later
  // Somehow I forgot to add in the information that loads the image...
  platforms = game.add.group();
  platforms.enableBody = true;

  // Place a platform for the ceiling
  // Make it the game width minus 32, and then offset it 16 by 16 pixels.
  // Or just forget all that and place a platform every sixteen pixels.
  // Divide the whole playing field into tiles and place one every tile.
  // This is tedious. Do it with a for loop.
  var ceiling = platforms.create(TILESIZE, TILESIZE, 'platform');
  ceiling.body.imovable = true;
  for(var index = 2; index < 39; index++){
    ceiling = platforms.create(TILESIZE * index, TILESIZE, 'platform');
    ceiling.body.imovable = true;
  }

  // Place the floor as well.
  var platform = platforms.create(TILESIZE, TILESIZE * 29, 'platform');
  platform.body.imovable = true;
  for(var index = 2; index < 39; index++){
    platform = platforms.create(TILESIZE * index, TILESIZE * 29, 'platform');
    platform.body.imovable = true;
  }

  // Screw it. Let's program some procedural platforms.
  // To do this we're going to need a window group.


  // Start by going line by line.
  // Start one row low because the ceiling already occupies the top row.
  for(var rows = 2; rows < 29; rows++){
    // Then go column by column.
    // Pick a random number between 1 and 38 inclusive
    // Skip that number.
    // We need to gauruntee a hole that the player can jump through.
    var skip = game.rnd.integer() % 37 + 1;
    for(var columns = 1; columns < 39; columns++){
      // Generate a random number.
      // This one should be a fraction.
      var prob = game.rnd.frac();
      // Experiment with different percentages.
      if (columns != skip && prob > 0.5){
        // Create a platform.
        platform = platforms.create(
            TILESIZE * columns,
            TILESIZE * rows,
            'platform'
          );
        platform.body.imovable = true;

        // Check to create a window garden.
        // Generate a random number.
        // This should also be a fraction.
        prob = game.rnd.frac();
        if (prob > 0.5){
          // place a window.
        }
      }
    }
  }

  // Place the walls.
  walls = game.add.group();
  walls.enableBody = true;

  var wall = walls.create(TILESIZE, TILESIZE, 'wall');
  wall.body.imovable = true;
  for (var index = 2; index < 29; index++){
    wall = walls.create(TILESIZE, TILESIZE * index, 'wall');
    wall.body.imovable = true;
  }

  // Do the right wall as well.
  for (var index = 1; index < 29; index++){
    wall = walls.create(TILESIZE * 39, TILESIZE * index, 'wall');
    wall.body.imovable = true;
  }
};

// Ruin Gardens
function update(){

};
