using System;
using System.Windows.Forms;

namespace monitor
{
    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var reporter = new Reporter("ws://localhost:3001/socket/monitor");
            var monitor = new Monitor(reporter.SendForegroundItem);
            Application.Run();
        }
    }
}
