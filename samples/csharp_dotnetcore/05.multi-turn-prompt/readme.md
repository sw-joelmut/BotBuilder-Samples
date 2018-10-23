This sample shows how to use the prompt classes included in `botbuilder-dialogs`. It demonstrates
a multi-turn dialog flow using a text prompt, a number prompt, and state accessors to store and retrieve values.

# Concepts introduced in this sample

## Prompts

A conversation between a bot and a user often involves asking (prompting) the user for information, parsing the user's response, and then acting on that information. This sample demonstrates how to prompt users for information using the different prompt types included in the [botbuilder-dialogs](https://github.com/microsoft/botbuilder-js/tree/master/libraries/botbuilder-dialogs) library
and supported by the SDK.

The `botbuilder-dialogs` library includes a variety of pre-built prompt classes, including text, number, and datetime types. This sample demonstrates using a text prompt to collect the user's name, then using a number prompt to collect an age.

# To try this sample

- Clone the samples repository

```bash
git clone https://github.com/Microsoft/botbuilder-samples.git
```

- **Optional**: Update the `appsettings.json` file under `botbuilder-samples/samples/csharp_dotnetcore/05.multi-turn-prompt` with your `botFileSecret`. For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

## Visual Studio

- Navigate to the samples folder (`botbuilder-samples/samples/csharp_dotnetcore/05.multi-turn-prompt`) and open `MultiTurnPromptsBot.csproj` in Visual Studio.
- From the **Startup Projects** select `MultiTurnPromptsBot`
- Run the project (press `F5` key).

## Visual Studio Code

- Open `botbuilder-samples/samples/csharp_dotnetcore/05.multi-turn-prompt` sample folder.
- Bring up a terminal, navigate to `botbuilder-samples/samples/csharp_dotnetcore/05.multi-turn-prompt` folder.
- Type `dotnet run`.

## Update packages

- In Visual Studio right click on the solution and select "**Restore NuGet Packages**".
  **Note:** this sample requires `Microsoft.Bot.Builder`, `Microsoft.Bot.Builder.Dialogs` and `Microsoft.Bot.Builder.Integration.AspNet.Core`.
- In Visual Studio Code type `dotnet restore`

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework emulator from [here](https://aka.ms/botframeworkemulator).

## Connect to bot using Bot Framework Emulator **V4**

- Launch the **Bot Framework Emulator**.
- **File** -> **Open Bot Configuration** and navigate to `botbuilder-samples/samples/csharp_dotnetcore/05.multi-turn-prompt` folder.
- Select `BotConfiguration.bot` file.

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run

```bash
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further reading

- [Prompt types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Waterfall dialogs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-dialogs/waterfall)
- [Ask the user questions](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-tutorial-waterfall?view=azure-bot-service-4.0&tabs=jstab)