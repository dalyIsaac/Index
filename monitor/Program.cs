using System;

namespace monitor
{
    class Program
    {
        static void Main(string[] args)
        {
            var reporter = new Reporter("ws://localhost:3001/socket/monitor");
        }
    }
}
