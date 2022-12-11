namespace Data
{
    public class Node
    {
        public string id { get; }
        public ICollection<Node> neighbours { get; }
        public int degree => neighbours.Count; 
        public int? color { get; set; }
        public Dictionary<Node, int?> distanceToOthers { get; } = new Dictionary<Node, int?>();

        public Node(string id, ICollection<Node> neighbours, int? color = null)
        {
            this.id = id;
            this.neighbours = neighbours;
            this.color = color;
        }

        public void AddNeighbour(Node neighbour, int? distance = null)
        {
            neighbours.Add(neighbour);
        }

        public override string ToString()
        {
            return "("
                + this.id
                + "), Color: "
                + Convert.ToString(this.color)
                + ", Neighbours: {"
                + string.Join(", ", this.neighbours.Select(i => i.id))
                + "}, Distance to others: {"
                + string.Join(", ", this.distanceToOthers.Select(i => "(" + i.Key.id + ": " + Convert.ToString(i.Value) + ")"))
                + "}";
        }
    }
}