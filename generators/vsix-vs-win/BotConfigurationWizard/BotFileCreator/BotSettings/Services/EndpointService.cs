// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    public class EndpointService : BotService
    {
        public EndpointService()
            : base(ServiceTypes.Endpoint)
        {
        }

        public string AppId { get; set; }

        public string AppPassword { get; set; }

        public string Endpoint { get; set; }
    }
}
