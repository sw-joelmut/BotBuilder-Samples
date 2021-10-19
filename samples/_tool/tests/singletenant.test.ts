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

const samplesFolder = path.resolve(`C:/repos/BotBuilder-Samples/samples/csharp_dotnetcore`);

const bots = [
  { name: "2-echo-bot", folder: "02.echo-bot" },
  { name: "3-welcome-user", folder: "03.welcome-user" },
  { name: "5-multi-turn-prompt", folder: "05.multi-turn-prompt" },
  { name: "6-using-cards", folder: "06.using-cards" },
  { name: "7-using-adaptive-cards", folder: "07.using-adaptive-cards" },
  { name: "8-suggested-actions", folder: "08.suggested-actions" },
  { name: "11-qnamaker", folder: "11.qnamaker" },
  { name: "13-core-bot", folder: "13.core-bot" },
  { name: "14-nlp-with-orchestrator", folder: "14.nlp-with-orchestrator" },
  { name: "15-handling-attachments", folder: "15.handling-attachments" },

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
  
  // { name: "80.simple-root", folder: "80.skills-simple-bot-to-bot/SimpleRootBot" },
  // { name: "81.dialog-skill", folder: "81.skills-skilldialog/DialogSkillBot" },
  // { name: "81.dialog-root", folder: "81.skills-skilldialog/DialogRootBot" },
];

const appregs = [
  {
    id: "69b4555d-e9c7-41aa-9c73-40d83a90c4d5",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "31f5069c-0a3b-49c5-8c97-d85322c2e94e",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "e401a3d3-959e-4a32-8248-6de85b7252a7",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "475867a7-e505-47d7-bc64-16efc4b290b9",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "06bf9fc5-3589-4b29-a154-208735994d03",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "2edca8d8-cc5a-4c45-9ebf-809a175f8ba9",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "f4724f92-e962-4e2d-a1a5-7623fe9a352d",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "edae61af-4460-4c27-8766-e0c06f3a8ec4",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "985420d2-394a-4fd8-96bd-096587b1a598",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "4ad01082-87cf-462c-8401-c1219d0a06be",
    secret: "jvpWoiJJzGt3Fj",
  },
]

const appType = "SingleTenant";
const tenantId = "b25036e3-de39-4fec-a4aa-bda41b870d38";

const templates = [
  {
    name: "jmut-single-new",
    path: "/DeploymentTemplates/template-with-new-rg.json",
    parameters: {
      groupLocation: { value: "westus" },
      groupName: { value: "{{ bot.name }}" },
      botId: { value: "{{ bot.name }}" },
      botSku: { value: "F0" },
      newAppServicePlanName: { value: "{{ bot.name }}" },
      newAppServicePlanLocation: { value: "westus" },
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
  // {
  //   name: "multi-preex",
  //   path: "/DeploymentTemplates/template-with-preexisting-rg.json",
  //   group: { name: "pre-rg-jmut" },
  //   parameters: {
  //     botId: { value: "{{ bot.name }}" },
  //     botSku: { value: "F0" },
  //     newAppServicePlanName: { value: "{{ bot.name }}" },
  //     appServicePlanLocation: { value: "westus" },
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
  //   },
  //   bots: bots
  //     .filter(({ name }) => ![].includes(name))
  //     .filter((e, i) => i < appregs.length && i >= 0),
  // },
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
    path.join(__dirname, `/logs/singletenant/dotnetSamples-${now}.log`)
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
                    (parameters.botId.value as string) ||
                    (parameters.groupName.value as string),
                  exists: false, // new resource group
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
