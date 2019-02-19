// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System.Collections.Generic;

    public class BotSettings
    {
        public string Name { get; set; }

        public List<BotService> Services { get; set; } = new List<BotService>();
    }
}
