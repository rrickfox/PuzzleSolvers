
function set_stone(node, s, pos, i, swap = false) {
  //console.log("----------");
  //console.log("position: " + pos);
  //console.log("nextpos: "+ node.pos);
  if(pos != node.pos) {
    //console.log("invalid starting pos"); 
  } else {
    //console.log("valid starting pos");
  }   
  //console.log(node.stone.stones[s]);                                                             
  var pos1 = node.stone.positioning[pos][i];
  node.cube = node.stone.set_stone(node.cube, s, pos, pos1, swap);
  valid = node.projection.map_position_valid(pos, node.cube.cube[pos]);
  valid = valid && node.projection.map_position_valid(pos1, node.cube.cube[pos1]);
  if(!valid) {
    //console.log("invalid projection");
    //console.log("----------");
  } else {
    //console.log("valid projection");
    node.projection.map_position(pos, node.cube.cube[pos]);  
    node.projection.map_position(pos1, node.cube.cube[pos1]);
  }
  node.pos = node.cube.next_position();
  return node;
}

function test() {
  node = new Node();
  node.set_big_stone(0);
  //node.verbose();
  //console.log(node);
  
  
  // next position                        
  node = set_stone(node, 3, 2, 2);
  node = set_stone(node, 0, 8, 1, true);
  node = set_stone(node, 5, 18, 0, true);
  node = set_stone(node, 8, 20, 2, true);
  node = set_stone(node, 5, 24, 1);
  node = set_stone(node, 5, 26, 2, true);
  node = set_stone(node, 1, 1, 1);
  node = set_stone(node, 0, 5, 0, true);
  node = set_stone(node, 3, 19, 1, true);
  node = set_stone(node, 0, 15, 0);
  node = set_stone(node, 1, 17, 0);
  node = set_stone(node, 0, 16, 0);  
  
  node.verbose();
}

function test_with_children() {
  var node = new Node();
  node.set_big_stone(0);
  var children = [];
  var count = 0;
  var test = [[3,2,false], [0,1,true], [5,0,true], [8,2,true], [5,1,false], [5,2,true], [1,1,false], [0,0,true], [3,1,true], [0,0,false], [1,0,false], [0,0,false]];                    
  
  while(node.pos != -1) {
    //children = node.generate_children();  
    //console.log(children);
    for(var i = 0; i < children.length; i++) {
      //console.log("children: " + i);
      //console.log(children[i].stone.history[count][0] + " = " + test[count][0] + "||" + children[i].stone.history[count][2] + " = " + node.stone.positioning[node.pos][test[count][1]] + "||" + children[i].stone.history[count][3] + " = " + test[count][2])
      if(children[i].stone.history[count][0] == test[count][0] && children[i].stone.history[count][2] == node.stone.positioning[node.pos][test[count][1]] && children[i].stone.history[count][3] == test[count][2]) {
        node = children[i];            
        //console.log("--------------"); 
        break;     
      }    
    }
    //console.log(count+1);
    //node.verbose(); 
    count++;
  }
  node.verbose(); 
}

// order stone id
//set_stone(node, 0, 8, 1, true)
//set_stone(node, 1, 5, 0, true)
//set_stone(node, 2, 1, 1)
//set_stone(node, 3, 2, 2)
//set_stone(node, 4, 15, 0)
//set_stone(node, 5, 16, 0)
//set_stone(node, 6, 17, 0)
//set_stone(node, 7, 18, 0, true)
//set_stone(node, 8, 24, 1)
//set_stone(node, 9, 26, 2, true)
//set_stone(node, 10, 19, 1, true)
//set_stone(node, 11, 20, 2, true)
