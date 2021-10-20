import glob from "glob";
import path from "path";
import { nanoid, customAlphabet } from "nanoid";
import pino from "pino";
import {
  BotTester,
  AppRegistration,
  BotParameterProvider,
  ConnectionStatus,
  Bot,
  DeploymentStatus,
} from "../src/BotTester";
import assert from "assert";
import parallel from "mocha.parallel";
import _fs from "fs";

const fs = _fs.promises;

// const describe = (k, c) => c();
// const it = (k, c) => c();
const bottester = new BotTester();
const appreg = new AppRegistration();
const botParameterProvider = new BotParameterProvider();

botParameterProvider.register("app", ({ collection }) => {
  // return appreg.create({ name: collection.botId.value, secret: nanoid() });
  // return { name: "a", secret: "1" };
});

botParameterProvider.register("bot", ({ scope }) => ({
  name: `${scope.template.name}-${scope.bot.name}`,
}));

const root = (base) => (folder) => path.resolve(`${__dirname}/../../../${base}/${folder}`);
const samples = root('samples/csharp_dotnetcore');
const templts = root('generators/dotnet-templates');

const appregs = [
  // +10
  {
    id: "3953ae91-1d62-4c0e-8073-5fb9af2fec52",
    name: "msi-test-1-manx"
  },
  {
    id: "b19f5717-c2c9-42a6-bfc2-bb47f74ec51b",
    name: "msi-test-2-manx"
  },
  {
    id: "24bf18f8-be89-4b83-bda3-ac3a9063fb6c",
    name: "msi-test-3-manx"
  },
  {
    id: "6082367b-5efe-4eaa-97b3-966d11ee100f",
    name: "msi-test-4-manx"
  },
  {
    id: "64c61432-d185-44a6-9aec-a1b32bd5f0bb",
    name: "msi-test-5-manx"
  },
  {
    id: "fd9206cf-89f1-4aff-8dc0-1a61630a3cb1",
    name: "msi-test-6-manx"
  },
  {
    id: "6a169c38-a02b-4dc1-9778-888c455eba65",
    name: "msi-test-7-manx"
  },
  {
    id: "97bb3f64-650d-4da5-8879-ff52ec0b47b0",
    name: "msi-test-8-manx"
  },
  {
    id: "c493c4c1-35ff-4558-81d5-325500e71e5c",
    name: "msi-test-9-manx"
  },
  {
    id: "d26c1fea-4938-4c0b-b56c-833e7f8159d4",
    name: "msi-test-10-manx"
  },

  // +10
  {
    id: "a01d4674-4819-4dce-b548-63d96c78c3c9",
    name: "msi-test-11-manx",
  },
  {
    id: "4dbdb3bb-5fa7-4662-be13-bbd222483c11",
    name: "msi-test-12-manx",
  },
  {
    id: "9e4ecb27-52ae-486c-9103-8791ed198226",
    name: "msi-test-13-manx",
  },
  {
    id: "4bd60cae-8014-4878-a37e-3834f4d23c1b",
    name: "msi-test-14-manx",
  },
  {
    id: "fa7f3ba2-1801-4533-ae21-22aaa3821c66",
    name: "msi-test-15-manx",
  },
  {
    id: "82000c63-2d8b-4651-a0f6-ed04b4b57568",
    name: "msi-test-16-manx",
  },
  {
    id: "9a777801-825c-41f9-80a3-1920593b7ed9",
    name: "msi-test-17-manx",
  },
  {
    id: "df37055b-a295-4a24-ab45-cb37b73240e2",
    name: "msi-test-18-manx",
  },
  {
    id: "3efb9358-28c8-46c8-b99e-9f3ee057e8fc",
    name: "msi-test-19-manx",
  },
  {
    id: "ad7e0c3c-aef5-4dea-bf18-f3359450bf6e",
    name: "msi-test-20-manx",
  },
]

