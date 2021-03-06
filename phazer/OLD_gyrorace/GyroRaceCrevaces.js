var phaser_Width = 1000
var phaser_Height = 600;



// var game = new Phaser.Game(144, 100, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(phaser_Width, phaser_Height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var faster = 0

function initSocketIO()
{
  iosocket = io.connect();
  console.log('io !');
  iosocket.on('onconnection', function(value) {
  faster = value.pollOneValue; // recieve start poll value from server



  // recieve changed values by other client from server
  iosocket.on('updateData', function (recievedData) {
    faster = recievedData.pollOneValue; // recieve start poll value from server
    console.log("faster "+ faster);
  });

    });
}

initSocketIO()


function preload()
{
    /**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/wyjRVmAf
 *
 * This source requires Phaser 2.6.2
 */


    // Script entier en mode strict
    "use strict";
    var v = "Allo ! Je suis en mode strict !";

    // game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    // game.load.image('phaser', 'sprites/phaser-dude.png');


    //  37x45 is the size of each frame

    //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
    //  blank frames at the end, so we tell the loader how many to load

    game.load.spritesheet('blob_01_walk', 'sprites/blob_01_walk_47_64_5.png', 47, 64, 5);
    game.load.spritesheet('blob_02_walk', 'sprites/blob_02_walk_47_64_5_gauche.png', 47, 64, 5);


    game.load.audio('boden', 'musique.mp3');


}

var cursors;
var position = 100;
var terrain_De_Base;
var terrain_De_Base_J2;
var position_terrain_J1 = 0;
var position_terrain_J2 = 0;
var longueur_Du_Monde = 10000;
var angle_J1 = 0;
var angle_J2 = 0;
var phaser_01;
var phaser_02;
var position_blob_J1 = 0;
var position_blob_J2 = 0;
var vitesse_global_terrin = 1;
var vitesse_global_blob = 1 * vitesse_global_terrin;
var blob_01_walk;
var blob_02_walk;
var group_Graph;


var backgroundMusic;


function create()
{

    "use strict";

    var img_Par_Seconde = 60;
    var seconde_Min_Finir_le_jeu = 15;

    var vitesse_De_Base = longueur_Du_Monde / (img_Par_Seconde * seconde_Min_Finir_le_jeu);

    // bleu sur 10000
    terrain_De_Base =
    [
        2000, 1000, 4050, 1000, 2000
    ];

    // blanc sur 10000
    terrain_De_Base_J2 =
    [
        2000, 1000, 4050, 1000, 2000
    ];

    // sur 10000
    terrain_De_Base =
    [
        500, 1000, 1500, 500, 3000, 500, 1500, 500, 500, 500
    ];

    // blanc sur 10000
    terrain_De_Base_J2 =
    [
        500, 1000, 1500, 500, 3000, 500, 1500, 500, 500, 500
    ];

    cursors = game.input.keyboard.createCursorKeys();



    blob_01_walk = game.add.sprite(50, 100, 'blob_01_walk');

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    var walk_01 = blob_01_walk.animations.add('walk');

    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    blob_01_walk.animations.play('walk', 10, true);




    blob_02_walk = game.add.sprite(50, 100, 'blob_02_walk');

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    var walk_02 = blob_02_walk.animations.add('walk');

    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes
    blob_02_walk.animations.play('walk', 10, true);



    group_Graph = game.add.group();

    backgroundMusic = game.add.audio('boden');
    backgroundMusic.loop = true; // This is what you are lookig for
    backgroundMusic.play();


}

function is_Sur_De_La_Terre_02(pj_local_relatif, monde)
{

    var is_Sol_Solide_01 = true;

    var index_section;

    /// les 2 sur 10 000
    var pj_Local = pj_local_relatif;

    for (var i = 0; i < terrain_De_Base.length; i++)
    {

        pj_Local = pj_Local - terrain_De_Base[i];

        if (pj_Local < 0)
        {
            index_section = i;
            break;
        }

    }


    if ((index_section % 2) == 0)
    {
        is_Sol_Solide_01 = true;
    }
    else
    {
        is_Sol_Solide_01 = false;
    }


    return is_Sol_Solide_01;
}

