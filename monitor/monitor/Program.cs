using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            var monitor = new Monitor(OnGetForeground);
            Application.Run();
        }

        private static void OnGetForeground(ForegroundItem foreground)
        {
            Console.WriteLine(foreground.ExecutableName);
        }
    }
}
