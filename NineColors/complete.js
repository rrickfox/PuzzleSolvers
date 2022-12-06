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
                [6, 7],
                [5, 9],
                [4, 1],
                [8, 6],
                [9, 8],
                [2, 3],
                [5, 4],
                [7, 5],
                [4, 6],
                [8, 3],
                [7, 9],
                [1, 2]
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
    this.stones.splice(id, 1);
    this.history.push([id, pos0, pos1, swap]);
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


/* ---------------------------------------------------------------------------------------------------- */


class Cube {

  // a cube has 27 positions starting from 0 to 26
  //
  // bottom slice
  //    6  7  8
  //   3  4  5
  //  0  1  2
  //
  // mid slice
  //    15 16 17
  //   12 13 14
  //  9 10 11
  //
  // top slice
  //   24 25 26
  //  21 22 23
  // 18 19 20
  //
  // it stores the actual colors (or nil if no stone has been placed at this position)

  //attr_reader :cube

  constructor(cube = null) {

  this.search_order = [
                  0, 2, 6, 8, 18, 20, 24, 26, // corners
                  1, 5, 7, 3, 19, 23, 25, 21, 9, 11, 15, 17, // edges
                  4, 10, 12, 14, 16, 22 // mids
                  // 13 not needed
                 ];

  // empty colors or copy from cube
    if(cube == null) {
      this.cube = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]; //array with 27 times set null
    } else {
      this.cube = JSON.parse(JSON.stringify(cube.cube));
    }
  }

  // finds the next empty position starting from pos
  // returns -1 if no position can be found (cube is done)
  // it is important to start with the corners, for example the next free position is 4 (a mid position)
  // in this case we only check for a placement together with the center, which is at that point of the search not valid
  // if we insist on postion 4 then we must consider all possible placements
  // therefore we start placements at positions were we really generate all possibilities, this is true for the corners
  // then we take the edges, here we can argue that the other placements towards the corners already considered by the
  // corners before, finally we go for the mids
  // the ceneter position 13 may not be investigated, if all other are not nil then we are done
  next_position() {
    var i = 0;
    while(i < 27) { //iterating through search_order, 27 is length of array
      if(this.cube[this.search_order[i]] == null) {
        return this.search_order[i];
      }
      i++;
    }
    return -1;
  }

}


/* ---------------------------------------------------------------------------------------------------- */


class Projection {

  // maps a position a the correct surface
  // each cube position (hence each color) is mapped to the a surface patch (except the central cube (position 13))
  //
  // a surface consists of 9 patches:
  //  6 7 8
  //  3 4 5
  //  0 1 2
  //
  // the cube has 6 surfaces:
  //   4
  // 0 1 2 3
  //   5
  //
  // 5 is bottom, gets folded backwards
  // 4 is top, gets folded backwards
  // 1 is front
  // 0 is left, gets folded backwards
  // 2 is right, gets folded backwards
  // 3 is back, gets double folded backwards
  //
  // the surface array holds the actual colors, nil means no color yet

  //attr_reader :projections

  // for each cube position 0-26 the corresponding surface patches are pre-calculated
  // we first define the surfaces which is mutch easier and calculate the mapping from this

