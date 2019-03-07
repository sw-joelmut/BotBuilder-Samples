
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace BotFileCreator
{
    public static class SecretManagerUtilities
    {
        public static void UserSecretSetCommand(string key, string value)
        {
            var fileSystemService = FileSystemService.GetInstance();

            //// TODO: Implement logic to get the project GUID for user secret manager
            var projectID = "GUIDEchoBot1ToTestVSX";

            var command = $"/C cd {fileSystemService.GetProjectDirectoryPath()} & dotnet user-secrets set {key} {value} --id {projectID}";

            CLIHelper.RunCommand(command);
        }

        public static void UserSecretClearCommand()
        {
            var fileSystemService = FileSystemService.GetInstance();

            //// TODO: Implement logic to get the project GUID for user secret manager
            var projectID = "GUIDEchoBot1ToTestVSX";

            var command = $"/C cd {fileSystemService.GetProjectDirectoryPath()} & dotnet user-secrets clear --id {projectID}";

            CLIHelper.RunCommand(command);
        }

        public static void UserSecretRemoveCommand(string key)
        {
            var fileSystemService = FileSystemService.GetInstance();

            //// TODO: Implement logic to get the project GUID for user secret manager
            var projectID = "GUIDEchoBot1ToTestVSX";

            var command = $"/C cd {fileSystemService.GetProjectDirectoryPath()} & dotnet user-secrets remove {key} --id {projectID}";

            CLIHelper.RunCommand(command);
        }

        public static List<SecretValue> GetUserSecrets()
        {
            var userSercretRegex = new Regex(@"(.+)\:(.+)\=", RegexOptions.IgnoreCase);
            var servicesKeys = new List<SecretValue>();
            string userSecrets;
            CLIHelper.RunCommand(UserSecretListCommand(), out userSecrets);
            string[] userSecretsLines = Regex.Split(userSecrets, "\r\n");

            foreach (var line in userSecretsLines)
            {
                if (!userSercretRegex.IsMatch(line))
                {
                    continue;
                }

                string[] delimiters = new string[] { ":", " = " };
                string[] parts = line.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
                var service = new SecretValue();

                if (!servicesKeys.Exists(serv => serv.Id == parts[0]))
                {
                    service.Id = parts[0];
                    service.Keys.Add(parts[1], parts[2]);
                    servicesKeys.Add(service);
                }
                else
                {
                    servicesKeys.FirstOrDefault(serv => serv.Id == parts[0]).Keys.Add(parts[1], parts[2]);
                }
            }

            return servicesKeys;
        }

        private static string UserSecretListCommand()
        {
            var fileSystemService = FileSystemService.GetInstance();

            //// TODO: Implement logic to get the project GUID for user secret manager
            var projectID = "GUIDEchoBot1ToTestVSX";

            return $"/C cd Desktop & dotnet user-secrets list --id {projectID}";
        }
    }
}
