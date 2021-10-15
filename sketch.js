var bg, bgImg
var player,playerImg
var angles = [210,200,190,180,170,160,150]
var angle 
var imageName = []
var timer = 20
var gameState = "play"
var bgImg
var camPosX = 800
var nosTime 

for (var i = 1; i<=21; i++){
  name = "Images/cycle/" + i + ".png"
  imageName.push(name)
}
console.log(imageName)

function preload(){
  bgImg1 = loadImage("Images/bgImg1.jpg");  
  bgImg2 = loadImage("Images/bgImg2.jpg");
  bgImg3 = loadImage("Images/bgImg3.jpg");
  bgImg4 = loadImage("Images/bgImg4.jpg");
  bgImg5 = loadImage("Images/bgImg5.jpg");

  playerImg = loadAnimation('Images/cycle/1.png', 'Images/cycle/2.png', 'Images/cycle/3.png', 'Images/cycle/4.png', 'Images/cycle/5.png', 'Images/cycle/6.png', 'Images/cycle/7.png', 'Images/cycle/8.png', 'Images/cycle/9.png', 'Images/cycle/10.png', 'Images/cycle/11.png', 'Images/cycle/12.png', 'Images/cycle/13.png', 'Images/cycle/14.png', 'Images/cycle/15.png', 'Images/cycle/16.png', 'Images/cycle/17.png', 'Images/cycle/18.png', 'Images/cycle/19.png', 'Images/cycle/20.png','Images/cycle/21.png')
  playerEndImg = loadAnimation("Images/cycle/6.png")
  roadImg = loadImage("Images/Road.png")

  tyreImg  = loadImage("Images/Tyre image.png");
  energyImg = loadImage("Images/energy.png");
  coneImg = loadImage("Images/Cone.png");
  pauseImg = loadImage("Images/Pause.png");
  gameOverImg = loadImage("Images/GameOver.png");
  restartImg = loadImage("Images/restart.png");
  nosImg = loadImage("Images/Nos bottle.png");
  
}

function setup(){
  createCanvas(displayWidth-30, displayHeight-135)
  //background image
  bg = createSprite(200,350, width, height);
  bgImg = bgImg1
  bg.addImage(bgImg4);
  bg.scale = 1
  bg.velocityX = -2

  nosTime = Math.round(random(1,15))
  console.log(nosTime)

  player = createSprite(250,475);
  player.addAnimation("player",playerImg);
  player.addAnimation("playerEnd",playerEndImg);
  player.scale = 0.6
  player.frameDelay = 2
  player.debug = false;
  player.setCollider("circle",0,0, 150)

  pause = createSprite(50,50);
  pause.addImage(pauseImg);
  pause.scale = 0.2

  invisibleGround = createSprite(width/2, 600, width, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(width/2, height/2-100)
  gameOver.addImage(gameOverImg)
  gameOver.visible = false

  restart =  createSprite(width/2, height/2)
  restart.addImage(restartImg)
  restart.scale = 0.15
  restart.visible = false;

  nos =  createSprite(width/2, height/2-200)
  nos.addImage(nosImg)
  nos.visible = false;

  energyGroup = new Group();
  obstacleGroup = new Group();
}

function draw() {
  
  background("#F8A45F");
  drawSprites();

  textSize(50)
  fill(0)
  text("Timer : " + timer, camera.position.x + 500, 60 )


  player.collide(invisibleGround)

  if(gameState === "play") {
    player.changeAnimation("player",playerImg);
    bg.velocityX = -2
    
    if(frameCount%30 === 0) {
      timer -= 1
    }

    if(player.y > invisibleGround.y+50) {
      player.y = invisibleGround.y-50
    }

    player.x = camera.position.x-camPosX
    camPosX -= 10
    if(player.x > camera.position.x + 700) {
      obstacleGroup.removeSprites();
      camPosX = 500
    }
    //console.log(player.y)
    //if( (keyDown("UP") || keyDown("SPACE")) && player.y > 350) {
    if( (keyDown("UP") || keyDown("SPACE")) ) {
      player.velocityY = -15;
    }
    
    player.velocityY += 0.8

    if(bg.x < 700){
      bg.x = width/2
    }

    spawnObstacles();
    
    /*
    if(timer === nosTime) {
      nos.visible = true
    }
    if(timer >= nosTime || timer <= nosTime+5) {
      if(player.isTouching(nos)) {
        obstacleGroup.removeSprites()
        player.velocityX += 5;
      }
    }
    if(timer === nosTime+5) {
      nos.visible = false
    }
    */
    
    if(timer === 10){
      spawnEngery();
    }
    
    if(timer === 1){
      energyGroup.removeSprites()
    }

    if(energyGroup.isTouching(player)) {
      energyGroup.removeSprites()
      timer = 20;
    }
    
    if(timer === 0  || obstacleGroup.isTouching(player)) {
      gameState = "end"
    }

    if(mousePressedOver(pause)) {
      gameState = "pause"
    }


  }

  else if(gameState === "pause") {
    player.changeAnimation("playerEnd",playerEndImg);
    player.velocityX = 0;
    player.velocityY = 0;
    bg.velocityX = 0;
    obstacleGroup.removeSprites();
    if(mousePressedOver(pause)) {
      gameState = "play"
    }
    textSize(50)
    fill(0)
    text("Game Paused!", width/2-150, height/2);
  }

  else if(gameState === "end") {
    player.changeAnimation("playerEnd",playerEndImg);
    player.velocityX = 0;
    player.velocityY = 0;
    bg.velocityX = 0;
    pause.visible = false;
    gameOver.visible = true
    restart.visible = true;  
    
    if(mousePressedOver(restart)) {
      location.reload();
    }
  }
}

function spawnEngery(){
  if(frameCount %50 === 0) { 
      energy = createSprite(player.x+50, height/2-200)
      energyGroup.add(energy);
      energy.addImage(energyImg)
      energy.scale = 0.2
  }
}

function spawnObstacles() {
  if(frameCount %130 === 0) { 
    var randomNumber = Math.round(random(1,2))
    var randomPosition = Math.round(random(width/2,width-100))
    if (randomPosition === player.x ) {
      randomPosition = player.x + 200
    }
    obstacles = createSprite(randomPosition, invisibleGround.y-20)
    obstacleGroup.add(obstacles);
    obstacles.debug = false;
    obstacles.setCollider("circle",0,0, 200)

    if(randomNumber === 1) {
      obstacles.addImage(tyreImg)
      obstacles.scale = 0.3
    }
    if(randomNumber === 2) {
      obstacles.addImage(coneImg)
      obstacles.scale = 0.2
    }
  }
}
