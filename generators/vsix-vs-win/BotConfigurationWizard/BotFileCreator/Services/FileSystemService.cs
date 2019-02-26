// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System.IO;
    using System.Linq;

    /// <summary>
    /// Provides several methods related to the Project's files.
    /// </summary>
    public static class FileSystemService
    {
        /// <summary>
        /// Adds a file to the select project.
        /// </summary>
        /// <param name="projectPath">Project's path</param>
        /// <param name="file">File's name</param>
        public static void AddFileToProject(string projectPath, string file)
        {
            // Load a specific project. Also, avoids several problems for re-loading the same project more than once
            var project = Microsoft.Build.Evaluation.ProjectCollection.GlobalProjectCollection.LoadedProjects.FirstOrDefault(pr => pr.FullPath == projectPath);
            project = project == null ? new Microsoft.Build.Evaluation.Project(projectPath) : project;

            if (project != null)
            {
                // Reevaluates the project to add any change
                project.ReevaluateIfNecessary();

                // Checks if the project has a file with the same name. If it doesn't, it will be added to the project
                if (project.Items.FirstOrDefault(item => item.EvaluatedInclude == file) == null)
                {
                    project.AddItem("Compile", file);
                    project.Save();
                }
            }
        }

        /// <summary>
        /// Gets the selected project's directory path.
        /// </summary>
        /// <returns>Selected project's directory path.</returns>
        public static string GetProjectDirectoryPath()
        {
            var projectPath = FileSystemService.GetSelectedProjectPath();
            return projectPath.Substring(0, projectPath.LastIndexOf('\\'));
        }

        /// <summary>
        /// Gets a file in a specific project's directory. If no file are found, returns an empty string.
        /// </summary>
        /// <param name="filePath">Project's directory.</param>
        /// <param name="searchPattern">Pattern to search in a specific project's directory.</param>
        /// <param name="searchOption"><see cref="SearchOption"/>.</param>
        /// <returns>File's path.</returns>
        public static string GetFileInProject(string filePath, string searchPattern, SearchOption searchOption)
        {
            var file = Directory.EnumerateFiles(filePath, searchPattern, searchOption).FirstOrDefault();

            return file ?? string.Empty;
        }

        /// <summary>
        /// Gets the Selected Project Path.
        /// </summary>
        /// <returns>Selected Project Path.</returns>
        public static string GetSelectedProjectPath()
        {
            return GeneralSettings.Default.ProjectName;
        }

        /// <summary>
        /// Gets a specific project property.
        /// </summary>
        /// <param name="projectPath">Project file path.</param>
        /// <param name="property">Property name.</param>
        /// <returns>Project Property Value.</returns>
        public static string GetProjectProperty(string projectPath, string property)
        {
            var project = FileSystemService.LoadProject(projectPath);

            if (project == null)
            {
                return null;
            }

            var prop = project.GetProperty(property);

            if (prop == null)
            {
                return null;
            }

            return prop.UnevaluatedValue.ToString();
        }

        /// <summary>
        /// Sets a <see cref="Microsoft.Build.Evaluation.Project"/> property if exists or creates it if its doesn't.
        /// </summary>
        /// <param name="projectPath">Project file path.</param>
        /// <param name="property">Property name.</param>
        /// <param name="unevaluatedValue">Property value.</param>
        /// <returns>Project Property Value.</returns>
        public static string SetProjectProperty(string projectPath, string property, string unevaluatedValue)
        {
            var project = FileSystemService.LoadProject(projectPath);

            if (project == null)
            {
                return null;
            }

            var prop = project.SetProperty(property, unevaluatedValue);

            project.Save();

            return prop.UnevaluatedValue.ToString();
        }

        /// <summary>
        /// Loads a <see cref="Microsoft.Build.Evaluation.Project"/>.
        /// </summary>
        /// <param name="projectPath">Project File path.</param>
        /// <returns><see cref="Microsoft.Build.Evaluation.Project"/>.</returns>
        private static Microsoft.Build.Evaluation.Project LoadProject(string projectPath)
        {
            // Load a specific project. Also, avoids several problems for re-loading the same project more than once
            var project = Microsoft.Build.Evaluation.ProjectCollection.GlobalProjectCollection.LoadedProjects.FirstOrDefault(pr => pr.FullPath == projectPath);
            return project == null ? new Microsoft.Build.Evaluation.Project(projectPath) : project;
        }
    }
}
