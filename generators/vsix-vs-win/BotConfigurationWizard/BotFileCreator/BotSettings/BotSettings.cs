// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Bot.Configuration;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// BotSettings represents a Bot configuration which is usually stored in a appsettings file.
    /// </summary>
    public class BotSettings
    {
        [JsonProperty("name")]
        /// <summary>
        /// Gets or sets the Bot's name.
        /// </summary>
        public string Name { get; set; }

        [JsonProperty("description")]
        /// <summary>
        /// Gets or sets the Bot's Description.
        /// </summary>
        public string Description { get; set; }

        [JsonProperty("version")]
        /// <summary>
        /// Gets or sets the Bot's version.
        /// </summary>
        public string Version { get; set; } = "2.0";

        [JsonProperty("services")]
        [JsonConverter(typeof(BotSettingsConverter))]
        /// <summary>
        /// Gets or sets the Bot's connected services.
        /// </summary>
        public List<ConnectedService> Services { get; set; } = new List<ConnectedService>();

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

            if (this.Services.Where(s => s.Type == newService.Type && s.Id == newService.Id).Any())
            {
                throw new Exception($"service with {newService.Id} is already connected");
            }
            else
            {
                // Assign a unique random id between 0-255 (255 services seems like a LOT of services
                var rnd = new Random();
                do
                {
                    newService.Id = rnd.Next(byte.MaxValue).ToString();
                }
                while (this.Services.Where(s => s.Id == newService.Id).Any());

                this.Services.Add(newService);
            }
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

            var service = this.FindService(serviceId);
            if (service != null)
            {
                this.Services.Remove(service);
            }
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

            return this.Services.FirstOrDefault(s => s.Id == id);
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
            return this.Services.OfType<T>();
        }

        /// <summary>
        /// Converter for strongly typed connected services.
        /// </summary>
        internal class BotSettingsConverter : JsonConverter
        {
            public override bool CanWrite => false;

            /// <summary>
            /// Checks whether the connected service can be converted to the provided type.
            /// </summary>
            /// <param name="objectType">Type to be checked for conversion. </param>
            /// <returns>Whether the connected service can be converted to the provided type.</returns>
            public override bool CanConvert(Type objectType) => objectType == typeof(List<ConnectedService>);

            /// <inheritdoc/>
            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                var services = new List<ConnectedService>();
                var array = JArray.Load(reader);
                foreach (var token in array)
                {
                    var type = token.Value<string>("type");
                    switch (type)
                    {
                        case ServiceTypes.Bot:
                            services.Add(token.ToObject<BotService>());
                            break;
                        case ServiceTypes.AppInsights:
                            services.Add(token.ToObject<AppInsightsService>());
                            break;
                        case ServiceTypes.BlobStorage:
                            services.Add(token.ToObject<BlobStorageService>());
                            break;
                        case ServiceTypes.CosmosDB:
                            services.Add(token.ToObject<CosmosDbService>());
                            break;
                        case ServiceTypes.Dispatch:
                            services.Add(token.ToObject<DispatchService>());
                            break;
                        case ServiceTypes.Endpoint:
                            services.Add(token.ToObject<EndpointService>());
                            break;
                        case ServiceTypes.File:
                            services.Add(token.ToObject<FileService>());
                            break;
                        case ServiceTypes.Luis:
                            services.Add(token.ToObject<LuisService>());
                            break;
                        case ServiceTypes.QnA:
                            services.Add(token.ToObject<QnAMakerService>());
                            break;
                        case ServiceTypes.Generic:
                            services.Add(token.ToObject<GenericService>());
                            break;
                        default:
                            System.Diagnostics.Trace.TraceWarning($"Unknown service type {type}");
                            services.Add(token.ToObject<ConnectedService>());
                            break;
                    }
                }

                return services;
            }

            /// <inheritdoc/>
            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) => throw new NotImplementedException();
        }
    }
}
