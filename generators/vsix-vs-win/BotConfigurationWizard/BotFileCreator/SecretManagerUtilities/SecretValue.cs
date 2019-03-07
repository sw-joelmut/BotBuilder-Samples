// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;

namespace BotFileCreator
{
    public class SecretValue
    {
        public SecretValue()
        {
            Keys = new Dictionary<string, string>();
        }

        public Dictionary<string, string> Keys { get; set; }

        public string Id { get; set; }
    }
}
