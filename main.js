// We're going to need random number generation.

// Create constants that can be used later on.
// This is the height and width of the game.
var GAMEWIDTH   = 640;
var GAMEHEIGHT  = 480;

// Store 0 as "ORIGIN" for geometry purposes.
var ORIGIN = 0;

//  Store the DOM element you would like to append to.
var DOM = '';

// Divide the game space into tiles.
var TILESIZE = 16;

// Store the location where the images will be loaded from.
var imagefolder = 'Assets/images/';

// Global variables that are used by the phaser framework
// This is the actual game.
var game = new Phaser.Game(
    GAMEWIDTH,
    GAMEHEIGHT,
    Phaser.AUTO,
    DOM,
    {
        preload: preload,
        create: create,
        update: update
    }
);

// We need various functions to have access to the player character, Lemmy.
var lemmy;

// We need a variable that can handle the cursor keys.
var cursors;

// We need the platforms group to be available to all.
var platforms;

// We need the windows group to be available to all.
var windows;

// We also have a walls group.
var walls;

// Load the images
function preload() {
    game.load.image('background', imagefolder + 'Background.png');
    game.load.image('platform',   imagefolder + 'Platform.png');
    game.load.image('wall',       imagefolder + 'Wall.png');

    // Sprite sizes are inconsistent so there is no way to do these with constants
    // The only real way is to resize the window sprite.
    // I definitely do not feel like doing that.
    game.load.spritesheet('dog',    imagefolder + 'DogSprite.png', 16, 8);
    game.load.spritesheet('window', imagefolder + 'WindowSprite.png', 16, 16);
}

// Create the scene
function create() {
    // Physics is a perfectly fine way to do things for this.
    // The ARCADE engine has all the physics we need for a simple platformer

    // Let's just put in the keys first.
    // We need to be able to control the player.
    // This seems to not be working.
    cursors = game.input.keyboard.createCursorKeys();

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
    // For this we will need an index variable.
    // We will also be placing other platforms, so be ready for that.
    // Along with all that we also have gardens that will be distributed throughout the level
    // Skip is a variable that is used for certain calculations.
    // Prob is also a variable that is used for certain calculations.
    // A wall is a single instance of the walls group.
    var ceiling = platforms.create(TILESIZE, TILESIZE, 'platform'),
        platform = platforms.create(TILESIZE, TILESIZE * 29, 'platform'),
        index,
        garden,
        rows,
        columns,
        skip,
        prob,
        wall;

    ceiling.body.immovable = true;

    for (index = 2; index < 39; index = index + 1) {
        ceiling = platforms.create(TILESIZE * index, TILESIZE, 'platform');
        ceiling.body.immovable = true;
    }

    // Place the floor as well.
    platform.body.immovable = true;
    for (index = 2; index < 39; index = index + 1) {
        platform = platforms.create(TILESIZE * index, TILESIZE * 29, 'platform');
        platform.body.immovable = true;
    }

    // Screw it. Let's program some procedural platforms.
    // To do this we're going to need a window group.
    // Windows are where gardens are. So gardens are active windows.
    windows = game.add.group();
    windows.enableBody = true;

    // Start by going line by line.
    // Start one row low because the ceiling already occupies the top row.
    for (rows = 2; rows < 29; rows = rows + 1) {
        // Then go column by column.
        // Pick a random number between 1 and 38 inclusive
        // Skip that number.
        // We need to gauruntee a hole that the player can jump through.
        skip = game.rnd.integer() % 37 + 1;
        for (columns = 1; columns < 39; columns = columns + 1) {
            // Generate a random number.
            // This one should be a fraction.
            prob = game.rnd.frac();

            // Experiment with different percentages.
            if (columns !== skip && prob > 0.5) {
                // Create a platform.
                platform = platforms.create(
                    TILESIZE * columns,
                    TILESIZE * rows,
                    'platform'
                );
                platform.body.immovable = true;

                // Check to create a window garden.
                // Generate a random number.
                // This should also be a fraction.
                prob = game.rnd.frac();
                if (prob > 0.5) {
                    // place a window.
                    // The anchor point for a window will be 15 pixels offset.
                    // This will only be in he Y direction.
                    garden = windows.create(
                        TILESIZE * columns,
                        (TILESIZE * rows) - 15,
                        'window'
                    );
                    garden.body.immovable = true;

                    // Don't worry about the destroyed pic.
                    // You can set that when the player enters a garden.
                    // Instead just load the animation.
                    garden.animations.add('grow', [1, 2, 3, 4, 6, 7], 10, false);
                }
            }
        }
    }

    // Place the walls.
    walls = game.add.group();
    walls.enableBody = true;

    wall = walls.create(TILESIZE, TILESIZE, 'wall');
    wall.body.immovable = true;
    for (index = 2; index < 29; index = index + 1) {
        wall = walls.create(TILESIZE, TILESIZE * index, 'wall');
        wall.body.immovable = true;
    }

    // Do the right wall as well.
    for (index = 1; index < 29; index = index + 1) {
        wall = walls.create(TILESIZE * 39, TILESIZE * index, 'wall');
        wall.body.immovable = true;
    }

    // Load in the King Charles Spaniel
    // Put him in the center of the game.
    lemmy = game.add.sprite(game.world.width / 2, game.world.height / 2, 'dog');

    // Enable physics.
    game.physics.arcade.enable(lemmy);

    // Set up the physics properties.
    lemmy.body.bounce.y = 0.1;
    lemmy.body.gravity.y = 800;
    lemmy.body.collideWorldBounds = true;
    lemmy.anchor.setTo(0.5, 0.5);
    lemmy.body.setSize(8, 8);

    // There are two animations. Right and left run.
    lemmy.animations.add('left',   [1, 2, 3], 10, true);
    lemmy.animations.add('right',  [4, 5, 6], 10, true);
}

// Ruin Gardens
function update() {
    // The player needs to collide with the platforms and the walls.
    game.physics.arcade.collide(lemmy, platforms);
    game.physics.arcade.collide(lemmy, walls);

    // We don't want the player sliding around like he's on ice.
    lemmy.body.velocity.x = 0;

    // Handle Keyboard inputs.
    // Left
    // There is an error some where in this code block
    // It was causeing the program to crash
    // The actual error was that there was a typo in the create function
    // It was before the animations were loaded.
    // This meant that when lemmy.animations.play() was called, it crashed.
    if (cursors.left.isDown) {
        lemmy.body.velocity.x = -200;
        lemmy.animations.play('left');
    } else if (cursors.right.isDown) {
        // Right
        lemmy.body.velocity.x = 200;
        lemmy.animations.play('right');
    } else {
        // Default
        lemmy.animations.stop();
        lemmy.frame = 0;
    }

    // This is a platformer. There needs to be jumping.
    if (cursors.up.isDown && lemmy.body.touching.down) {
        lemmy.body.velocity.y = -200;
    }
}
