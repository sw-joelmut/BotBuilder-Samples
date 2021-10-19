// NODE VERSION 14.16.1




import { exec, ExecOptions } from "child_process";
import glob from "glob";
import _fs from "fs";
import AdmZip from "adm-zip";
import {
  Activity,
  DirectLine,
  ConnectionStatus,
} from "botframework-directlinejs";
import path from "path";
import { nanoid } from "nanoid";
global.XMLHttpRequest = require("xhr2");
global.WebSocket = require("ws");

const fs = _fs.promises;


const resolvePath = (object, path, defaultValue) =>
  path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);

export { ConnectionStatus };

// Source: https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.websites.models.provisioningstate?view=azure-dotnet
export enum DeploymentStatus {
  Succeeded = 0,
  Failed = 1,
  Canceled = 2,
  InProgress = 3,
  Deleting = 4,
}

interface Parameters {
  [x: string]: any;
}

interface BotDeployOptions {
  name: string;
}

interface GroupDeployOptions {
  name: string;
  exists: boolean;
}

interface DeployOptions {
  bot: BotDeployOptions;
  group: GroupDeployOptions;
  botFolder: string;
  template: string;
  parameters: Parameters;
}

interface GroupCleanUpOptions {
  name: string;
  keep?: boolean;
}

interface BotCleanUpOptions {
  name: string;
}

interface CleanUpOptions {
  group: GroupCleanUpOptions;
  bot?: BotCleanUpOptions;
}

interface BotOptions {
  name: string;
  group: string;
}

const cmd = (
  command: string,
  properties: ExecOptions = null
): Promise<string> =>
  new Promise((resolve, reject) =>
    exec(command, properties, (err, stdout, stderr) => {
      if (
        (stderr.includes("[WARNING]") || stderr.includes("WARNING:")) &&
        (!stderr.includes("[ERROR]") || !stderr.includes("ERROR:"))
      ) {
        resolve(stdout);
      } else {
        stderr ? reject(stderr) : err ? reject(err) : resolve(stdout);
      }
    })
  );

const objectToFlag = <T extends object>(obj: T) =>
  Object.entries(obj)
    .map(([key, val]) => (!!val ? `--${key}="${val}"` : `--${key}`))
    .join(" ");

interface BotTesterDeployment {
  status: DeploymentStatus;
  bot: Bot;
}
export class BotTester {
  public async deploy(options: DeployOptions): Promise<BotTesterDeployment> {
    let result: any = {};

    if (options.group.exists) {
      result = await this.deployWithGroup(options);
      await this.waitDeployWithGroup(options);
    } else {
      result = await this.deployWithoutGroup(options);
      await this.waitDeployWithoutGroup(options);
    }
    let zipPath = "";
    if (options.bot.name.includes("java-")) {
      await this.zipBotJava(options);
    } else {
      zipPath = await this.zipBot(options);
    }
    await this.configureBotDeploy(options);
    await new Promise((res) => setTimeout(() => res(1), 60000));
    await this.checkConfigureBotDeployStatus(options);
    if (options.bot.name.includes("java-")) {
      await this.deployBotJava(options);
    } else {
      await this.deployBot(options, zipPath);
      await this.removeZip(zipPath);
    }

    await this.tagResourceGroup(options);
    this.removeDeployment(options);

    return {
      status: DeploymentStatus[
        result?.properties?.provisioningState || DeploymentStatus.Failed
      ] as any as DeploymentStatus,
      // status: DeploymentStatus.Succeeded,
      bot: new Bot({ name: options.bot.name, group: options.group.name }),
    };
  }

  public async createResourceGroup(
    name: string,
    location: string = "westus"
  ): Promise<string> {
    const flags = objectToFlag({
      name,
      location,
      "only-show-errors": null,
    });

    return cmd(`az group create ${flags}`);
  }

