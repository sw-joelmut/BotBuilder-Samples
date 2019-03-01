
using System.Collections.Generic;

namespace BotFileCreator
{
    public static class SecretManagerUtilities
    {
        public static void UserSecretSetCommand(string key, string value)
        {
            CLIHelper.RunCommand(UserSecretCommand(key, value));
        }

        private static string UserSecretCommand(string key, string value)
        {
            var fileSystemService = FileSystemService.GetInstance();

            //// TODO: Implement logic to get the project GUID for user secret manager
            var projectID = "GUIDEchoBot1ToTestVSX";

            return $"/C cd {fileSystemService.GetProjectDirectoryPath()} & dotnet user-secrets set {key} {value} --id {projectID}";
        }

        private static string UserSecretListCommand(string key, string value)
        {
            var fileSystemService = FileSystemService.GetInstance();

            //// TODO: Implement logic to get the project GUID for user secret manager
            var projectID = "GUIDEchoBot1ToTestVSX";

            return $"/C cd Desktop & dotnet user-secrets list --id {projectID}";
        }

        private static IEnumerable<string> GetUserSecrets(string projectID)
        {

            CLIHelper.RunCommand(UserSecretCommand(key, value));
        }
    }
}
