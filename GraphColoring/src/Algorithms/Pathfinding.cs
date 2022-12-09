using System.Runtime.CompilerServices;
using Data;

namespace Pathfinding
{
    public static class Pathfinding
    {
        public static void StartPathfinding(ICollection<Node> nodes)
        {
            var nodesSet = nodes.ToList();
            // var endPoints = nodes.OfType<EndPoint>().ToList();

            foreach (var start in nodesSet)
                start.FindAll(nodesSet);
        }
    }

    public static class PathfindingExtensions
    {
        private static ConditionalWeakTable<Node, NodeExtensionData> _DATA { get; } =
            new ConditionalWeakTable<Node, NodeExtensionData>();

        // distance value relative to start point of pathfinding
        private static int? GetPathDistance(this Node self)
            => _DATA.GetOrCreateValue(self).pathDistance;
        private static void SetPathDistance(this Node self, int? value)
            => _DATA.GetOrCreateValue(self).pathDistance = value;
        
        // wether a node was checked yet
        private static bool GetChecked(this Node self)
            => _DATA.GetOrCreateValue(self).alreadyChecked;
        private static void SetChecked(this Node self, bool value)
            => _DATA.GetOrCreateValue(self).alreadyChecked = value;
        
        // checks neighbourhood for necessary updates in pathfinding attributes
        private static void CheckNeighbourhood(this Node self)
        {
            var pathDistance = self.GetPathDistance();
            foreach (var otherNode in self.neighbours)
            {
                var otherPathDistance = otherNode.GetPathDistance();
                var newPathDistance = pathDistance + 1;
                if (otherPathDistance != null && otherPathDistance <= newPathDistance) continue;
                otherNode.SetPathDistance(newPathDistance);
            }
        }

        public static void FindAll(this Node self, ICollection<Node> nodes)
        {
            var tempNodes = nodes.ToHashSet();
            self.SetPathDistance(0);

            // calculates pathDistance and corresponding previousVertex for entire graph
            while (tempNodes.Any(n => n.GetPathDistance() != null && !n.GetChecked()))
            {
                // finds vertex with lowest pathDistance, updates its neighbourhood and removes it from tempVertices
                var minNode = tempNodes.Where(n => n.GetPathDistance() != null && !n.GetChecked()).MinBy(n => n.GetPathDistance());
                if (minNode == null) throw new NullReferenceException();
                minNode.CheckNeighbourhood();
                minNode.SetChecked(true);
                // tempVertices.Remove(minVertex);
            }

            // creates dictionary for saving path corresponding to end point
            foreach(var node in tempNodes)
            {
                self.distanceToOthers.Add(node, node.GetPathDistance());
            }

            // reset the temporary properties
            foreach (var node in nodes)
            {
                node.SetPathDistance(null);
                node.SetChecked(false);
            }
        }
        
        // // iterates over vertices in reverse order to determine path and translates it into a path of edges
        // private static List<RouteSegment> DetermineFoundPath(this EndPoint self, Vertex end)
        // {
        //     // return null if no path could be found
        //     if (end.GetPathDistance() == null)
        //         return null;

        //     // build the path of all vertices
        //     var vertexPath = new LinkedList<Vertex>();
        //     for (var tempEnd = end; tempEnd != self; tempEnd = tempEnd.GetPreviousVertex())
        //         vertexPath.AddFirst(tempEnd);
        //     vertexPath.AddFirst(self);

        //     // return the route segments composed of edges connecting the vertices
        //     // as well as the LaneType required at the vertex
        //     var path = vertexPath.ZipThree(
        //         vertexPath.Skip(1),
        //         vertexPath.Skip(2),
        //         (v1, v2, v3) =>
        //             new RouteSegment(edge: v1.GetEdge(v2), laneType: v2.SubRoute(v1.GetEdge(v2), v2.GetEdge(v3)))
        //     ).ToList();
        //     path.Add(new RouteSegment(
        //         edge: vertexPath.Last.Previous.Value.GetEdge(vertexPath.Last.Value),
        //         laneType: LaneType.Through // since last vertex is an EndPoint, LaneType must be Through
        //     ));
        //     return path;
        // }
    }
    
    public class NodeExtensionData
    {
        public int? pathDistance; // distance value relative to start point of pathfinding
        public bool alreadyChecked; // wether this node was checked yet
    }
}