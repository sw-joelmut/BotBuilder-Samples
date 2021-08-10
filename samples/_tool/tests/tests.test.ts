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
import glob from "glob";

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

const samplesFolder = path.resolve(`${__dirname}/../..`);

const appregs = [
  {
    id: "5dfe4cba-1794-402e-a707-eb6a9dd02add",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "26a51ce2-c20d-4cbd-a5aa-e96d7a283077",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "7715fbe4-eef2-4e1e-865f-0aa5698507bd",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "c3886c63-e5cf-4dc5-8cce-9b618897939b",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "d9f6a7cf-5d2b-46fe-89eb-101aaf006604",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "c1c61589-7887-4943-8e74-72d2fd2578aa",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "7c2d9c8e-fba0-4f01-a50a-cb3f8781a900",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "f2905080-7611-44c1-8711-68338c3bc18f",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "da6172f8-2854-46c4-a02c-56ccc652a714",
    secret: "jvpWoiJJzGt3Fj",
  },
  {
    id: "b5ee05e4-d95e-42a6-8f80-48808f6c7a20",
    secret: "jvpWoiJJzGt3Fj",
  },
];

const newRg = glob
  .sync(`**/DeploymentTemplates/template-with-new-rg.json`, {
    nocase: true,
    cwd: samplesFolder,
  })
  .filter((e) => !e.includes("/bin/"))
  .map((path, id) => ({ id, path }));
// .filter(({ id }) => [108, 130, 140, 143, 150, 153, 160].includes(id));
// .filter((e, i) => i < 1 && i >= 0);

const preexistingRg = glob
  .sync(`**/DeploymentTemplates/template-with-preexisting-rg.json`, {
    nocase: true,
    cwd: samplesFolder,
  })
  .filter((e) => !e.includes("/bin/"))
  .map((path, id) => ({ id, path }))
  .filter(({ id }) => [16, 20, 21, 22, 31, 74, 127, 132].includes(id))
  .filter((e, i) => i < 1 && i >= 0);

// Testear aparte 27, 28, 29, 30
// parameter => existingAppServicePlanResourceGroup: { value: "{{ bot.name }}" },

const templates = [
  // {
  //   name: "new-rg",
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
  //         // name: "F1",
  //         // tier: "Basic",
  //         // size: "F1",
  //         // family: "F",
  //         // capacity: 1,
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
  //   bots: newRg.map((e) => {
  //     const folder = e.path.replace(
  //       /\/DeploymentTemplates\/template-with-new-rg\.json/gi,
  //       ""
  //     );
  //     const [main, ...rest] = folder.split("/");
  //     const mainFolder = main.replace(/[_]/g, "-");
  //     const sample = rest.join("/").split(".")?.[0].split("/").pop();
  //     const name = `${mainFolder}-${sample}`.slice(0, 38);

  //     return {
  //       name: `${e.id}-${name}`,
  //       baseFolder: samplesFolder,
  //       folder,
  //     };
  //   }),
  // },
  {
    name: "pre-rg",
    path: "/DeploymentTemplates/template-with-preexisting-rg.json",
    group: { name: "pre-rg-jmut" },
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
    },
    bots: preexistingRg.map((e) => {
      const folder = e.path.replace(
        /\/DeploymentTemplates\/template-with-preexisting-rg\.json/gi,
        ""
      );
      const [main, ...rest] = folder.split("/");
      const mainFolder = main.replace(/[_]/g, "-");
      const sample = rest.join("/").split(".")?.[0].split("/").pop();
      const name = `${mainFolder}-${sample}`.slice(0, 38);

      return {
        name: `${e.id}-${name}`,
        baseFolder: samplesFolder,
        folder,
      };
    }),
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
    path.join(__dirname, `/logs/${template.name}/${now}.log`)
  );
  const fileLogger = pino(pino.destination(logsPath));
  describe(`template: ${template.name}, path: ${template.path}, tests: ${template.bots.length}`, () => {
    const chunks = chunkArray(template.bots, appregs.length);
    for (let i = 0; i < chunks.length; i++) {
      const bots = chunks[i];

      parallel(
        `batch: ${i + 1}/${chunks.length}, tests: ${bots?.length}`,
        () => {
          const apps = [...appregs];
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
              // await new Promise((res) => setTimeout(() => res(1), 5000));
              // assert.ok(true);
              const parameters = await botParameterProvider.process({
                parameters: params,
                scope: {
                  bot,
                  template,
                },
              });
              const options = {
                botFolder: `${bot.baseFolder}/${bot.folder}`,
                template: template.path,
                parameters,
                bot: {
                  name: parameters.botId.value as string,
                },
                group: {
                  name:
                    (parameters.botId.value as string) ||
                    (parameters.groupName.value as string),
                  exists: !!template.group?.name,
                },
              };

              try {
                if (!!template.group?.name) {
                  logger.info({
                    step: "Create Resource Group",
                    name: parameters.botId.value,
                  });
                  await bottester.createResourceGroup(
                    parameters.botId.value as string
                  );
                }
                // await new Promise((res) => setTimeout(() => res(1), 1000));
                logger.info({ step: "Deploy" });
                const { bot, ...deployment } = await bottester.deploy(options);
                // const bot = new Bot({ name: options.bot.name, group: options.group.name });
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
                logger.error({ step: "Error", stack: error });
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
                  logger.info({ step: "CleanUp-Fail", stack: error });
                }
              }
            });
          }
        }
      );
    }
  });
}
