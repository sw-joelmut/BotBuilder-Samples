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

        public BotService FindService(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            return this._botSettings.Services.FirstOrDefault(s => s.Id == id);
        }

        public void DisconnectService(string serviceId)
        {
            if (string.IsNullOrEmpty(serviceId))
            {
                throw new ArgumentNullException(nameof(serviceId));
            }

            var service = this.FindService(serviceId);
            if (service != null)
            {
                this._botSettings.Services.Remove(service);
            }
        }

        public void EditService(BotService newService)
        {
            if (newService == null)
            {
                throw new ArgumentNullException(nameof(newService));
            }

            DisconnectService(newService.Id);
            ConnectService(newService);
        }

        public void ConnectService(BotService newService)
        {
            if (newService == null)
            {
                throw new ArgumentNullException(nameof(newService));
            }

            if (this._botSettings.Services.Where(s => s.Type == newService.Type && s.Id == newService.Id).Any())
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
                while (this._botSettings.Services.Where(s => s.Id == newService.Id).Any());

                this._botSettings.Services.Add(newService);
            }
        }

        public IEnumerable<BotService> GetEndpoints()
        {
            return this._botSettings.Services.Where(service => service.Type == ServiceTypes.Endpoint);
        }

        public void Decrypt(string secret)
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