  public async cleanup(options: CleanUpOptions): Promise<void> {
    // let flags = objectToFlag({
    //   name: options.bot.name,
    //   "resource-group": options.group.name,
    //   "only-show-errors": null,
    // });

    // await cmd(`az bot delete ${flags}`);

    // flags = objectToFlag({
    //   name: options.bot.name,
    //   "resource-group": options.group.name,
    //   "keep-empty-plan": null,
    //   "only-show-errors": null,
    // });

    // await cmd(`az webapp delete ${flags}`);

    // flags = objectToFlag({
    //   name: options.bot.name,
    //   "resource-group": options.group.name,
    //   yes: null,
    //   "only-show-errors": null,
    // });

    // await cmd(`az appservice plan delete ${flags}`);

    // const resources = await this.resources(options.group.name);
    // const { plans, apps, bots, rest } = resources
    //   .filter((e) => options.bot?.name === e.name || true)
    //   .reduce(
    //     (acc, val) => {
    //       const key =
    //         {
    //           "Microsoft.Web/serverFarms": "plans",
    //           "Microsoft.Web/sites": "apps",
    //           "Microsoft.BotService/botServices": "bots",
    //         }[val?.type] || "rest";

    //       acc[key].push(val);
    //       return acc;
    //     },
    //     { plans: [], apps: [], bots: [], rest: [] }
    //   );

    // if (apps.length) {
    //   const flags = objectToFlag({
    //     ids: apps.map((e) => e.id).join(" "),
    //     "only-show-errors": null,
    //   });

    //   await cmd(`az webapp delete ${flags}`);
    // }

    // for (const resource of bots) {
    //   const flags = objectToFlag({
    //     name: resource.name,
    //     "resource-group": resource.resourceGroup,
    //     "only-show-errors": null,
    //   });

    //   await cmd(`az bot delete ${flags}`);
    // }

    // if (rest.length) {
    //   const flags = objectToFlag({
    //     ids: rest.map((e) => e.id).join(" "),
    //     "only-show-errors": null,
    //   });

    //   await cmd(`az resource delete ${flags}`);
    // }

    // if (plans.length) {
    //   const flags = objectToFlag({
    //     ids: plans.map((e) => e.id).join(" "),
    //     "only-show-errors": null,
    //     yes: null,
    //   });

    //   await cmd(`az appservice plan delete ${flags}`);
    // }

    if (!options.group.keep) {
      const flags = objectToFlag({
        "resource-group": options.group.name,
        yes: null,
        "only-show-errors": null,
      });

      await cmd(`az group delete ${flags}`);
    }
  }

  private async resources(group: string): Promise<any[]> {
    const flags = objectToFlag({
      "resource-group": group,
      "only-show-errors": null,
    });

    const result = await cmd(`az resource list ${flags}`);
    const json = JSON.parse(result);

    return json;
  }

