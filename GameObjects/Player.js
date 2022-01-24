import GameObject from "./GameObject.js";
import PlayerProjectile from "./Projectiles.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.state = {
      velocity: 0, //Vertical Speed
      dx: 0, //Horizontal Move Direction
      dy: 1,
      lastDx: 1,
      currentKeys: [],
    };

    this.stats = {
      speed: 5, //Horizontal Speed
      gravity: 7, //Gravitational Acceleration
    };

    this.rateOfFire = 5;
    this.shootCoolDown = 0;
    this.shoot = false;

    this.nextPos = { x: null, y: null, width: this.width, height: this.height };
  }

  init() {
    //--------------------------
    //Check for Inputs
    //--------------------------

    //Keydown Event
    document.addEventListener("keydown", (event) => {
      this.state.currentKeys[event.code] = true;
      if (
        this.state.currentKeys["ArrowRight"] ||
        this.state.currentKeys["ArrowLeft"] ||
        this.state.currentKeys["Space"] ||
        this.state.currentKeys["KeyZ"]
      ) {
        event.preventDefault();
      }
    });
    //Keyup Event
    document.addEventListener("keyup", (event) => {
      this.state.currentKeys[event.code] = false;
    });

    //--------------------------
    //Set Player Spritesheets
    //--------------------------

    const framesize = {
      frameSize: {
        width: 48,
        height: 48,
      },
    };

    this.sprites = {
      idle: {
        src: "./assets/player/idle.png",
        frames: 4,
        fps: 4,
        ...framesize,
        image: null,
      },
      run: {
        src: "./assets/player/run.png",
        frames: 4,
        fps: 10,
        ...framesize,
        image: null,
      },
      jump: {
        src: "./assets/player/jump.png",
        frames: 3,
        fps: 3,
        ...framesize,
        image: null,
      },
      fall: {
        src: "./assets/player/fall.png",
        frames: 1,
        fps: 1,
        ...framesize,
        image: null,
      },
    };

    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });
  }

  update(deltaTime) {
    console.log(this.state.currentKeys);
    //--------------------------
    //Handle Input
    //--------------------------

    //Move Right/Left
    if (this.state.currentKeys["ArrowRight"]) {
      this.state.dx = 1;
    } else if (this.state.currentKeys["ArrowLeft"]) {
      this.state.dx = -1;
    } else {
      this.state.dx = 0;
    }

    //check last horizontal movement direction
    if (this.state.dx !== 0) this.state.lastDx = this.state.dx;

    //Jump
    if (this.state.currentKeys["Space"] && this.state.dy === 0) {
      this.state.velocity = -40;
      this.state.dy = -1;
    }

    //Shoot Projectiles
    setInterval(this.timeCycle, 50);

    //--------------------------
    //Physics Calculation
    //--------------------------

    this.nextPos.x = this.x;
    this.nextPos.y = this.y;

    //X-Axis
    this.nextPos.x += this.stats.speed * this.state.dx;

    //Y-Axis
    // Gravitation with Euler BW Algorithm
    if (this.state.dy !== 0) {
      this.state.velocity += (this.stats.gravity * deltaTime) / 50;
      this.nextPos.y += (this.state.velocity * deltaTime) / 50;

      if (this.state.velocity > 0) this.state.dy = 1;
      else this.state.dy = -1;
    }

    //--------------------------
    //Set Sprite State
    //--------------------------

    this.spriteState =
      this.state.dx === 0 && this.state.dy === 0
        ? "idle"
        : this.state.dx !== 0 && this.state.dy === 0
        ? "run"
        : this.state.dy === -1
        ? "jump"
        : "fall";

    console.log(this.spriteState);

    //--------------------------
    //Set Boundaries
    //--------------------------
    //right
    if (this.x + this.width / 2 > this.CONFIG.width) {
      this.colX = this.CONFIG.width - this.width / 2;
    }
    //left
    else if (this.x - this.width / 2 < 0) this.x = 0 + this.width / 2;

    //bottom
    if (this.y + this.height / 2 > this.CONFIG.height)
      this.colY = this.CONFIG.height - this.height / 2;
    //top
    else if (this.y - this.height / 2 < 0) this.y = 0 + this.height / 2;
  }

  render() {
    super.render();

    //--------------------------
    //Render Player
    //--------------------------

    //move canvas origin to x
    if (this.state.lastDx === 1) {
      this.context.translate(this.x, this.y);
    } else {
      this.context.translate(this.x + this.width, this.y);
    }

    this.context.scale(this.state.lastDx, 1); // Turn to current direction

    let coords = this.getImageSpriteCoordinates(this.sprites[this.spriteState]);

    //draw player image
    this.context.drawImage(
      this.sprites[this.spriteState].image, // the image
      coords.sourceX, //source x
      coords.sourceY, //source y
      coords.sourceWidth, //source width
      coords.sourceHeight, //source height
      0, //destination x
      0, //destination y
      this.width, //destination width
      this.height //destination height
    );
    //--------------------------
    //--------------------------

    this.context.resetTransform();
  }

  getImageSpriteCoordinates(sprite) {
    console.log(sprite);
    const frameX = Math.floor(
      ((performance.now() / 1000) * sprite.fps) % sprite.frames
    );

    const coords = {
      sourceX: frameX * sprite.frameSize.width,
      sourceY: 0,
      sourceWidth: sprite.frameSize.width,
      sourceHeight: sprite.frameSize.height,
    };

    return coords;
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();

    bb.x = bb.x;
    bb.y = bb.y;
    bb.w = bb.w;
    bb.h = bb.h;
    return bb;
  }

  timeCycle() {
    if (this.state.currentKeys["KeyZ"]) {
      if (shootCoolDown === 0) {
        this.shootCoolDown = rateOfFire;
        this.shoot = true;
      } else {
        this.shoot = false;
      }
    }
    if (this.shootCoolDown > 0) {
      this.shootCoolDown--;
    }
  }
}

export default Player;
