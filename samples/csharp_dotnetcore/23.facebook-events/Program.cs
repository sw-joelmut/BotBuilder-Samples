// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Microsoft.BotBuilderSamples
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
                    Host.CreateDefaultBuilder(args)
                        .ConfigureWebHostDefaults(webBuilder =>
                        {
                            webBuilder
                                // Logging Options.
                                // Consider using Application Insights for your logging and metrics needs.
                                // https://azure.microsoft.com/en-us/services/application-insights/
                                // .UseApplicationInsights()
                                .UseStartup<Startup>();
                        });
    }
}


