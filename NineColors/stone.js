// 1 red
// 2 white
// 3 light green
// 4 orange
// 5 black
// 6 magenta
// 7 yellow
// 8 dark green
// 9 blue

// 0 is reserved for no color


class Stone {

  constructor(stone = null) {
  
  if (stone == null) {
      // colors of the stones
      this.stones = [
                [6, 7, 0],
                [5, 9, 1],
                [4, 1, 2],
                [8, 6, 3],
                [9, 8, 4],
                [2, 3, 5],
                [5, 4, 6],
                [7, 5, 7],
                [4, 6, 8],
                [8, 3, 9],
                [7, 9, 10],
                [1, 2, 11]
               ];
      this.mode = null;
      this.history = [];
  } else {
      this.stones = JSON.parse(JSON.stringify(stone.stones));
      this.mode = JSON.parse(JSON.stringify(stone.mode));
      this.history = JSON.parse(JSON.stringify(stone.history));
  }
    
  this.big_stone = [3, 2, 1];
  
  // 0,2,6,8,18,20,24,26 >>> 8 corners, 3 options to put a stone
  // 1,5,7,3,19,23,25,21,9,11,15,17 >>> 12 edges, 2 options
  // 4,10,12,14,16,22 >>> 6 mids, 1 option
  // the center of the cube is already covered
  this.positioning = [];
  this.positioning[0] = [1, 3, 9];
  this.positioning[2] = [1, 5, 11];
  this.positioning[6] = [3, 7, 15];
  this.positioning[8] = [5, 7, 17];
  this.positioning[18] = [9, 19, 21];
  this.positioning[20] = [11, 19, 23];
  this.positioning[24] = [15, 21, 25];
  this.positioning[26] = [17, 23, 25];


  this.positioning[1] = [4, 10];
  this.positioning[5] = [4, 14];
  this.positioning[7] = [4, 16];
  this.positioning[3] = [4, 12];
  this.positioning[19] = [10, 22];
  this.positioning[23] = [14, 22];
  this.positioning[25] = [16, 22];
  this.positioning[21] = [12, 22];
  this.positioning[9] = [10, 12];
  this.positioning[11] = [10, 14];
  this.positioning[15] = [12, 16];
  this.positioning[17] = [14, 16];


  this.positioning[4] = [13];
  this.positioning[10] = [13];
  this.positioning[12] = [13];
  this.positioning[14] = [13];
  this.positioning[16] = [13];
  this.positioning[22] = [13];

    
  this.positioning[13] = [];


  //attr_reader :stones, :mode, :history

  // we store the history in the class as well, mode stores where initial big stone was set
  // the history just for each stone placed [id, pos0, pos1]
  // init with ids of stones
  //
  // start with empty stone or with a copy of the given one

    
  


  // assigns colors when the initail big stone is placed
  this.set_big_stone = function(c, mode) {
    if(mode == 0) {
      // 2 corners
      c.cube[0] = this.big_stone[0];
      c.cube[3] = this.big_stone[1];
      c.cube[6] = this.big_stone[2];
    } else if(mode == 1) {
      // 2 edges
      c.cube[1] = this.big_stone[0];
      c.cube[4] = this.big_stone[1];
      c.cube[7] = this.big_stone[2];
    } else {
      // 2 mids
      c.cube[10] = this.big_stone[0];
      c.cube[13] = this.big_stone[1];
      c.cube[16] = this.big_stone[2];
    }
    this.mode = mode;
    return c;
  };


  // sets the stone with given id at positions
  this.set_stone = function(c, id, pos0, pos1, swap = false) {
    if(swap) {
      c.cube[pos0] = this.stones[id][1];
      c.cube[pos1] = this.stones[id][0];
    } else {
      c.cube[pos0] = this.stones[id][0];
      c.cube[pos1] = this.stones[id][1];
    }                                                              
    this.history.push([this.stones[id][2], pos0, pos1, swap]);
    this.stones.splice(id, 1);
    return c;
  };


  // sets a stone but the positiong is derived from the array
  this.set_stone2 = function(c, id, pos0, i, swap = false) {
    var pos1 = this.positioning[pos0][i];
    c = set_stone(c, id, pos0, pos1, swap);
    return c;
  };
  }
}

