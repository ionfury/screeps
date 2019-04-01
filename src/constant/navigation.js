const direction = {
  n:{x:0,y:1},
  s:{x:0,y:-1},
  e:{x:1,y:0},
  w:{x:-1,y:0},
  nw:{x:-1,y:1},
  ne:{x:1,y:1},
  sw:{x:-1,y:-1},
  se:{x:1,y:1}
};

class Pos {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  from(pos) {
    this.x = pos.x;
    this.y = pos.y;
    return this;
  }

  step(cardinal, distance = 1) {
    let c = direction[cardinal];
    this.x+=c.x*distance;
    this.y+=c.y*distance;
    return this;
  }

  toString() {
    return `(x:${this.x}, y:${this.y})`
  }
}
module.exports = {
  pos: Pos
}