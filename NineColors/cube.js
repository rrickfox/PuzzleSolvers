
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
  

  // finds the next empty position starting from pos
  // returns -1 if no position can be found (cube is done)
  // it is important to start with the corners, for example the next free position is 4 (a mid position)
  // in this case we only check for a placement together with the center, whcih is at that point of the search not valid
  // if we insist on postion 4 then we must consider all possible placements
  // therefor we start placements at positions were we really generate all possibilities, this is true for the corners
  // then we take the edges, here we can argue that the other placements towards the corners already considered by the
  // corners before, finally we go for the mids
  // the ceneter position 13 may not be investigated, if all other are not nil then we are done
  this.next_position = function() {
    var i = 0;
    while(i < 26) { //iterating through search_order, 27 is length of array
      if(this.cube[this.search_order[i]] == null) {
        return this.search_order[i];
      }
      i++;
    }
    return -1;
  };
  }
}
