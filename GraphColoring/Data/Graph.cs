namespace Data;

public class Graph
{
    public IDictionary<string, Node> nodes { get; }
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

        Console.WriteLine(string.Join(Environment.NewLine, this.nodes));
    }
}