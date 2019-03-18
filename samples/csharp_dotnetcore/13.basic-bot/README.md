# basic-bot
This bot has been created using [Microsoft Bot Framework](https://dev.botframework.com),
- Use [LUIS](https://www.luis.ai) to implement core AI capabilities
- Implement a multi-turn conversation using Dialogs
- Handle user interruptions for such things as `Help` or `Cancel`
- Prompt for and validate requests for information from the user

# To try this sample
- Clone the samples repository
```bash
git clone https://github.com/Microsoft/botbuilder-samples.git
```
1. Install the Bot CLI Tools
```bash
npm install -g chatdown msbot ludown luis-apis qnamaker botdispatch luisgen
```

2. Register and manage a new application by using the App registrations experience in the Azure Portal

    2.1. Go to the Microsoft's [Application Registration Portal](https://apps.dev.microsoft.com/)

    2.2. Click on `Add an App`

**NOTE**: You can obtain your `appId` and `appSecret` once the App is created. Save this keys for the next steps

3. Navigate to [LUIS portal](https://www.luis.ai)

    3.1. Click the `Sign in` button

    3.2. Click on the `Import new app` and select [FlightBooking.json](FlightBooking.json) from the `botbuilder-samples/csharp_dotnetcore/13.basic-bot/CognitiveModels` folder

**NOTE**: You can find your `LuisAppId` in "Application Information" section, while `LuisAPIKey` and `LuisAPIHostName` can be found in "Keys and Endpoints" section. Save this keys for the next steps

4. Navigate to the sample folder (`botbuilder-samples/samples/csharp_dotnetcore/13.basic-bot`) and open `CoreBot.csproj` in Visual Studio

5. Update your `appsettings.json` file

    5.1. Complete the properties's values with the mentioned keys

    - `MicrosoftAppId` with your generated Microsoft Application Id
    - `MicrosoftAppPassword` with the Application Secret generated
    - `LuisAppId` with your generated LUIS Application Id
    - `LuisAPIKey` with the LUIS API Key generated
    - `LuisAPIHostName` with the endpoint's name

    ```bash
    {
        "MicrosoftAppId": "<YOUR MICROSOFT APP ID>",
        "MicrosoftAppPassword": "<YOUR MICROSOFT APP PASSWORD>"
        "LuisAppId": "<YOUR LUIS APP ID>",
        "LuisAPIKey": "<YOUR LUIS API KEY>"
        "LuisAPIHostName": "<YOUR LUIS HOST NAME>"
    }
    ```
# Running Locally

## Visual Studio
1. Navigate to the samples folder (`botbuilder-samples/samples/csharp_dotnetcore/13.basic-bot`) and open `CoreBot.csproj` in Visual Studio
2. Run the project (press `F5` key)

## .NET Core CLI
- Install the [.NET Core CLI tools](https://docs.microsoft.com/en-us/dotnet/core/tools/?tabs=netcore2x)
- Using the command line, navigate to `botbuilder-samples/samples/csharp_dotnetcore/13.basic-bot` folder
- Type `dotnet run`

## Testing the bot using Bot Framework Emulator
[Microsoft Bot Framework Emulator](https://aka.ms/botframework-emulator) is a desktop application that allows bot developers to test and debug
their bots on localhost or running remotely through a tunnel.
- Install the Bot Framework Emulator from [here](https://aka.ms/botframework-emulator).
### Connect to bot using Bot Framework Emulator
- Launch the Bot Framework Emulator
- File -> New bot Configuration
- Complete Bot name and Endpoint URL fields (`http://localhost:PORT/api/messages`) 
- Click on `Save and connect` and save it at the root of the project (`botbuilder-samples/samples/csharp_dotnetcore/13.basic-bot`)

# Deploy this bot to Azure
You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md)

To clone this bot, run

```bash
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```
# Further reading
- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot basics](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [LUIS](https://www.luis.ai)
- [Prompt Types](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=javascript)
- [Azure Bot Service Introduction](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [QnA Maker](https://qnamaker.ai)