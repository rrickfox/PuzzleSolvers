using Data;
using Newtonsoft.Json;

class Program
{
    static Dictionary<string, List<string>> LoadJson(String filename)
    {
        using (StreamReader r = new StreamReader(filename))
        {
            string json = r.ReadToEnd();
            return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json);
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