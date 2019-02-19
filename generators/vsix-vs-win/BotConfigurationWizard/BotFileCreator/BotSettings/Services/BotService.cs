// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    public class BotService
    {
        public BotService(string type)
        {
            this.Type = type;
        }

        public string Type { get; set; }

        public string Name { get; set; }

        public string Id { get; set; }
    }
}
