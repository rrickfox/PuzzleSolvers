
class Node {

  // a node encapsulates everything to start an search procedure, hence to generate children nodes
  // by placing new stones
  //   id; some id or count
  //   stones: the list of stones which have not yet been placed, already placed stone (and the pos) stored in the history
  //   cube: holds the actual coloring, nil if no color/stone is assigne yet
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
    console.log("next position:")
    console.log(JSON.stringify(this.pos));
    console.log("-------------------------------------");
  }  
  }
}
