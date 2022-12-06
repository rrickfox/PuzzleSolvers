
function pretty_n(n) {
  if(n < 1000) {
    return n;
  } else if(n < 1000000) {
     return Math.round(n/1000.0) + "K";
  } else {
     return Math.round(n/1000000.0) + "M";
  }
}

function calculate_solutions(output) {
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

output.innerHTML = JSON.stringify(solutions);


// mode 0: 364 solutions, 9812215 nodes tested
// mode 1: 0 solutions, 373732 nodes tested
// mode 2: 64 solutions, 44007493 nodes tested



//while n
//  n.verbose()
//  nodes = n.generate_children()
//  n = nodes[0]
//end

}