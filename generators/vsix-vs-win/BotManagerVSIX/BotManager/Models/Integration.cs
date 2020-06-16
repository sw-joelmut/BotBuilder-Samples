using System;
using System.Collections.Generic;
using System.Diagnostics;
using Newtonsoft.Json;

namespace BotManagerVSIX.Models
{
    class Integration
    {
        public string EchoText(string text)
        {
            return ExecuteCommand($"echo { text }");
        }

        public string CheckResourceGroupExistence(string name)
        {
            return ExecuteCommand($"az group exists -n {name}");
        }

        public List<AzureSuscription> GetAzureSubscriptions()
        {
            var result = ExecuteCommand("az account list");

            return JsonConvert.DeserializeObject<List<AzureSuscription>>(result);
        }

        private string ExecuteCommand(string command)
        {
            // /c tells cmd that we want it to execute the command that follows and then exit.
            var processInfo = new ProcessStartInfo("cmd.exe", "/c " + command)
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
            };

            var process = Process.Start(processInfo);
            var output = process.StandardOutput.ReadToEnd();

            process.WaitForExit();
            process.Close();

            return output;
        }
    }
}
