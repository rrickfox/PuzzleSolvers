function load_json(mode) {
  if(mode == 0){
    return mode_0;
  } else if(mode == 2){
    return mode_2;
  }
}

function visualize(node, mode, output) {
  var stones = [
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
  
  var colors = ["red", "white", "lightgreen", "orange", "grey", "purple", "yellow", "green", "blue"];
  
  
  // defining modes for different positions
  // 0 : other pos is infront of pos
  // 1 : other pos is right of pos
  // 2: other pos is left of pos
  // 3: other pos is behind pos
  // 4: other pos is above/below pos
  var positioning = [
                  {1:1,3:3,9:4},  //bottom slice
                  {0:2,2:1,4:3,10:4},
                  {1:2,5:3,11:4},
                  {0:0,4:1,6:3,12:4},
                  {1:0,3:2,5:1,7:3,13:4},
                  {2:0,4:2,8:3,14:4},
                  {3:0,7:1,15:4},
                  {4:0,6:2,8:1,16:4},
                  {5:0,7:2,17:4},   
                  
                  {0:4,10:1,12:3,18:4},       //middle slice
                  {1:4,9:2,11:1,13:3,19:4},
                  {2:4,10:2,14:3,20:4},
                  {3:4,9:0,13:1,15:3,21:4},
                  {4:4,10:0,12:2,14:1,16:3,22:4},
                  {5:4,11:0,13:2,17:3,23:4},
                  {6:4,12:0,16:1,24:4},
                  {7:4,13:0,15:2,17:1,25:4},
                  {8:4,14:0,16:2,26:4},
                  
                  {9:4,19:1,21:3},    //top slice
                  {10:4,18:2,20:1,22:3},
                  {11:4,19:2,23:3},
                  {12:4,18:0,22:1,24:3},
                  {13:4,19:0,21:2,23:1,25:3},
                  {14:4,20:0,22:2,26:3},
                  {15:4,21:0,25:1},
                  {16:4,22:0,24:2,26:1},
                  {17:4,23:0,25:2}
                ];
  
  var history = node.history;
  if(mode == 0) {
    var count = 1;
    //console.log("big_stone: 0,3,6");
    document.getElementById("D0").style.border = "none";
    document.getElementById("D0").style.backgroundColor = colors[2];
    document.getElementById("D0").style.borderBottom = "2px solid black";
    document.getElementById("D0").style.borderLeft = "2px solid black";
    document.getElementById("D0").style.borderRight = "2px solid black";   
                                                                       
    document.getElementById("D3").style.border = "none";
    document.getElementById("D3").style.backgroundColor = colors[1];
    document.getElementById("D3").style.borderLeft = "2px solid black";
    document.getElementById("D3").style.borderRight = "2px solid black";
    
    document.getElementById("D6").style.border = "none";
    document.getElementById("D6").style.backgroundColor = colors[0];
    document.getElementById("D6").style.borderTop = "2px solid black";
    document.getElementById("D6").style.borderLeft = "2px solid black";
    document.getElementById("D6").style.borderRight = "2px solid black";
  } else if(mode == 2){
    var count = 0;
    //console.log("big_stone: 10,13,16");    
    document.getElementById("D10").style.border = "none"; 
    document.getElementById("D10").style.backgroundColor = colors[2];
    document.getElementById("D10").style.borderBottom = "2px solid black";
    document.getElementById("D10").style.borderLeft = "2px solid black";
    document.getElementById("D10").style.borderRight = "2px solid black";
                                                  
    document.getElementById("D13").style.border = "none";
    document.getElementById("D13").style.backgroundColor = colors[1];
    document.getElementById("D13").style.borderLeft = "2px solid black";
    document.getElementById("D13").style.borderRight = "2px solid black";
                              
    document.getElementById("D16").style.border = "none";
    document.getElementById("D16").style.backgroundColor = colors[0]; 
    document.getElementById("D16").style.borderTop = "2px solid black";
    document.getElementById("D16").style.borderLeft = "2px solid black";
    document.getElementById("D16").style.borderRight = "2px solid black";
  }
  var now;
  //console.log(stones);
  //console.log(colors);
  
  while(history.length > 0) {
    now = [];
    for(var i = 0; i < history.length; i++) {
      if(history[i][1] == count) {
        //console.log(JSON.stringify(history[i]));
        now = history[i];
        history.splice(i, 1);
      } else if(history[i][2] == count) {
        //console.log(JSON.stringify(history[i])); 
        now = history[i];
        history.splice(i, 1);
      }
    }
    if(now.length != 0){
      //console.log("--------------------");
      //console.log(now);
      var pos0 = now[1];
      var pos1 = now[2];
      if(now[3] === false) {
        //console.log(stones[now[0]]);
        //console.log("first: D" + now[1] + " " + colors[stones[now[0]][0]] + " ,second: D" + now[2] + " " + colors[stones[now[0]][1]]);
        document.getElementById("D" + pos0).style.backgroundColor = colors[stones[now[0]][0] - 1];
        document.getElementById("D" + pos1).style.backgroundColor = colors[stones[now[0]][1] - 1];
      } else {
        //console.log(stones[now[0]]);           
        //console.log("first: D" + now[1] + " " + colors[stones[now[0]][1]] + " ,second: D" + now[2] + " " + colors[stones[now[0]][0]]);
        document.getElementById("D" + pos0).style.backgroundColor = colors[stones[now[0]][1] - 1];
        document.getElementById("D" + pos1).style.backgroundColor = colors[stones[now[0]][0] - 1];
      }
      posi0 = positioning[pos0][pos1];
      posi1 = positioning[pos1][pos0];
      document.getElementById("D" + pos0).style.border = "none"; 
      document.getElementById("D" + pos1).style.border = "none";
      if(posi0 == 1 || posi0 == 2 || posi0 == 3 || posi0 == 4) {
        document.getElementById("D" + pos0).style.borderBottom = "2px solid black";
      }
      if(posi1 == 1 || posi1 == 2 || posi1 == 3 || posi1 == 4) {
        document.getElementById("D" + pos1).style.borderBottom = "2px solid black";
      }
      
      if(posi0 == 0 || posi0 == 2 || posi0 == 3 || posi0 == 4) {
        document.getElementById("D" + pos0).style.borderRight = "2px solid black";
      }
      if(posi1 == 0 || posi1 == 2 || posi1 == 3 || posi1 == 4) {
        document.getElementById("D" + pos1).style.borderRight = "2px solid black";
      }
      
      if(posi0 == 0 || posi0 == 1 || posi0 == 3 || posi0 == 4) {
        document.getElementById("D" + pos0).style.borderLeft = "2px solid black";
      }
      if(posi1 == 0 || posi1 == 1 || posi1 == 3 || posi1 == 4) {
        document.getElementById("D" + pos1).style.borderLeft = "2px solid black";
      }
      
      if(posi0 == 0 || posi0 == 1 || posi0 == 2 || posi0 == 4) {
        document.getElementById("D" + pos0).style.borderTop = "2px solid black";
      }
      if(posi1 == 0 || posi1 == 1 || posi1 == 2 || posi1 == 4) {
        document.getElementById("D" + pos1).style.borderTop = "2px solid black";
      }
    }
    count++;
  }
}