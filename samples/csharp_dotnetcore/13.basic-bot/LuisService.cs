using System.Collections.Generic;
using Microsoft.Bot.Builder.AI.Luis;
using Microsoft.Extensions.Configuration;
using System;

namespace Microsoft.BotBuilderSamples
{   
    public class LuisService
    {
        public LuisService(IConfiguration configuration)
        {
            if (string.IsNullOrEmpty(configuration["LuisAppId"]) || string.IsNullOrEmpty(configuration["LuisAPIKey"]) || string.IsNullOrEmpty(configuration["LuisAPIHostName"]))
            {
                return;
            }
        
            var luisApplication = new LuisApplication(
              configuration["LuisAppId"],
              configuration["LuisAPIKey"],
              "https://" + configuration["LuisAPIHostName"]
             );            
            var recognizer = new LuisRecognizer(luisApplication);
            this.Services = new Dictionary<string, LuisRecognizer>();
            var luisName = configuration["luisAppName"];
            this.Services.Add(luisName, recognizer);
        }

        public Dictionary<string, LuisRecognizer> Services { get; }
    }
}
