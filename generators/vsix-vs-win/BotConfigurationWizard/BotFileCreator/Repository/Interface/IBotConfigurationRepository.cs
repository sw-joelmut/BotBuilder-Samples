// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System.Collections.Generic;
    using Microsoft.Bot.Configuration;

    public interface IBotConfigurationRepository
    {
        IEnumerable<ConnectedService> Services { get; }

        /// <summary>
        /// Load
        /// </summary>
        /// <param name="file">file</param>
        /// <param name="secret">secret</param>
        void Load(string file, string secret = default(string));

        /// <summary>
        /// Save
        /// </summary>
        /// <param name="secret">secret</param>
        void Save(string secret = default(string));

        /// <summary>
        /// ConnectService
        /// </summary>
        /// <param name="service">service</param>
        void ConnectService(ConnectedService service);

        void EditService(ConnectedService service);

        /// <summary>
        /// DisconnectService
        /// </summary>
        /// <param name="serviceId">serviceId</param>
        void DisconnectService(string serviceId);

        /// <summary>
        /// Encrypt
        /// </summary>
        /// <param name="secret">secret</param>
        void Encrypt(string secret);

        /// <summary>
        /// Decrypt
        /// </summary>
        /// <param name="secret">secret</param>
        void Decrypt(string secret);

        /// <summary>
        /// Gets the Bot's endpoints.
        /// </summary>
        /// <returns>Bot's <see cref="EndpointService"/>.</returns>
        IEnumerable<ConnectedService> GetEndpoints();

        /// <summary>
        /// Gets the Bot's name.
        /// </summary>
        /// <returns>Bot's name.</returns>
        string GetName();

        /// <summary>
        /// Sets the Bot name
        /// </summary>
        /// <param name="name">Bot's name</param>
        void SetName(string name);

        bool HasUserSecret();

        void SetUserSecret(bool value);
    }
}