function is_Sur_De_La_Terre(position_du_joueur, offset_Monde_01, offset_Monde_02)
{


    // sur 10 000
    var pj_local_relatif = position_du_joueur * 10 - offset_Monde_01;

    var index_section;

    var is_Sol_Solide = false;

    var is_Sol_Solide_01 = false;

    var is_Sol_Solide_01 = is_Sur_De_La_Terre_02(pj_local_relatif, terrain_De_Base)

    // sur 10 000
    var pj_local_relatif = position_du_joueur * 10 - offset_Monde_02;

    var is_Sol_Solide_02 = false;
    var is_Sol_Solide_02 = is_Sur_De_La_Terre_02(pj_local_relatif, terrain_De_Base_J2)

    if (is_Sol_Solide_01 || is_Sol_Solide_02)
    {
        is_Sol_Solide = true;
    }

    return is_Sol_Solide;
}

function netoyer(graphics)
{
    /// Font blanc
    graphics.beginFill(0x000000, 1);
    //// draw a rectangle
    graphics.drawRect(0, 0, phaser_Width, phaser_Height);

    graphics.endFill();
}

function rafraichir_Position()
{



    /// avance doucement tout seul
    position += 1;

    // droite
    if (cursors.right.isDown || faster >= 2)
    {
        console.log("cursor faster= ")
        console.log(faster)
        position += 5;
        position_terrain_J1 += 10 * vitesse_global_terrin;
    }

    // gauche
    if (cursors.left.isDown )
    {
        position -= 5;
        position_terrain_J2 -= 10 * vitesse_global_terrin;
    }

    position_terrain_J1 += 1 * vitesse_global_terrin;
    position_terrain_J2 -= 1 * vitesse_global_terrin;

    position_terrain_J1 = position_terrain_J1 % 10000;
    position_terrain_J2 = position_terrain_J2 % 10000;

    position_blob_J1 += 0.5 * vitesse_global_blob;
    position_blob_J2 -= 0.2 * vitesse_global_blob;

    // position_blob_J1 = position_blob_J1 % 1000;
    // position_blob_J2 = position_blob_J2 % 1000;

    position = position % 1000;

    if (position_blob_J1 > 500)
    {
        position_blob_J1 -= 2;
    }

    if (position_blob_J2 < -500)
    {
        position_blob_J2 += 2;
    }


    while (is_Sur_De_La_Terre(position_blob_J1, position_terrain_J1, position_terrain_J2) == false)
    {
        position_blob_J1--;
    }

    /*

    while (is_Sur_De_La_Terre(position_blob_J2, position_terrain_J1, position_terrain_J2) == false)
    {
        position_blob_J2--;
    }

    */



}

function afficher_Joueur()
{

    var j1_interne = position_blob_J1 + 750;

    // le rayon
    var r = 270;

    var xoffset = 300;
    var yoffset = 300;

    /// droite
    var degre_01 = (j1_interne * Math.PI) / 500;
    blob_01_walk.x = (r * Math.cos(degre_01)) + xoffset;
    blob_01_walk.y = (r * Math.sin(degre_01)) + yoffset;
    blob_01_walk.angle = 90 + (j1_interne * Math.PI) / 8.7;



    var j2_interne = position_blob_J2 + 750;

    /// gauche
    var degre_02 = (j2_interne * Math.PI) / 500;
    blob_02_walk.x = (r * Math.cos(degre_02)) + xoffset;
    blob_02_walk.y = (r * Math.sin(degre_02)) + yoffset;
    blob_02_walk.angle = 90 + (j2_interne * Math.PI) / 8.7;


}