  constructor(projection = null) {
  
    this.surfaces = [
                [6, 3, 0, 15, 12, 9, 24, 21, 18],
                [0, 1, 2, 9, 10, 11, 18, 19, 20],
                [2, 5, 8, 11, 14, 17, 20, 23, 26],
                [8, 7, 6, 17, 16, 15, 26, 25, 24],
                [18, 19, 20, 21, 22, 23, 24, 25, 26],
                [6, 7, 8, 3, 4, 5, 0, 1, 2]
               ];
  
    // specifies which block is found on which surfaces it is located
    // convert surfaces into a mapping
    // for each position we an array of arrays
    // first item of the array specifies the surfavce id, the second number is the patch id
    this.mappings = [[[0,2],[1,0],[5,6]],
                     [[1,1],[5,7]],[[1,2],[2,0],[5,8]],
                     [[0,1],[5,3]],
                     [[5,4]],
                     [[2,1],[5,5]],
                     [[0,0],[3,2],[5,0]],
                     [[3,1],[5,1]],
                     [[2,2],[3,0],[5,2]],
                     [[0,5],[1,3]],
                     [[1,4]],
                     [[1,5],[2,3]],
                     [[0,4]],
                     [],
                     [[2,4]],
                     [[0,3],
                     [3,5]],
                     [[3,4]],
                     [[2,5],[3,3]],
                     [[0,8],[1,6],[4,0]],
                     [[1,7],[4,1]],
                     [[1,8],[2,6],[4,2]],
                     [[0,7],[4,3]],
                     [[4,4]],
                     [[2,7],[4,5]],
                     [[0,6],[3,8],[4,6]],
                     [[3,7],[4,7]],
                     [[2,8],[3,6],[4,8]]];
  
  //defining corners, edges and mids for more advanced checking                   
  this.corners = [0, 2, 6, 8, 18, 20, 24, 26];
  this.edges = [1, 5, 7, 3, 19, 23, 25, 21, 9, 11, 15, 17];
  this.mids = [4, 10, 12, 14, 16, 22];

  // init from scratch of clone given projection
  if(projection == null) {
    // 6 projection surfaces and 9 patches each
    this.projections = [[null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null, null, null]];      
    this.middle = null;
    
    this.colors = [[], [], [], [], [], [], [], [], []];
  } else {
    this.projections = JSON.parse(JSON.stringify(projection.projections));
    this.colors = JSON.parse(JSON.stringify(projection.colors));
    this.middle = JSON.parse(JSON.stringify(projection.middle));
  }             

  

   // projects color to surface for a given position, runs through all patches
  this.map_position = function(pos, color) {
    if(pos != 13) {
      var i = 0;
      var len = this.mappings[pos].length;
      while(i < len) {
        this.projections[this.mappings[pos][i][0]][this.mappings[pos][i][1]] = color;
        i++;
      }
    } else {
      this.middle = color;
    }
    this.colors[color - 1].push(pos);
  };

  // projects color to surface for a given position, returns true if the surface is valid, otherwise false
  // the method stops if the first patch results in false, hence, not all patches may be added
  this.map_position_valid = function(pos, color) {
    var i = 0;
    var len = this.mappings[pos].length;
    var q;
    var flag = true;
    while(i < len) {
      projection = this.projections[this.mappings[pos][i][0]];
      q = 0;
      while(q < 9) {
        if(projection[q] == color) {
          flag = false;
          break;    
        }
        q++;
      }
      if(!flag){
        break;
      }
      i++;
    }
    
    if(flag) {
      if(this.mids.includes(pos)) {
        var i = 0;
        var counter = 0;
        while(i < 3) {
          if(this.colors[color -1][i] != undefined) {
            if(this.mids.includes(this.colors[color -1][i])) {
              counter++;
            }
          }
          i++;
        }
        flag = (counter > 1);
      } else if(this.corners.includes(pos)) {
        var i = 0;
        var counter = false;
        while(i < 3) {
          if(this.colors[color -1][i] != undefined) {
            if(this.corners.includes(this.colors[color -1][i])) {
              counter = true;
            }
          } 
          i++; 
        }
        if(counter && !(this.middle == null || this.middle == color)) {
          flag = false;  
        }   
      }
    }       
    return flag;
  };

  // allow only unique colors (or nil) for all surfaces
  /*def has_invalid_surface?()
    @projections.any? do |projection|
      colors = projection.compact
      colors.uniq.size != colors.size
    end
  end */
  }
}


/* ---------------------------------------------------------------------------------------------------- */


class Node {

  // a node encapsulates everything to start an search procedure, hence to generate children nodes
  // by placing new stones
  //   id; some id or count
  //   stones: the list of stones which have not yet been placed, already placed stone (and the pos) stored in the history
  //   cube: holds the actual coloring, nil if no color/stone is assigned yet
  //   projection: stores the colors when mapped to the surfaces of the cube
  //   history: initial placement of the big stone and all stones placed so far, allows to create the node from the very beginning
  //   pos: next position to be filled by a stone
  //

  //attr_reader :stone, :cube, :projection, :pos
  //attr_writer :pos

