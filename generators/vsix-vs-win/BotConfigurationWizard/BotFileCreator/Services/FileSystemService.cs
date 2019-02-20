// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System.IO;
    using System.Linq;

    /// <summary>
    /// Provides several methods related to the Project's files.
    /// </summary>
    public class FileSystemService
    {
        /// <summary>
        /// Singleton instance of <see cref="FileSystemService"/>.
        /// </summary>
        private static FileSystemService instance = null;

        /// <summary>
        /// Selected project's name.
        /// </summary>
        private string _projectName;

        private FileSystemService()
        {
            this._projectName = GeneralSettings.Default.ProjectName;
        }

        /// <summary>
        /// Gets the <see cref="FileSystemService"/>'s Singleton instance.
        /// </summary>
        /// <returns><see cref="FileSystemService"/>.</returns>
        public static FileSystemService GetInstance()
        {
            if (instance == null)
            {
                instance = new FileSystemService();
            }

            return instance;
        }

        /// <summary>
        /// Adds a file to the select project.
        /// </summary>
        /// <param name="botFileName">File's name</param>
        public void AddFileToProject(string botFileName)
        {
            // Load a specific project. Also, avoids several problems for re-loading the same project more than once
            var project = Microsoft.Build.Evaluation.ProjectCollection.GlobalProjectCollection.LoadedProjects.FirstOrDefault(pr => pr.FullPath == _projectName);
            project = project == null ? new Microsoft.Build.Evaluation.Project(this._projectName) : project;

            if (project != null)
            {
                // Reevaluates the project to add any change
                project.ReevaluateIfNecessary();

                // Checks if the project has a file with the same name. If it doesn't, it will be added to the project
                if (project.Items.FirstOrDefault(item => item.EvaluatedInclude == botFileName) == null)
                {
                    project.AddItem("Compile", botFileName);
                    project.Save();
                }
            }
        }

        /// <summary>
        /// Gets the selected project's directory path.
        /// </summary>
        /// <returns>Selected project's directory path.</returns>
        public string GetProjectDirectoryPath()
        {
            return _projectName.Substring(0, _projectName.LastIndexOf('\\'));
        }

        /// <summary>
        /// Gets a file in the current selected project's directory. If no file are found, returns an empty string.
        /// </summary>
        /// <param name="searchPattern">Pattern to search in the current selected project's directory.</param>
        /// <param name="searchOption"><see cref="SearchOption"/>.</param>
        /// <returns>File's path.</returns>
        public string GetFileInProject(string searchPattern, SearchOption searchOption)
        {
            var file = Directory.EnumerateFiles(this.GetProjectDirectoryPath(), searchPattern, searchOption).FirstOrDefault();

            return file ?? string.Empty;
        }
    }
}
