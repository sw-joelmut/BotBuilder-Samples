// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using Microsoft.Bot.Configuration;

    public static class ExtensionMethods
    {
        public static void SetUserSecrets(this EndpointService service)
        {
            var keyId = service.Id + ":";
            if (!string.IsNullOrEmpty(service.AppId))
            {
                SecretManagerUtilities.UserSecretSetCommand(keyId + nameof(service.AppId), service.AppId);
                service.AppId = string.Empty;
            }

            if (!string.IsNullOrEmpty(service.AppPassword))
            {
                SecretManagerUtilities.UserSecretSetCommand(keyId + nameof(service.AppPassword), service.AppPassword);
                service.AppPassword = string.Empty;
            }
        }

        public static void SetUserSecrets(this LuisService service)
        {
            var keyId = service.Id + ":";
            if (!string.IsNullOrEmpty(service.AuthoringKey))
            {
                SecretManagerUtilities.UserSecretSetCommand(keyId + nameof(service.AuthoringKey), service.AuthoringKey);
                service.AuthoringKey = string.Empty;
            }

            if (!string.IsNullOrEmpty(service.SubscriptionKey))
            {
                SecretManagerUtilities.UserSecretSetCommand(keyId + nameof(service.SubscriptionKey), service.SubscriptionKey);
                service.SubscriptionKey = string.Empty;
            }
        }

        public static void SetUserSecrets(this QnAMakerService service)
        {
            var keyId = service.Id + ":";
            if (!string.IsNullOrEmpty(service.EndpointKey))
            {
                SecretManagerUtilities.UserSecretSetCommand(keyId + nameof(service.EndpointKey), service.EndpointKey);
                service.EndpointKey = string.Empty;
            }

            if (!string.IsNullOrEmpty(service.SubscriptionKey))
            {
                SecretManagerUtilities.UserSecretSetCommand(keyId + nameof(service.SubscriptionKey), service.SubscriptionKey);
                service.SubscriptionKey = string.Empty;
            }
        }
    }
}