  private async waitDeployWithGroup(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      created: null,
      timeout: 60,
      interval: 5,
    });

    return cmd(`az deployment group wait ${flags}`);
  }

  private async waitDeployWithoutGroup(
    options: DeployOptions
  ): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      created: null,
      timeout: 60,
      interval: 5,
    });

    return cmd(`az deployment sub wait ${flags}`);
  }

  private async deployWithGroup(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      "resource-group": options.group.name,
      "template-file": path.join(options.botFolder, options.template),
      parameters: JSON.stringify(JSON.stringify(options.parameters)),
      "only-show-errors": null,
    });

    const result = await cmd(`az deployment group create ${flags}`);

    if (result) {
      return JSON.parse(result);
    }
  }

  private async deployWithoutGroup(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      location: "westus",
      "template-file": path.join(options.botFolder, options.template),
      parameters: JSON.stringify(JSON.stringify(options.parameters)),
      "only-show-errors": null,
    });

    const result = await cmd(`az deployment sub create ${flags}`);

    if (result) {
      return JSON.parse(result);
    }
  }

  private async tagResourceGroup(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      "resource-group": options.group.name,
      set: "tags.project='manx'",
      "only-show-errors": null,
    });

    return cmd(`az group update ${flags}`);
  }

  private async zipBot(options: DeployOptions): Promise<string> {
    const dir = await fs.readdir(options.botFolder);
    const zip = new AdmZip();

    for (var i = 0; i < dir.length; i++) {
      const file = path.join(options.botFolder, dir[i]);
      const stat = await fs.stat(file);
      if (stat.isDirectory()) {
        zip.addLocalFolder(file, dir[i]);
      } else if (stat.isFile()) {
        zip.addLocalFile(file);
      }
    }

    const zipName = `${options.bot.name}.zip`;
    const zipPath = path.join(__dirname, "zips", zipName);
    zip.writeZip(zipPath);

    return zipPath;
  }

  private async zipBotJava(options: DeployOptions): Promise<string> {
    return cmd(`mvn clean package -f ${options.botFolder}`);
  }

  private async removeDeployment(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      "only-show-errors": null,
    });

    return cmd(`az deployment delete ${flags}`);
  }

  private async removeZip(path: string): Promise<void> {
    return fs.rm(path, { force: true });
  }

  private async checkConfigureBotDeployStatus(
    options: DeployOptions
  ): Promise<string> {
    // TODO: Remove this in favor of updating the arm template directly
    const flags = objectToFlag({
      name: options.bot.name,
      "resource-group": options.group.name,
      "only-show-errors": null,
    });

    const count = {
      limit: 10,
      current: 1,
    };

    return new Promise((res, rej) => {
      const interval = setInterval(async () => {
        try {
          if (count.current > count.limit) {
            throw new Error("Retry limit exceeded");
          }
          const result = await cmd(
            `az webapp config appsettings list ${flags}`
          );
          const json = JSON.parse(result);
          count.current++;
          if (
            json?.some(
              (e) =>
                e.name == "SCM_DO_BUILD_DURING_DEPLOYMENT" && e.value == "true"
            )
          ) {
            clearInterval(interval);
            res(result);
          }
        } catch (error) {
          clearInterval(interval);
          rej(error);
        }
      }, 5000);
    });
  }

  private async configureBotDeploy(options: DeployOptions): Promise<string> {
    // TODO: Remove this in favor of updating the arm template directly
    const flags = objectToFlag({
      name: options.bot.name,
      "resource-group": options.group.name,
      settings: "SCM_DO_BUILD_DURING_DEPLOYMENT=true",
      "only-show-errors": null,
    });

    return cmd(`az webapp config appsettings set ${flags}`);
  }

  private async deployBot(
    options: DeployOptions,
    zipPath: string
  ): Promise<any> {
    // Add retry
    const flags = objectToFlag({
      name: options.bot.name,
      "resource-group": options.group.name,
      src: zipPath,
      "only-show-errors": null,
    });

    return cmd(`az webapp deployment source config-zip ${flags}`);
  }

  private async deployBotJava(options: DeployOptions): Promise<any> {
    return cmd(
      `mvn azure-webapp:deploy -Dgroupname="${options.group.name}" -Dbotname="${options.bot.name}" -Donlyshowerrors -f ${options.botFolder}`
    );
  }
}

export class Bot {
  private directline: DirectLine;

  constructor(private options: BotOptions) {}

  public async connect(): Promise<void> {
    // this.directline = new DirectLine({
    //   secret: await this.secret(),
    // });
  }

  public async status(): Promise<boolean> {
    // Agregar retries
    const secret = await this.secret();
    return new Promise(async (resolve, reject) => {
      let timeout;
      let sub;
      let i = 5;

      // await new Promise<void>((res) => setTimeout(() => res(), 30000));

      this.directline = new DirectLine({
        secret,
      });

      const ids = [];

      sub = this.directline.activity$
        .filter((e: any) => !ids.includes(e.text))
        .subscribe(
          (activity) => {
            sub.unsubscribe();
            clearTimeout(timeout);
            i = 0;
            resolve(!!activity);
          },
          (error) => {
            sub.unsubscribe();
            clearTimeout(timeout);
            i = 0;
            reject({ message: "BotTester.status", stack: error });
          }
        );

      while (i > 0) {
        // if (!!sub) {
        //   sub.unsubscribe();
        // }

        if (i > 0) {
          await new Promise<void>((res) => setTimeout(() => res(), 30000));
          i--;

          const id = nanoid();
          ids.push(id);

          await this.directline
            .postActivity({
              from: { id: "bottester" },
              type: "message",
              text: id,
            })
            .toPromise();
        }
      }

      // sub = this.directline
      //   .postActivity({
      //     from: { id: "bottester" },
      //     type: "message",
      //     text: "hi",
      //   })
      //   .flatMap((e) =>
      //     this.directline.activity$.filter((s) => {
      //       console.log(e, s);
      //       return s.id != e;
      //     })
      //   )
      //   .subscribe(
      //     (status) => {
      //       sub.unsubscribe();
      //       clearTimeout(timeout);
      //       // i = 0;
      //       console.log(this.options.name, status);
      //       resolve(!!status);
      //     },
      //     (error) => {
      //       sub.unsubscribe();
      //       clearTimeout(timeout);
      //       // i = 0;
      //       reject({ message: "BotTester.status", stack: error });
      //     }
      //   );
      // }

      timeout = setTimeout(() => {
        sub.unsubscribe();
        const error = new Error(
          `The bot '${this.options.name}' took too long to respond!`
        );
        reject(error);
      }, 5000);
    });
  }

