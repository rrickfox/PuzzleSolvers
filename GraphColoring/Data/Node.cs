namespace Data;

public class Node
{
    public string id { get; }
    public ISet<Node> neighbours { get; }
    public int degree => neighbours.Count; 
    public int? color { get; private set; }

    public Node(string id, ISet<Node> neighbours, int? color = null)
    {
        this.id = id;
        this.neighbours = neighbours;
        this.color = color;
    }

    public bool AddNeighbour(Node neighbour)
    {
        return neighbours.Add(neighbour);
    }

    public override string ToString()
    {
        return "("
            + this.id
            + "), Color: "
            + Convert.ToString(this.color)
            + ", Neighbours: {"
            + string.Join(", ", this.neighbours.Select(i => i.id))
            + "}";
    }
}