// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Bot.Configuration;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// AppSettings represents an appsettings file which contains configuration info and a <see cref="BotSettings"/>.
    /// </summary>
    /// <remarks> It should be loaded from an appsettings.json file on disk.
    public class AppSettings
    {
        /// <summary>
        /// Path to the appsettings.json file.
        /// </summary>
        [JsonIgnore]
        private string appSettingsPath;

        public AppSettings()
        {
            this.BotSettings = new BotSettings();
        }

        public AppSettings(string appSettingsPath)
        {
            this.appSettingsPath = appSettingsPath;
            this.BotSettings = new BotSettings();
        }

        [JsonExtensionData(ReadData = true, WriteData = true)]
        /// <summary>
        /// Gets or sets properties that are not otherwise defined.
        /// </summary>
        public JObject Properties { get; set; } = new JObject();

        [JsonProperty("BotSettings")]
        /// <summary>
        /// <see cref="BotSettings"/>.
        /// </summary>
        private BotSettings BotSettings { get; set; }

        /// <summary>
        /// Load the AppSettings class from a specific file.
        /// </summary>
        /// <param name="file">AppSettings file.</param>
        /// <returns><see cref="AppSettings"/>.</returns>
        public static AppSettings Load(string file)
        {
            if (string.IsNullOrWhiteSpace(file))
            {
                throw new ArgumentNullException(file);
            }

#pragma warning disable VSTHRD002 // Avoid problematic synchronous waits
            var appSettings = LoadAsync(file).GetAwaiter().GetResult();
#pragma warning restore VSTHRD002 // Avoid problematic synchronous waits

            if (appSettings.BotSettings == null)
            {
                appSettings.BotSettings = new BotSettings();
            }

            return appSettings;
        }

        /// <summary>
        /// Load an appsettings file containing a <see cref="BotSettings"/>.
        /// </summary>
        /// <param name="file">Path to the appsettings file.</param>
        /// <returns><see cref="Task"/> of <see cref="AppSettings"/>.</returns>
        public static async Task<AppSettings> LoadAsync(string file)
        {
            if (string.IsNullOrWhiteSpace(file))
            {
                throw new ArgumentNullException(file);
            }

            var json = string.Empty;

            using (var stream = File.OpenText(file))
            {
                json = await stream.ReadToEndAsync().ConfigureAwait(false);
            }

            var appSettings = JsonConvert.DeserializeObject<AppSettings>(json);
            appSettings.appSettingsPath = file;

            return appSettings;
        }

        /// <summary>
        /// Save the appsettings file.
        /// </summary>
#pragma warning disable VSTHRD002 // Avoid problematic synchronous waits
        public void Save() => this.SaveAsAsync().GetAwaiter().GetResult();
#pragma warning restore VSTHRD002 // Avoid problematic synchronous waits

        /// <summary>
        /// Save the appsettings file.
        /// </summary>
        /// <returns><see cref="Task"/>.</returns>
        public async Task SaveAsAsync()
        {
            if (string.IsNullOrWhiteSpace(this.appSettingsPath))
            {
                throw new ArgumentException(nameof(this.appSettingsPath));
            }

            // Make sure that all dispatch serviceIds still match services that are in the bot
            foreach (var dispatchService in this.BotSettings.Services.Where(s => s.Type == ServiceTypes.Dispatch).Cast<DispatchService>())
            {
                dispatchService.ServiceIds = dispatchService.ServiceIds
                        .Where(serviceId => this.BotSettings.Services.Any(s => s.Id == serviceId))
                        .ToList();
            }

            await this.WriteAppSettingsAsync();
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

            this.BotSettings.ConnectService(newService);
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

            this.BotSettings.DisconnectService(serviceId);
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

            return this.BotSettings.FindService(id);
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
        /// Gets a list of <see cref="ConnectedService"/> by its type.
        /// </summary>
        /// <typeparam name="T"><see cref="ConnectedService"/>'s type.</typeparam>
        /// <returns>List of <see cref="ConnectedService"/>.</returns>
        public IEnumerable<T> GetServicesByType<T>()
            where T : ConnectedService
        {
            return this.BotSettings.GetServicesByType<T>();
        }

        /// <summary>
        /// Sets the <see cref="BotSettings"/>'s name.
        /// </summary>
        /// <param name="name"><see cref="BotSettings"/>'s name.</param>
        public void SetName(string name)
        {
            this.BotSettings.Name = name;
        }

        /// <summary>
        /// Sets the <see cref="BotSettings"/>'s description.
        /// </summary>
        /// <param name="description"><see cref="BotSettings"/>'s description.</param>
        public void SetDescription(string description)
        {
            this.BotSettings.Description = description;
        }

        /// <summary>
        /// Gets the <see cref="BotSettings"/>'s name.
        /// </summary>
        /// <returns><see cref="BotSettings"/>'s name.</returns>
        public string GetName()
        {
            return this.BotSettings.Name;
        }

        /// <summary>
        /// Gets the <see cref="BotSettings"/>'s description.
        /// </summary>
        /// <returns><see cref="BotSettings"/>'s description.</returns>
        public string GetDescription()
        {
            return this.BotSettings.Description;
        }

        /// <summary>
        /// Gets the <see cref="AppSettings"/> file path.
        /// </summary>
        /// <returns><see cref="AppSettings"/> file path.</returns>
        public string GetPath()
        {
            return this.appSettingsPath;
        }

        /// <summary>
        /// Writes the appsettings file.
        /// </summary>
        /// <returns><see cref="Task"/>.</returns>
        private async Task WriteAppSettingsAsync()
        {
            var jsonData = System.IO.File.ReadAllText(this.appSettingsPath);
            jsonData = JsonConvert.SerializeObject(this, Formatting.Indented);
            System.IO.File.WriteAllText(this.appSettingsPath, jsonData);
        }
    }
}