  public async disconnect(): Promise<void> {
    this.directline.end();
  }

  private async secret(): Promise<string> {
    const flags = objectToFlag({
      name: this.options.name,
      "resource-group": this.options.group,
      "with-secrets": true,
      "only-show-errors": null,
    });

    const result = await cmd(`az bot directline show ${flags}`);
    const json = JSON.parse(result);

    return json?.properties?.properties?.sites?.[0]?.key;
  }
}

interface AppRegistrationOptions {
  name: string;
  secret: string;
}

interface AppRegistrationInfo {
  id: string;
  name: string;
  secret: string;
}

export class AppRegistration {
  public async create(
    options: AppRegistrationOptions
  ): Promise<AppRegistrationInfo> {
    const flags = objectToFlag({
      "display-name": options.name,
      password: options.secret,
      "available-to-other-tenants": null,
      "only-show-errors": null,
    });

    const result = await cmd(`az ad app create ${flags}`);
    const json = JSON.parse(result);

    return {
      id: json.appId,
      name: json.displayName,
      secret: options.secret,
    };
  }

  public async remove(id: string): Promise<void> {
    const flags = objectToFlag({
      id,
      "only-show-errors": null,
    });

    await cmd(`az ad app delete ${flags}`);
  }
}

interface BotParameterOptions {
  value: string | number | object;
}

interface BotParameterProviderOptions {
  [x: string]: BotParameterOptions;
}

interface BotParameterProviderRegisterAction {
  current: any;
  collection: any;
  scope: any;
}

interface BotParameterProviderProcessOptions {
  parameters: any;
  scope: any;
}

export class BotParameterProvider {
  private registrations = new Map<string, any>();

  public register<T>(
    key: string,
    action: (values?: BotParameterProviderRegisterAction) => T
  ): void {
    if (!this.registrations.has(key)) {
      this.registrations.set(key, action);
    }
  }

  public async process(
    options: BotParameterProviderProcessOptions
  ): Promise<BotParameterProviderOptions> {
    const regex = new RegExp(/(?<=)(\{\{.*?\}\})(?=)/g);
    const regex2 = new RegExp(/(?<=\{\{)(.*?)(?=\}\})/g);

    const internalProcess = async (
      param,
      processed = {},
      processedRegistrations = new Map<string, any>()
    ) => {
      const result = { ...param };

      for (const [key, val] of Object.entries(param)) {
        switch (typeof val) {
          case "string":
            result[key] = val;
            const matches = result[key].match(regex);
            if (!matches) {
              continue;
            }

            for (const replace of matches) {
              if (!replace) {
                continue;
              }

              const replace2 = replace.match(regex2)?.[0]?.trim();
              const keyObject = replace2?.split(".")?.[0];
              if (this.registrations.has(keyObject)) {
                if (processedRegistrations.has(keyObject)) {
                  const values = processedRegistrations.get(keyObject);
                  const value = resolvePath(
                    { [keyObject]: values },
                    replace2,
                    null
                  );
                  result[key] = result[key].replace(replace, value);
                } else {
                  const action = this.registrations.get(keyObject);
                  const values = await action({
                    current: param,
                    collection: processed,
                    scope: options.scope,
                  });
                  processedRegistrations.set(keyObject, values);
                  const value = resolvePath(
                    { [keyObject]: values },
                    replace2,
                    null
                  );
                  result[key] = result[key].replace(replace, value);
                }
              }
            }
            break;
          case "object":
            result[key] = await internalProcess(
              val,
              processed,
              processedRegistrations
            );
            processed = { ...processed, ...result };
            break;
        }
      }

      return result;
    };

    const params = JSON.parse(JSON.stringify(options.parameters));
    return internalProcess(params, params);
  }
}

// https://portal.azure.com/#@southworks.com/resource/subscriptions/84031be7-8c15-4700-967d-02ab2e5a15e0/resourceGroups/new-rg-40-java-springboot-06/providers/Microsoft.BotService/botServices/new-rg-40-java-springboot-06/test