function afficher_Terrain_Rond(graphics)
{

    // create a group myGraphic = game.add.graphics(0,0);
    // create graphicmyGraphic.beginFill(0x00FFFF, 1);
    // paint graphic a colourmyGraphic.boundsPadding = 0;myGraphic.drawRect(0, 0, 100, 100);
    // draw graphic to screen myGroup.add(myGraphic);
    // add graphic to group myText = game.add.text(0,0,"text",{font:"bold 12px Arial",fill:"#000"});
    // create text myGroup.add(myText); // add text to group myGroup.visible = false;
    // hide myGraphic AND myText myGroup.visible = true;
    // show myGraphic AND myText




    /*


    var graphics = game.add.graphics(0, 0);




    var position_terrain = position_terrain_J1;


    graphics.beginFill(0x800080, 0.5);

    for (var i = 0; i < terrain_De_Base.length; i++)
    {

        position_terrain = position_terrain % longueur_Du_Monde;

        if ((i % 2) == 0)
        {

            var x_01 = (position_terrain * phaser_Width) / longueur_Du_Monde;

            position_terrain += terrain_De_Base[i];

            var x_02 = (position_terrain * phaser_Width) / longueur_Du_Monde;

            var longeur_Rectangle = x_02 - x_01;

            //// draw a rectangle
            graphics.drawRect(x_01, 120, longeur_Rectangle, 50);

            console.log(position_terrain);

        }
        else
        {
            position_terrain += terrain_De_Base[i];

            console.log(position_terrain);
        }

    }

    graphics.endFill();

    var graphics = game.add.graphics(0, 0);
    position_terrain = position_terrain_J2;
    graphics.beginFill(0x000000, 0.5);

    for (var i = terrain_De_Base.length -1; i > 0; i--)
    {

        position_terrain = position_terrain % longueur_Du_Monde;

        if ((i % 2) == 0)
        {

            var x_01 = (position_terrain * phaser_Width) / longueur_Du_Monde;

            position_terrain += terrain_De_Base[i];

            var x_02 = (position_terrain * phaser_Width) / longueur_Du_Monde;

            var longeur_Rectangle = x_02 - x_01;

            //// draw a rectangle
            graphics.drawRect(x_01, 120, longeur_Rectangle, 50);

            console.log(position_terrain);

        }
        else
        {
            position_terrain += terrain_De_Base[i];

            console.log(position_terrain);
        }

    }

    graphics.endFill();

*/



    position_terrain = position_terrain_J1;

    //  And this draws a filled arc
    graphics.beginFill(0x18FFFF, 0.5);


    var offset_Total = -85;

    for (var i = 0; i < terrain_De_Base.length; i++)
    {

        position_terrain = position_terrain % longueur_Du_Monde;


        if ((i % 2) == 0)
        {



            var x_01 = ((position_terrain * 360) / longueur_Du_Monde) + offset_Total;

            position_terrain += terrain_De_Base[i];

            var x_02 = ((position_terrain * 360) / longueur_Du_Monde) + offset_Total;

            //  Note the 'true' at the end, this tells it to draw anticlockwise
            graphics.arc(300, 300, 200, game.math.degToRad(x_02), game.math.degToRad(x_01), true);



        }
        else
        {
            position_terrain += terrain_De_Base[i];

        }

    }

    graphics.endFill();



    position_terrain = position_terrain_J2;




    //  This will reset the lineStyle
    graphics.lineStyle(0);

    //  And this draws a filled arc
    graphics.beginFill(0xFFFFFF, 0.5);



    for (var i = 0; i < terrain_De_Base.length; i++)
    {

        position_terrain = position_terrain % longueur_Du_Monde;


        if ((i % 2) == 0)
        {

            var x_01 = (position_terrain * 360) / longueur_Du_Monde + offset_Total;

            position_terrain += terrain_De_Base_J2[i];

            var x_02 = (position_terrain * 360) / longueur_Du_Monde + offset_Total;

            var longeur_Rectangle = x_02 - x_01;

            //  Note the 'true' at the end, this tells it to draw anticlockwise
            graphics.arc(300, 300, 200, game.math.degToRad(x_02), game.math.degToRad(x_01), true);


            // console.log(position_terrain);

        }
        else
        {
            position_terrain += terrain_De_Base_J2[i];

            // console.log(position_terrain);
        }

    }

    graphics.endFill();



    /*


        var x_01 = -100;
        var x_02 = 100;
        var longeur_Rectangle = x_02 - x_01;


        graphics.beginFill(0x80FF80, 1);
        graphics.lineStyle(2, 0x80FF80, 1);

        //// draw a rectangle
        graphics.drawRect(x_01, 500, longeur_Rectangle, 50);

        graphics.endFill();


    */





}

function update()
{

    rafraichir_Position();



    group_Graph.removeAll(); /// tout efacer du groupe
    group_Graph = game.add.group(); myGraphic = game.add.graphics(0, 0);
    myGraphic = game.add.graphics(0, 0);
    var graphics = game.add.graphics(0, 0);


    afficher_Terrain_Rond(myGraphic);

    group_Graph.add(myGraphic);

    afficher_Joueur();

}

function render()
{

}
