
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
    // first item of the array specifies the surface id, the second number is the patch id
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
          console.log("color doubled");
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
          if(this.colors[color - 1][i] != undefined) {
            if(this.mids.includes(this.colors[color - 1][i])) {
              counter++;
              console.log(this.colors[color - 1][i]);
            }
          }
          i++;
        }
        if(counter != 0) {
          flag = false;
        }
        if(!flag){
          console.log("double mid");
          console.log("counter: " + counter);
          console.log("color: " + color + " at pos " + pos);
          console.log("colors: " + this.colors[color - 1]);
          console.log("mids: " + this.mids);
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
