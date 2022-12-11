using Newtonsoft.Json;
using Data;
using static Coloring.Coloring;

class Application
{
    static Dictionary<string, List<string>> LoadJson(String filename)
    {
        using (StreamReader r = new StreamReader(filename))
        {
            string json = r.ReadToEnd();
            #nullable disable warnings
            return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json);
            #nullable restore warnings
        }
    }

    static void Main(string[] args)
    {
        Dictionary<string, List<string>> obj = LoadJson("input.json");
        Graph g = new Graph(obj.Keys, obj);
        Console.WriteLine();
        StandardColoring(g.nodes.Values);

        Dictionary<string, int?> coloring = g.GetColoring();
        Console.WriteLine(JsonConvert.SerializeObject(coloring, Formatting.Indented));
        File.WriteAllTextAsync("output.json", JsonConvert.SerializeObject(coloring, Formatting.Indented));
    }
}