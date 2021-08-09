import path from "path";
import { nanoid, customAlphabet } from "nanoid";
import {
  BotTester,
  AppRegistration,
  BotParameterProvider,
  ConnectionStatus,
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
  return appreg.create({ name: collection.botId.value, secret: nanoid() });
  // return { name: "a", secret: "1" };
});

botParameterProvider.register("bot", ({ scope }) => ({
  name: `${scope.template.name}-${scope.bot.name}`,
}));

const samplesFolder = path.resolve(`${__dirname}/../..`);

const result = glob
  .sync(`**/DeploymentTemplates/template-with-new-rg.json`, {
    nocase: true,
    cwd: samplesFolder,
  })
  .filter((e) => !e.includes("/bin/"))
  .filter((e, i) => i < 1);

const templates = [
  {
    name: "new-rg",
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
          name: "F1",
          tier: "Basic",
          size: "F1",
          family: "F",
          capacity: 1,
        },
      },
      appId: { value: "{{ app.id }}" },
      appSecret: { value: "{{ app.secret }}" },
    },
    bots: result.map((e) => {
      const folder = e.replace(
        /\/DeploymentTemplates\/template-with-new-rg\.json/gi,
        ""
      );
      const [main, ...rest] = folder.split("/");
      const mainFolder = main.replace(/[_]/g, "-");
      const sample = rest.join("/").split(".")?.[0].split("/").pop();
      const name = `${mainFolder}-${sample}`.slice(0, 38);

      const id = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 3);

      return {
        name: `${name}-${id()}`,
        baseFolder: samplesFolder,
        folder,
      };
    }),
    // bots: [
    //   {
    //     name: "02-echo-bot",
    //     folder: `${samplesFolder}/csharp_dotnetcore/02.echo-bot`,
    //   },
    //   {
    //     name: "05-multi-turn-prompt",
    //     folder: `${samplesFolder}/csharp_dotnetcore/5.multi-turn-prompt`,
    //   },
    // ],
  },
];
// new-rg-csharp-dotnetcore-02-echo-bot9g0VSMDb5JZvvozVvd9Zc

// const s = templates[0].bots.map((e) => ({ ...e, length: e.name.length }));
// console.log(s);
// console.log(s.map(e => e.length).sort((a,b)=> b-a));

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

for (const template of templates) {
  describe(`template: ${template.name}, path: ${template.path}`, () => {
    const chunks = chunkArray(template.bots, 10);
    for (let i = 0; i < chunks.length; i++) {
      const bots = chunks[i];
      parallel(`chunk: ${i + 1}/${chunks.length}`, () => {
        for (const bot of bots) {
          it(`bot: ${bot.name}, folder: ${bot.folder}`, async () => {
            // await new Promise((res) => setTimeout(() => res(1), 5000));
            // assert.ok(true);
            const parameters = await botParameterProvider.process({
              parameters: { ...template.parameters },
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
                name: parameters.groupName.value as string,
                exists: false,
              },
            };
            try {
              // await new Promise((res) => setTimeout(() => res(1), 1000));
              const bot = await bottester.deploy(options);
              await bot.connect();
              const status = await bot.status();
              await bot.disconnect();
              // assert.strictEqual(bot.status, "deployed");
              assert.strictEqual(status, ConnectionStatus.Online);
              // throw new Error('asd')
            } catch (error) {
              throw error;
            } finally {
              try {
                await bottester.cleanup({
                  group: { name: options.group.name },
                });
              } catch (error) {
                throw error;
              } finally {
                await appreg.remove(parameters.appId.value as string);
              }
            }
          });
        }
      });
    }
  });
}
