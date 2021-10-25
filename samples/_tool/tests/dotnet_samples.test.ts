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

const samplesFolder = path.resolve(`C:/Repositories/BotBuilder-Samples/samples/csharp_dotnetcore`);

const bots = [
  // { name: "2-echo-bot", folder: "02.echo-bot" },
  // { name: "3-welcome-user", folder: "03.welcome-user" },
  // { name: "5-multi-turn-prompt", folder: "05.multi-turn-prompt" },
  // { name: "6-using-cards", folder: "06.using-cards" },
  // { name: "7-using-adaptive-cards", folder: "07.using-adaptive-cards" },
  // { name: "8-suggested-actions", folder: "08.suggested-actions" },
  // { name: "11-qnamaker", folder: "11.qnamaker" },
  // { name: "13-core-bot", folder: "13.core-bot" },
  // { name: "14-nlp-with-orchestrator", folder: "14.nlp-with-orchestrator" },
  // { name: "15-handling-attachments", folder: "15.handling-attachments" },
  // { name: "16-proactive-messages", folder: "16.proactive-messages" },
  // { name: "17-multilingual-bot", folder: "17.multilingual-bot" },
  // { name: "18-bot-auth", folder: "18.bot-authentication" },
  // { name: "19-custom-dialogs", folder: "19.custom-dialogs" },
  // { name: "21-corebot-insights", folder: "21.corebot-app-insights" },
  // { name: "23-facebook-events", folder: "23.facebook-events" },
  // { name: "24-bot-auth-msgraph", folder: "24.bot-authentication-msgraph" },
  // { name: "25-message-reaction", folder: "25.message-reaction" },
  // { name: "42-scaleout", folder: "42.scaleout" },
  // { name: "43-complex-dialog", folder: "43.complex-dialog" },
  // { name: "44-prompt-users", folder: "44.prompt-users-for-input" },
  // { name: "45-state-management", folder: "45.state-management" },
  // { name: "46-teams-auth", folder: "46.teams-auth" },
  // { name: "47-inspection", folder: "47.inspection" },
  // { name: "49-qnamaker-all", folder: "49.qnamaker-all-features" },
  // { name: "50-teams-search", folder: "50.teams-messaging-extensions-search" },
  // { name: "51-teams-action", folder: "51.teams-messaging-extensions-action" },
  // { name: "52-teams-search-auth", folder: "52.teams-messaging-extensions-search-auth-config" },
  // { name: "53-teams-action-preview", folder: "53.teams-messaging-extensions-action-preview" },
  // { name: "54-teams-task-module", folder: "54.teams-task-module" },
  // { name: "55-teams-link-unfurling", folder: "55.teams-link-unfurling" },
  // { name: "56-teams-file-upload", folder: "56.teams-file-upload" },
  // { name: "57-teams-conversation", folder: "57.teams-conversation-bot" },
  // { name: "58-teams-start-thread", folder: "58.teams-start-new-thread-in-channel" },
  // { name: "60-slack-adapter", folder: "60.slack-adapter" },
  // { name: "61-facebook-adapter", folder: "61.facebook-adapter" },
  // { name: "62-webex-adapter", folder: "62.webex-adapter" },
  // { name: "63-twilio-adapter", folder: "63.twilio-adapter" },
  // { name: "80-echo-skill", folder: "80.skills-simple-bot-to-bot/EchoSkillBot" },
  // { name: "80-simple-root", folder: "80.skills-simple-bot-to-bot/SimpleRootBot" },
  // { name: "81-dialog-skill", folder: "81.skills-skilldialog/DialogSkillBot" },
  // { name: "81-dialog-root", folder: "81.skills-skilldialog/DialogRootBot" },
  // { name: "05a-multi-turn-lg", folder: "language-generation/05.a.multi-turn-prompt-with-language-fallback" },
  // { name: "05b-multi-turn-lg", folder: "language-generation/05.multi-turn-prompt" },
  // { name: "06-using-cards-lg", folder: "language-generation/06.using-cards" },
  // { name: "13-core-bot-lg", folder: "language-generation/13.core-bot" },
  // { name: "20-extending-lg", folder: "language-generation/20.extending-with-custom-functions" },
  // { name: "vsix-core-bot", folder: "VSIX-bots/CoreBotMSI" },
  // { name: "vsix-core-bot-tests", folder: "VSIX-bots/CoreBotWithTestsMSI/CoreBotWithTestsMSI" },
  { name: "vsix-echo-bot", folder: "VSIX-bots/EchoBotMSI" },
  { name: "vsix-empty-bot", folder: "VSIX-bots/EmptyBotMSI" },
  { name: "templ-core-bot", folder: "Template-bots/MyCoreBot" },
  { name: "templ-echo-bot", folder: "Template-bots/MyEchoBot" },
  { name: "templ-empty-bot", folder: "Template-bots/MyEmptyBot" },
];

