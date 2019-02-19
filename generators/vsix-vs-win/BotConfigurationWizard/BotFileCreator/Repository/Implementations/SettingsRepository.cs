// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class SettingsRepository : IBotConfigurationRepository
    {
        private static SettingsRepository instance = null;

        private BotSettings _botSettings;

        public SettingsRepository()
        {
            this._botSettings = new BotSettings();
        }

        public static SettingsRepository GetInstance()
        {
            if (instance == null)
            {
                instance = new SettingsRepository();
            }

            return instance;
        }

        public IEnumerable<BotService> GetEndpoints()
        {
            return this._botSettings.Services.Where(service => service.Type == ServiceTypes.Endpoint);
        }

        public void ConnectService(BotService newService)
        {
            if (newService == null)
            {
                throw new ArgumentNullException(nameof(newService));
            }

            this._botSettings.Services.Add(newService);
        }

        public void Decrypt(string secret)
        {
            throw new System.NotImplementedException();
        }

        public void DisconnectService(string serviceId)
        {
            throw new System.NotImplementedException();
        }

        public void Encrypt(string secret)
        {
            throw new System.NotImplementedException();
        }

        public void Load(string file, string secret = null)
        {
            throw new System.NotImplementedException();
        }

        public void Save(string secret = null)
        {
            throw new System.NotImplementedException();
        }
    }
}
