// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Microsoft.Bot.Configuration;

    /// <summary>
    /// Repository Pattern class for managing <see cref="appSettings"/>.
    /// </summary>
    public class SettingsRepository : IBotConfigurationRepository, IDisposable
    {
        /// <summary>
        /// <see cref="SettingsRepository"/> instance.
        /// </summary>
        private static SettingsRepository instance = null;

        /// <summary>
        /// <see cref="appSettings"/>.
        /// </summary>
        private AppSettings appSettings;

        private SettingsRepository()
        {
            var fss = FileSystemService.GetInstance();

            // Path to the appsettings.json file under the selected project's directory
            string path = fss.GetFileInProject("appsettings.json", SearchOption.TopDirectoryOnly);

            // If no file are found, we define our appsettings.json file
            if (string.IsNullOrWhiteSpace(path))
            {
                path = Path.Combine(fss.GetProjectDirectoryPath(), "appsettings.json");
            }

            if (File.Exists(path))
            {
                appSettings = AppSettings.Load(path);
            }
            else
            {
                // if the Appsettings file doesn't exist, we create a new file and add it to the project
                appSettings = new AppSettings(path);
                File.Create(path).Dispose();
                fss.AddFileToProject(path);

                // Also, as the appsettings configuration has just been created, we set its name and description to string.empty
                appSettings.SetName(string.Empty);
                appSettings.SetDescription(string.Empty);
            }
        }

        /// <summary>
        /// Returns the Repository instance.
        /// </summary>
        /// <returns><see cref="SettingsRepository"/>.</returns>
        public static SettingsRepository GetInstance()
        {
            if (instance == null)
            {
                instance = new SettingsRepository();
            }

            // else
            // {
            //    // If the instance exists, reload it
            //    instance.Load(instance.appSettings.GetPath());
            // }

            return instance;
        }

        /// <summary>
        /// Connect a <see cref="ConnectedService"/> to the bot.
        /// </summary>
        /// <param name="newService"><see cref="ConnectedService"/> to add.</param>
        public void ConnectService(ConnectedService newService)
        {
            if (newService == null)
            {
                throw new ArgumentNullException(nameof(newService));
            }

            this.appSettings.ConnectService(newService);
        }

        /// <summary>
        /// Disconnect a <see cref="ConnectedService"/> by its ID.
        /// </summary>
        /// <param name="serviceId"><see cref="ConnectedService"/>'s ID.</param>
        public void DisconnectService(string serviceId)
        {
            if (string.IsNullOrEmpty(serviceId))
            {
                throw new ArgumentNullException(nameof(serviceId));
            }

            this.appSettings.DisconnectService(serviceId);
        }

        /// <summary>
        /// Gets a <see cref="ConnectedService"/> by its ID.
        /// </summary>
        /// <param name="id"><see cref="ConnectedService"/>'s ID.</param>
        /// <returns><see cref="ConnectedService"/></returns>
        public ConnectedService FindService(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            return this.appSettings.FindService(id);
        }

        /// <summary>
        /// Edits a <see cref="ConnectedService"/> from the <see cref="appSettings"/> configuration.
        /// </summary>
        /// <param name="service"><see cref="ConnectedService"/> to edit.</param>
        public void EditService(ConnectedService service)
        {
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service));
            }

            DisconnectService(service.Id);
            ConnectService(service);
        }

        /// <summary>
        /// Returns the <see cref="appSettings"/>'s enpoints list.
        /// </summary>
        /// <returns>List of <see cref="EndpointService"/>.</returns>
        public IEnumerable<ConnectedService> GetEndpoints()
        {
            return this.appSettings.GetServicesByType<EndpointService>();
        }

        /// <summary>
        /// Decrypt all values in the in memory config.
        /// </summary>
        /// <param name="secret">Secret to encrypt.</param>
        public void Decrypt(string secret)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Encrypt all values in the in memory config.
        /// </summary>
        /// <param name="secret">Secret to encrypt.</param>
        public void Encrypt(string secret)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Load the AppSettings class from a specific file.
        /// </summary>
        /// <param name="file">AppSettings file.</param>
        /// <param name="secret">secret.</param>
        public void Load(string file, string secret = null)
        {
            var appsettings = AppSettings.Load(file);

            if (appsettings != null)
            {
                this.appSettings = appsettings;
            }
        }

        /// <summary>
        /// Save the appsettings file.
        /// </summary>
        /// <param name="secret">secret.</param>
        public void Save(string secret = null)
        {
            this.appSettings.Save();
        }

        /// <summary>
        /// Gets the <see cref="BotSettings"/>'s name.
        /// </summary>
        /// <returns><see cref="BotSettings"/>'s name.</returns>
        public string GetName()
        {
            return this.appSettings.GetName();
        }

        /// <summary>
        /// Sets the <see cref="BotSettings"/>'s name.
        /// </summary>
        /// <param name="name"><see cref="BotSettings"/>'s name.</param>
        public void SetName(string name)
        {
            this.appSettings.SetName(name);
        }

        /// <summary>
        /// Gets the <see cref="BotSettings"/>'s description.
        /// </summary>
        /// <returns><see cref="BotSettings"/>'s description.</returns>
        public string GetDescription()
        {
            return this.appSettings.GetDescription();
        }

        /// <summary>
        /// Sets the <see cref="BotSettings"/>'s description.
        /// </summary>
        /// <param name="description"><see cref="BotSettings"/>'s description.</param>
        public void SetDescription(string description)
        {
            this.appSettings.SetDescription(description);
        }

        public void Dispose()
        {
            this.appSettings = null;
            instance = null;
        }
    }
}