const bots = [
  // { name: "2-echo-bot", folder: samples("02.echo-bot") },
  // { name: "3-welcome-user", folder: samples("03.welcome-user") },
  // { name: "5-multi-turn-prompt", folder: samples("05.multi-turn-prompt") },
  // { name: "6-using-cards", folder: samples("06.using-cards") },
  // { name: "7-using-adaptive-cards", folder: samples("07.using-adaptive-cards") },
  // { name: "8-suggested-actions", folder: samples("08.suggested-actions") },
  // { name: "11-qnamaker", folder: samples("11.qnamaker") },
  // { name: "13-core-bot", folder: samples("13.core-bot") },
  // { name: "14-nlp-with-orchestrator", folder: samples("14.nlp-with-orchestrator") },
  // { name: "15-handling-attachments", folder: samples("15.handling-attachments") },
  // { name: "16-proactive-messages", folder: samples("16.proactive-messages") },
  // { name: "17-multilingual-bot", folder: samples("17.multilingual-bot") },
  // { name: "18-bot-auth", folder: samples("18.bot-authentication") },
  // { name: "19-custom-dialogs", folder: samples("19.custom-dialogs") },
  // { name: "21-corebot-insights", folder: samples("21.corebot-app-insights") },
  // { name: "23-facebook-events", folder: samples("23.facebook-events") },
  // { name: "24-bot-auth-msgraph", folder: samples("24.bot-authentication-msgraph") },
  // { name: "25-message-reaction", folder: samples("25.message-reaction") },
  // { name: "42-scaleout", folder: samples("42.scaleout") },
  // { name: "43-complex-dialog", folder: samples("43.complex-dialog") },
  // { name: "44-prompt-users", folder: samples("44.prompt-users-for-input") },
  // { name: "45-state-management", folder: samples("45.state-management") },
  // { name: "46-teams-auth", folder: samples("46.teams-auth") },
  // { name: "47-inspection", folder: samples("47.inspection") },
  // { name: "49-qnamaker-all", folder: samples("49.qnamaker-all-features") },
  // { name: "50-teams-search", folder: samples("50.teams-messaging-extensions-search") },
  // { name: "51-teams-action", folder: samples("51.teams-messaging-extensions-action") },
  // { name: "52-teams-search-auth", folder: samples("52.teams-messaging-extensions-search-auth-config") },
  // { name: "53-teams-action-preview", folder: samples("53.teams-messaging-extensions-action-preview") },
  // { name: "54-teams-task-module", folder: samples("54.teams-task-module") },
  // { name: "55-teams-link-unfurling", folder: samples("55.teams-link-unfurling") },
  // { name: "56-teams-file-upload", folder: samples("56.teams-file-upload") },
  // { name: "57-teams-conversation", folder: samples("57.teams-conversation-bot") },
  // { name: "58-teams-start-thread", folder: samples("58.teams-start-new-thread-in-channel") },
  // { name: "60-slack-adapter", folder: samples("60.slack-adapter") },
  // { name: "61-facebook-adapter", folder: samples("61.facebook-adapter") },
  // { name: "62-webex-adapter", folder: samples("62.webex-adapter") },
  // { name: "63-twilio-adapter", folder: samples("63.twilio-adapter") },
  { name: "80-echo-skill", folder: samples("80.skills-simple-bot-to-bot/EchoSkillBot") },
  { name: "80-simple-root", folder: samples("80.skills-simple-bot-to-bot/SimpleRootBot") },
  { name: "81-dialog-skill", folder: samples("81.skills-skilldialog/DialogSkillBot") },
  { name: "81-dialog-root", folder: samples("81.skills-skilldialog/DialogRootBot") },
  { name: "05a-multi-turn-lg", folder: samples("language-generation/05.a.multi-turn-prompt-with-language-fallback") },
  { name: "05b-multi-turn-lg", folder: samples("language-generation/05.multi-turn-prompt") },
  { name: "06-using-cards-lg", folder: samples("language-generation/06.using-cards") },
  { name: "13-core-bot-lg", folder: samples("language-generation/13.core-bot") },
  { name: "20-extending-lg", folder: samples("language-generation/20.extending-with-custom-functions") },
  { name: "template-corebot", folder: samples("Template-bots/MyCoreBot") },
  { name: "template-echobot", folder: samples("Template-bots/MyEchoBot") },
  { name: "template-emptybot", folder: samples("Template-bots/MyEmptyBot") },
  { name: "vsix-corebot", folder: samples("VSIX-bots/CoreBotMSI") },
  { name: "vsix-corebottests", folder: samples("VSIX-bots/CoreBotWithTestsMSI/CoreBotWithTestsMSI") },
  { name: "vsix-echobot", folder: samples("VSIX-bots/EchoBotMSI") },
  { name: "vsix-emptybot", folder: samples("VSIX-bots/EmptyBotMSI") },
].filter((e, i) => i < appregs.length && i >= 0);


const appType = "UserAssignedMSI";
const tenantId = "b25036e3-de39-4fec-a4aa-bda41b870d38";