// const appregs = [
//   {
//     "id":  "34267834-d4b8-4d63-9a7a-13fd7adac1df",
//     "secret":  "Zy8LTyHNaSICxf.INNxItzaL-wQFfQ5CJx"
//   },
//   {
//       "id":  "3c5edc43-2199-406a-94c4-9dc586ded5b0",
//       "secret":  "Zao2zi-_o62h4aPE8AgGpmGKEh8j2EV3~S"
//   },
//   {
//       "id":  "0d88969c-95f9-409b-8169-297c2ae0509c",
//       "secret":  "6duZIQFdAzwLQHzwzL0yAb4reQ9m.HbHE1"
//   },
//   // {
//   //     "id":  "f079217b-a52e-4427-b4c5-6ab0b0915af8",
//   //     "secret":  "y.I7RCIXq4Q-a07AELa0fwOUUus.woMzQ7"
//   // },
//   {
//       "id":  "7996a743-73a9-41ef-bf5b-164591e8c7da",
//       "secret":  "Ukx9SnB1.d6noB8qjn3QwF5HAWu~D~IU1R"
//   },
//   {
//       "id":  "59bc4ccf-2323-41fc-8cee-92c123130edb",
//       "secret":  "9BB13371a5cxR1eYRYNJCg43Ew~XamSYDx"
//   },
//   {
//       "id":  "0e5314db-c285-4f30-a329-258283571c3b",
//       "secret":  "3e2Jk04AgDb2dwmx2.V0WDkA6wA1.2GIfD"
//   },
//   {
//       "id":  "495cd59d-ac20-4755-9e19-76923ad7649a",
//       "secret":  "VRMl47nRO~VLQi4~jPSm.Yy3zaDkK-yJUK"
//   },
//   // {
//   //     "id":  "87b82436-5988-4c12-a87f-cf7864adff9c",
//   //     "secret":  "uscXZy2bkMzIXHS_f0~nSyoSs-uoh6BdVe"
//   // },
//   // {
//   //     "id":  "ed00c805-2b2a-4485-9a34-abe53ed18538",
//   //     "secret":  "GG.Oeg.UwXs2bnHXF1Od63LzdD5Jeli0pf"
//   // }
// ];

//SingleTenant App Registrations
const appregs = [
  {
    "id":  "d4d4e27e-e0c5-4ae0-b97d-477cba8a3d16",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "3dc22fe2-b3d9-45b9-84b2-92b9a46ef998",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "12576b82-edaa-4dbe-a7a2-330252361386",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "9a11fc70-7844-4fa5-91a9-ec5a217d411d",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "66d71bc4-55fe-493e-8f7e-e3d05416c16c",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "f513cd69-adeb-42f9-b399-a089eeafcfee",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "10b83e5f-627d-47d7-8813-d625b4aaaf5d",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "d3d3565b-70bf-43f4-a54c-be1274747b90",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "23dac61d-0806-43e1-8d7a-ac1ffea1b0cd",
    "secret":  "jvpWoiJJzGt3Fj"
  },
  {
    "id":  "d1e2f2ba-2c59-44c2-a984-2fb8264f9348",
    "secret":  "jvpWoiJJzGt3Fj"
  },
]

const appType = "SingleTenant";
const tenantId = "b25036e3-de39-4fec-a4aa-bda41b870d38";

const templates = [
  // {
  //   name: "ceci-single",
  //   path: "/DeploymentTemplates/template-with-new-rg.json",
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
  //     appSecret: { value: "{{ app.secret }}" },
  //     appType: { value: appType },
  //     tenantId: { value: tenantId }
  //   },
  //   bots: bots
  //     .filter(({ name }) => ![].includes(name))
  //     .filter((e, i) => i < appregs.length && i >= 0),
  // },
  {
    name: "ceci-single-pre",
    path: "/DeploymentTemplates/template-with-preexisting-rg.json",
    group: { name: "pre-rg-ceci" },
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
      appSecret: { value: "{{ app.secret }}" },
      appType: { value: appType },
      tenantId: { value: tenantId }
    },
    bots: bots
      .filter(({ name }) => ![].includes(name))
      .filter((e, i) => i < appregs.length && i >= 0),
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
    path.join(__dirname, `/logs/${template.name}/dotnetSamples-${now}.log`)
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
              params.appSecret.value = app.secret;
              const parameters = await botParameterProvider.process({
                parameters: params,
                scope: {
                  bot,
                  template,
                },
              });
              const options = {
                botFolder: `${samplesFolder}/${bot.folder}`,
                template: template.path,
                parameters,
                bot: {
                  name: parameters.botId.value as string,
                },
                group: {
                  name:
                    // (parameters.botId.value as string) ||
                    // (parameters.groupName.value as string),
                    template.group.name,
                  exists: true, // existing resource group
                },
              };

              try {
                if (!options.group.exists) {
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
