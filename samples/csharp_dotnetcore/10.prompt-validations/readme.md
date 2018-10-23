This sample shows how to use the prompt classes included in `botbuilder-dialogs`. This sample also demonstrates using the `ComponentDialog` class to encapsulate related sub-dialogs.Concepts introduced in this sample

## Prompts

A conversation between a bot and a user often involves asking (prompting) the user for information, parsing the user's response, and then acting on that information. This sample demonstrates how to prompt users for information and validate the incoming responses using the different prompt types included in the [botbuilder-dialogs](https://github.com/Microsoft/botbuilder-js/tree/master/libraries/botbuilder-dialogs) library.

The `botbuilder-dialogs` library includes a variety of pre-built prompt classes, including text, number, and datetime types. In this sample, each prompt is wrapped in a custom class that includes a validation function. These prompts are chained together into a `WaterfallDialog`, and the final results are stored using the state manager.

# To try this sample

- Clone the samples repository

```bash
git clone https://github.com/Microsoft/botbuilder-samples.git
```

- **Optional**: Update the `appsettings.json` file under `botbuilder-samples/samples/csharp_dotnetcore/10.prompt-validations` with your `botFileSecret`. For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

## Visual Studio

- Navigate to the samples folder (`botbuilder-samples/samples/csharp_dotnetcore/10.prompt-validations`) and open `PromptValidationsBot.csproj` in Visual Studio.
- From the **Startup Projects** select `PromptValidationsBot`
- Run the project (press `F5` key).

## Visual Studio Code

- Open `botbuilder-samples/samples/csharp_dotnetcore/10.prompt-validations` sample folder.
- Bring up a terminal, navigate to `botbuilder-samples/samples/csharp_dotnetcore/10.prompt-validations` folder.
- Type `dotnet run`.

## Update packages

- In Visual Studio right click on the solution and select "**Restore NuGet Packages**".

  **Note:** this sample requires `Microsoft.Bot.Builder.Dialogs` and `Microsoft.Bot.Builder.Integration.AspNet.Core`.

- In Visual Studio Code type `dotnet restore`

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework emulator from [here](https://aka.ms/botframeworkemulator).

## Connect to bot using Bot Framework Emulator V4

- Launch the **Bot Framework Emulator**.
- **File** -> **Open Bot Configuration** and navigate to `botbuilder-samples/samples/csharp_dotnetcore/10.prompt-validations` folder.
- Select `BotConfiguration.bot` file.

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run

```bash
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further  reading

- [Prompt types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=csharp)