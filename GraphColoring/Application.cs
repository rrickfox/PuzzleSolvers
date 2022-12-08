using Data;
using Newtonsoft.Json;

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
        Console.WriteLine("Hello Richard");
        Dictionary<string, List<string>> obj = LoadJson("input.json");
        // Console.WriteLine(string.Join(Environment.NewLine, obj));
        Graph g = new Graph(obj.Keys, obj);
    }
}