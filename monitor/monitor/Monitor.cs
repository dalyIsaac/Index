using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

namespace monitor
{
    public delegate void OnGetForeground(ForegroundItem foreground);

    public class Monitor
    {
        private delegate void WinEventDelegate(IntPtr hWinEventHook, uint eventType, IntPtr hwnd, int idObject, int idChild, uint dwEventThread, uint dwmsEventTime);
        private readonly WinEventDelegate dele = null;
        private const uint WINEVENT_OUTOFCONTEXT = 0;
        private const uint EVENT_SYSTEM_FOREGROUND = 3;

        public OnGetForeground OnGetForeground;

        public Monitor(OnGetForeground onGetForeground)
        {
            OnGetForeground = onGetForeground;
            dele = new WinEventDelegate(WinEventProc);
            IntPtr m_hhook = SetWinEventHook(EVENT_SYSTEM_FOREGROUND, EVENT_SYSTEM_FOREGROUND, IntPtr.Zero, dele, 0, 0, WINEVENT_OUTOFCONTEXT);
        }

        private ForegroundItem GetForeground()
        {
            StringBuilder Buff = new StringBuilder(ForegroundItem.WINDOW_TITLE_LENGTH);
            IntPtr handle = GetForegroundWindow();
            GetWindowThreadProcessId(handle, out uint pid);
            Process p = Process.GetProcessById((int)pid);

            string processName = p.ProcessName;
            string executableName = p.MainModule.FileName;
            string windowTitle = GetWindowText(handle, Buff, ForegroundItem.WINDOW_TITLE_LENGTH) > 0 ? Buff.ToString() : "";

            var foreground = new ForegroundItem(executableName, processName, windowTitle);
            return foreground;
        }

        public void WinEventProc(IntPtr hWinEventHook, uint eventType, IntPtr hwnd, int idObject, int idChild, uint dwEventThread, uint dwmsEventTime)
        {
            OnGetForeground(GetForeground());
        }

        [DllImport("user32.dll")]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        static extern IntPtr SetWinEventHook(uint eventMin, uint eventMax, IntPtr hmodWinEventProc, WinEventDelegate lpfnWinEventProc, uint idProcess, uint idThread, uint dwFlags);

        [DllImport("user32.dll")]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        [DllImport("user32.dll")]
        public static extern IntPtr GetWindowThreadProcessId(IntPtr hWnd, out uint ProcessId);
    }
}
