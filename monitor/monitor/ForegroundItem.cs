using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;

namespace monitor
{
    public class ForegroundItem
    {
        public string ExecutableName { get; }
        public string ProcessName { get; }
        public string WindowTitle { get; }

        public ForegroundItem(string executableName, string processName, string windowTitle)
        {
            ExecutableName = executableName;
            ProcessName = processName;
            WindowTitle = windowTitle;
        }
        public static int WINDOW_TITLE_LENGTH = 256;
    }
}
