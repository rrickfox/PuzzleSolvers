using System.Runtime.CompilerServices;
using Data;

namespace Coloring
{
    public static class Coloring
    {
        public static void StandardColoring(ICollection<Node> nodes)
        {
            var tempNodes = nodes.ToHashSet();
            var seenNodes = new HashSet<Node>();

            List<List<Node>> colors = new List<List<Node>>();

            while(tempNodes.Count > 0)
            {
                Node? mostNeighbours = tempNodes.MaxBy(n => n.degree);
                if (mostNeighbours == null) throw new NullReferenceException();
                // Console.WriteLine(mostNeighbours);

                tempNodes.Remove(mostNeighbours);
                List<Node> l = new List<Node> {mostNeighbours};
                Node? next = null;
                do
                {
                    next = tempNodes.Where( // only nodes that don't neighbour nodes already selected
                        n => n.neighbours.Except(seenNodes).Intersect(l).Count() == 0
                    ).OrderByDescending(
                        n => n.neighbours.Except(seenNodes).Where(
                            x => x.neighbours.Except(seenNodes).Intersect(l).Count() > 0
                        ).Count()
                    ).ThenBy(
                        n => n.neighbours.Except(seenNodes).Except(l).Count()
                    ).FirstOrDefault();

                    if (next == null)
                        Console.WriteLine("No next value found!");
                    else
                    {
                        l.Add(next);
                        tempNodes.Remove(next);
                        // Console.WriteLine(next);
                    }
                } while(next != null);

                Console.WriteLine(colors.Count + ": [" + string.Join(", ", l.Select(n => n.id)) + "]");

                colors.Add(l);
                seenNodes.UnionWith(l);
            }

            foreach(var (l, color) in colors.Select((item, index) => (item, index)))
            {
                foreach(var node in l)
                {
                    node.color = color;
                }
            }
        }
    }
}