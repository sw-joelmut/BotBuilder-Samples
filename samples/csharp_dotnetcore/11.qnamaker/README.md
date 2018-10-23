In this sample, we demonstrate how to use the QnA Maker service to answer questions based on a FAQ text file as input.

# Concepts introduced in this sample

## QnA Maker service

The [QnA Maker Service](https://www.qnamaker.ai) enables you to build, train and publish a simple question
and answer bot based on FAQ URLs, structured documents or editorial content in minutes.

One of the basic requirements in writing your own bot is to seed it with questions and answers. In many cases, the questions and answers already exist in content like FAQ URLs/documents, product manuals, etc. With QnA Maker, users can query your application in a natural, conversational manner.

QnA Maker uses machine learning to extract relevant question-answer pairs from your content. It also uses powerful matching and ranking algorithms to provide the best possible match between the user query and the questions.

# To try this sample

- Clone the samples repository

```bash
git clone https://github.com/Microsoft/botbuilder-samples.git
```

- **Optional**: Update the `appsettings.json` file under `botbuilder-samples/samples/csharp_dotnetcore/11.qnamaker` with your `botFileSecret`. For Azure Bot Service bots, you can find the `botFileSecret` under application settings.

# Prerequisites

- Follow instructions [here](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/how-to/set-up-qnamaker-service-azure) to create a QnA Maker service.
- Follow instructions [here](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/tutorials/migrate-knowledge-base) to import the [sample.qna](CognitiveModels/sample.qna) to your newly created QnA Maker service.
- Update [BotConfiguration.bot](BotConfiguration.bot) with your kbid (KnowledgeBase Id) and endpointKey in the "**qna**" services section. You can find this information under "**Settings**" tab for your QnA Maker Knowledge Base at [QnAMaker.ai](https://www.qnamaker.ai)
- **Optional**: Follow instructions [here](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/QnAMaker) to set up the QnA Maker CLI to deploy the model.

## Visual Studio

- Navigate to the samples folder (`botbuilder-samples/samples/csharp_dotnetcore/11.qnamaker`) and open `QnABot.csproj` in Visual Studio.
- From the **Startup Projects** select `QnABot`
- Run the project (press `F5` key)

## Visual Studio Code

- Open `botbuilder-samples/samples/csharp_dotnetcore/11.qnamaker` sample folder.
- Bring up a terminal, navigate to `botbuilder-samples/samples/csharp_dotnetcore/11.qnamaker` folder.
- Type `dotnet run`.

## Update packages

- In Visual Studio right click on the solution and select "**Restore NuGet Packages**".
  **Note:** this sample requires `Microsoft.Bot.Builder`, `Microsoft.Bot.Builder.AI.QnA` and `Microsoft.Bot.Builder.Integration.AspNet.Core`.
- In Visual Studio Code type `dotnet restore`

## Testing the bot using Bot Framework Emulator

[Microsoft Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator from [here](https://aka.ms/botframework-emulator).

### Connect to bot using Bot Framework Emulator **V4**

- Launch the **Bot Framework Emulator**
- **File** -> **Open Bot Configuration** and navigate to `botbuilder-samples/samples/csharp_dotnetcore/11.qnamaker` folder.
- Select the `BotConfiguration.bot` file.

# Deploy this bot to Azure

You can use the [MSBot](https://github.com/microsoft/botbuilder-tools) Bot Builder CLI tool to clone and configure any services this sample depends on. In order to install this and other tools, you can read [Installing CLI Tools](../../../Installing_CLI_tools.md).

To clone this bot, run

```bash
msbot clone services -f deploymentScripts/msbotClone -n <BOT-NAME> -l <Azure-location> --subscriptionId <Azure-subscription-id>
```

# Further reading

- [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [QnA Maker documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/overview/overview)
- [QnA Maker command line tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/QnAMaker)