  // create from srcatch or copy
  constructor(node = null) {
    if(node == null) {
      this.stone = new Stone();
      this.cube = new Cube();
      this.projection = new Projection();
      this.pos = 0;
    } else {
      this.stone = new Stone(node.stone);
      this.cube = new Cube(node.cube);
      this.projection = new Projection(node.projection);
      this.pos = node.pos
    }
  


  // mode is 0, 1 or 2 and defines the initial placement of the big stone
  //   0: 2 corners and 1 edge
  //   1: 2 edges and 1 mid
  //   2: 2 mids and the center of the cube
  this.set_big_stone = function(mode = 0) {
    if(!([0, 1, 2].includes(mode))) {
      console.log("unknown mode");
      return false;
    } 

    this.stone.set_big_stone(this.cube, mode)
    var i = 0;
    while(i < 27) {
      if(this.cube.cube[i] != null) {
        this.projection.map_position(i, this.cube.cube[i]);
      }
      i++;
    }
    this.pos = this.cube.next_position();
  }


  // generates all child nodes of a given node, the cube may not be copleted yet, hence there muts be an empty position
  this.generate_children = function() {
    var children = [];
    
    var i = 0;
    var len = this.stone.positioning[this.pos].length;
    var q;
    var w;
    var len2;
    var swap = [false, true];
    var valid;
    while(i < len) {
      if(this.cube.cube[this.stone.positioning[this.pos][i]] == null) {
        len2 = this.stone.stones.length;
        q = 0;
        while(q < len2) {
          w = 0;
          while(w < 2) {
            var node = new Node(this);
            node.stone.set_stone(node.cube, q, this.pos, this.stone.positioning[this.pos][i], swap[w]);
            valid = node.projection.map_position_valid(this.pos, node.cube.cube[this.pos]);
            valid = valid && node.projection.map_position_valid(this.stone.positioning[this.pos][i], node.cube.cube[this.stone.positioning[this.pos][i]]);
            //console.log("q " + q + " swap " + swap[w] + " valid " + valid);
            if(valid) {
              node.projection.map_position(this.stone.positioning[this.pos][i], node.cube.cube[this.stone.positioning[this.pos][i]]);
              node.projection.map_position(this.pos, node.cube.cube[this.pos]);
              node.pos = node.cube.next_position();
              children.push(node);
            }
            w++;
          }
          q++;      
        }
      }
      i++;  
    }

    return children;
  }


  // prints the status of the node
  this.verbose = function() {
    console.log("-------------------------------------");
    console.log("stones:");
    console.log(JSON.stringify(this.stone.stones));
    console.log("history:");
    console.log(JSON.stringify(this.stone.history));
    console.log("cube:")
    console.log(JSON.stringify(this.cube.cube));
    console.log("projections:");
    console.log(JSON.stringify(this.projection.projections));
    console.log(JSON.stringify(this.pos));
    console.log("-------------------------------------");
  }  
  }
}


/* ---------------------------------------------------------------------------------------------------- */


function pretty_n(n) {
  if(n < 1000) {
    return n;
  } else if(n < 1000000) {
     return Math.round(n/1000.0) + "K";
  } else {
     return Math.round(n/1000000.0) + "M";
  }
}


// max length of queue if 123 (shown in experiments)
// min number of stones (0 if a solution has been found) 
// number of nodes worked on
n= 0
mode = 2

var node = new Node();
node.set_big_stone(mode)
var nodes = [node];

var solutions = [];
var children = [];
          
while(nodes.length > 0) {
  n++;
  node = nodes.shift();
  if(node.pos == -1) {
    node.verbose();
    solutions.push(node.stone.history);
    console.log(solutions.length + " " + pretty_n(n));
  } else {
    children = node.generate_children();
    nodes = children.concat(nodes);
  }
}

console.log("");
console.log("solutions found: " + solutions.length);
console.log("total nodes: " + n);


// rewrite, get rid of classes
/*solutions = solutions.map do |node|
  {
    history: node.stone.history,
    cube: node.cube.cube,
    projection: node.projection.projections.map { |projection| projection }
  }
end

File.open("solutions_//{mode}.json","w") do |fp|
  fp.write( JSON.dump(solutions))
end*/

//output.innerHTML = JSON.stringify(solutions);


// mode 0: 364 solutions, 9812215 nodes tested
// mode 1: 0 solutions, 373732 nodes tested
// mode 2: 64 solutions, 44007493 nodes tested



//while n
//  n.verbose()
//  nodes = n.generate_children()
//  n = nodes[0]
//end

