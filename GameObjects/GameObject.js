class GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.CONFIG = CONFIG;

    //Every game object
    this.init();
  }

  init() {}

  update() {}

  render() {
    if (this.CONFIG.debug) {
      let bb = this.getBoundingBox();
      this.context.strokeStyle = "red";
      this.context.translate(bb.x, bb.y);
      this.context.strokeRect(0, 0, bb.w, bb.h);
      this.context.resetTransform();
    }
  }

  getImageSpriteCoordinates(sprite) {
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
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
    };
  }
}

export default GameObject;