const templates = [
  // {
  //   name: "msi-new-jm",
  //   path: "/DeploymentTemplates/template-with-new-rg.json",
    // group: false,
  //   parameters: {
  //     groupLocation: { value: "westus" },
  //     groupName: { value: "{{ bot.name }}" },
  //     botId: { value: "{{ bot.name }}" },
  //     botSku: { value: "F0" },
  //     newAppServicePlanName: { value: "{{ bot.name }}" },
  //     newAppServicePlanLocation: { value: "westus" },
  //     newAppServicePlanSku: {
  //       value: {
  //         name: "S1",
  //         tier: "Standard",
  //         size: "S1",
  //         family: "S",
  //         capacity: 1,
  //       },
  //     },
  //     appId: { value: "{{ app.id }}" },
  //     appType: { value: appType },
  //     tenantId: { value: tenantId },
  //     existingUserAssignedMSIName: { value: "{{ app.name }}" },
  //     existingUserAssignedMSIResourceGroupName: { value: "bffnbots-jmut" }
  //   },
  //   bots,
  // },
  {
    name: "msi-pre-jm",
    path: "/DeploymentTemplates/template-with-preexisting-rg.json",
    group: true,
    parameters: {
      botId: { value: "{{ bot.name }}" },
      botSku: { value: "F0" },
      newAppServicePlanName: { value: "{{ bot.name }}" },
      appServicePlanLocation: { value: "westus" },
      newAppServicePlanSku: {
        value: {
          name: "S1",
          tier: "Standard",
          size: "S1",
          family: "S",
          capacity: 1,
        },
      },
      appId: { value: "{{ app.id }}" },
      appType: { value: appType },
      tenantId: { value: tenantId },
      existingUserAssignedMSIName: { value: "{{ app.name }}" },
      existingUserAssignedMSIResourceGroupName: { value: "bffnbots-jmut" }
    },
    bots,
  },
];

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

for (const template of templates) {
  const now = new Date().toISOString().replace(/[:\.]/g, "-");
  const logsPath = path.resolve(
    path.join(__dirname, `/logs/msi/dotnetSamples-${now}.log`)
  );
  const fileLogger = pino(pino.destination(logsPath));
  describe(`template: ${template.name}, path: ${template.path}, tests: ${template.bots.length}`, () => {
    const chunks = chunkArray(template.bots, appregs.length);

    for (let i = 0; i < chunks.length; i++) {
      const bots = chunks[i];

      parallel(
        `batch: ${i + 1}/${chunks.length}, tests: ${bots?.length}`,
        () => {
          const apps = [...appregs].reverse();
          for (const bot of bots) {
            const app = apps.pop();
            it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
              const logger = fileLogger.child({
                tests: template.bots.length,
                batch: {
                  number: i + 1,
                  total: chunks.length,
                  tests: bots.length,
                },
                bot: { name: bot.name, folder: bot.folder },
              });
              const params = JSON.parse(JSON.stringify(template.parameters));
              params.appId.value = app.id;
              params.existingUserAssignedMSIName.value = app.name;
              const parameters = await botParameterProvider.process({
                parameters: params,
                scope: {
                  bot,
                  template,
                },
              });
              const options = {
                botFolder: bot.folder,
                template: template.path,
                parameters,
                bot: {
                  name: parameters.botId.value as string,
                },
                group: {
                  name:
                    (parameters.botId.value as string) ||
                    (parameters.groupName.value as string),
                  exists: template.group, // new resource group
                },
              };

              try {
                if (options.group.exists) {
                  logger.info({
                    step: "Create Resource Group",
                    name: parameters.botId.value,
                  });
                  await bottester.createResourceGroup(
                    parameters.botId.value as string
                  );
                }

                logger.info({ step: "Deploy" });
                const { bot, ...deployment } = await bottester.deploy(options);
                logger.info({ step: "Bot Health-Check" });
                await bot.connect();
                const status = await bot.status();
                await bot.disconnect();

                assert.strictEqual(
                  deployment.status,
                  DeploymentStatus.Succeeded
                );
                assert.ok(status);

                logger.info({
                  step: "Assert",
                  key: "deployment",
                  actual: deployment.status,
                  expected: DeploymentStatus.Succeeded,
                });
                logger.info({
                  step: "Assert",
                  key: "conversation-status",
                  actual: status,
                  expected: true,
                });
              } catch (error) {
                const { message, stack, ...rest } = error;
                if (typeof error === "string") {
                  logger.error({ step: "Error", error });
                } else {
                  logger.error({
                    step: "Error",
                    error: { message, stack, rest },
                  });
                }
                throw error;
              } finally {
                logger.info({ step: "CleanUp" });
                try {
                  // await bottester.cleanup({
                  //   group: {
                  //     name: options.group.name,
                  //   },
                  //   bot: { name: options.bot.name },
                  // });
                  // await appreg.remove(parameters.appId.value as string);
                } catch (error) {
                  const { message, stack, ...rest } = error;
                  if (typeof error === "string") {
                    logger.error({ step: "CleanUp-Fail", error });
                  } else {
                    logger.error({
                      step: "CleanUp-Fail",
                      error: { message, stack, rest },
                    });
                  }
                  throw error;
                }
              }
            });
          }
        }
      );
    }
  });
}



// Delete RGs
// for (const template of templates) {
//   parallel(
//     `template: ${template.name}, path: ${template.path}, tests: ${template.bots.length}`,
//     () => {
//       for (const bot of template.bots) {
//         it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
//           await bottester.cleanup({
//             group: { name: template.name + "-" + bot.name },
//           });
//         });
//       }
//     }
//   );
// }
