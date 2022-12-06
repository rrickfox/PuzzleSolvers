#include <vector>

using namespace std;

enum block {NONE, WHITE, BLACK};

class Stone
{
    public:
        Stone();
        Stone(Stone&);
        int blacks;
        int whites;
        vector<Stone> history;
        Cube setStone(Cube, block, int, int, bool = false);
}