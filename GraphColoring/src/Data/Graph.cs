using static Pathfinding.Pathfinding;

namespace Data
{
    public class Graph
    {
        public Dictionary<string, Node> nodes { get; }
        public Graph(IEnumerable<string> nodes, Dictionary<string, List<string>> connections)
        {
            this.nodes = new Dictionary<string, Node>();
            foreach(string id in nodes)
            {
                this.nodes.Add(id, new Node(id, new HashSet<Node>()));
            }
            foreach(var n in connections)
            {
                foreach(var item in n.Value)
                {
                    this.nodes[n.Key].AddNeighbour(this.nodes[item]);
                }
            }

            StartPathfinding(this.nodes.Values);

            Console.WriteLine(string.Join(Environment.NewLine, this.nodes.Select(i => i.Key + ": " + i.Value)));
        }

        public Dictionary<string, int?> GetColoring()
        {
            return nodes.ToDictionary(n => n.Key, n => n.Value.color);
        }
    }
}