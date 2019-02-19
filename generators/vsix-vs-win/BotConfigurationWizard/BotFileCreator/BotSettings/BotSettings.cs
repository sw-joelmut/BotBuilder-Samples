// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;

namespace BotFileCreator
{
    public class BotSettings
    {
        public string Name { get; set; }

        public List<BotService> Services { get; set; } = new List<BotService>();
    }
}
