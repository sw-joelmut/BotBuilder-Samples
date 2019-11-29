// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Adapters.Slack;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Extensions.DependencyInjection;
using SlackAdapterBot.Bots;

namespace SlackAdapterBot
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();

            // Create the Bot Framework Slack Adapter.
            services.AddSingleton<IBotFrameworkHttpAdapter, SlackAdapter>();

            // Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
            services.AddTransient<IBot, EchoBot>();

            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
