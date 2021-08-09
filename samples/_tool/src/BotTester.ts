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
global.XMLHttpRequest = require("xhr2");
global.WebSocket = require("ws");

const fs = _fs.promises;

const resolvePath = (object, path, defaultValue) =>
  path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);

export { ConnectionStatus };

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

interface CleanUpOptions {
  group: GroupCleanUpOptions;
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
    exec(command, properties, (err, stdout, stderr) =>
      stderr ? reject(stderr) : err ? reject(err) : resolve(stdout)
    )
  );

const objectToFlag = <T extends object>(obj: T) =>
  Object.entries(obj)
    .map(([key, val]) => (!!val ? `--${key}="${val}"` : `--${key}`))
    .join(" ");

export class BotTester {
  public async deploy(options: DeployOptions): Promise<Bot> {
    if (options.group.exists) {
      await this.deployWithGroup(options);
      await this.waitDeployWithGroup(options);
    } else {
      await this.deployWithoutGroup(options);
      await this.waitDeployWithoutGroup(options);
    }
    const zipPath = await this.zipBot(options);
    // await this.configureBotDeploy(options);
    // await this.checkConfigureBotDeployStatus(options);
    await this.deployBot(options, zipPath);

    await this.removeZip(zipPath);
    this.removeDeployment(options);

    return new Bot({ name: options.bot.name, group: options.group.name });
  }

  public async cleanup(options: CleanUpOptions): Promise<void> {
    const resources = await this.resources(options.group.name);

    for (const resource of resources) {
      const flags = objectToFlag({
        name: resource.name,
        "resource-group": options.group.name,
        "keep-empty-plan": null,
        "only-show-errors": null,
      });

      await cmd(`az webapp delete ${flags}`);
    }

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

    const result = await cmd(`az webapp list ${flags}`);
    const json = JSON.parse(result);

    return json;
  }

  private async waitDeployWithGroup(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      created: null,
      timeout: 300,
      interval: 10,
    });

    return cmd(`az deployment group wait ${flags}`);
  }

  private async waitDeployWithoutGroup(
    options: DeployOptions
  ): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      created: null,
      timeout: 300,
      interval: 10,
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

    return cmd(`az deployment group create ${flags}`);
  }

  private async deployWithoutGroup(options: DeployOptions): Promise<string> {
    const flags = objectToFlag({
      name: options.bot.name,
      location: "westus",
      "template-file": path.join(options.botFolder, options.template),
      parameters: JSON.stringify(JSON.stringify(options.parameters)),
      "only-show-errors": null,
    });

    return cmd(`az deployment sub create ${flags}`);
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

    const zipName = `${options.group.name}-${options.bot.name}.zip`;
    const zipPath = path.join(__dirname, "zips", zipName);
    zip.writeZip(zipPath);

    return zipPath;
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
  ): Promise<string> {
    // Add retry
    const flags = objectToFlag({
      name: options.bot.name,
      "resource-group": options.group.name,
      src: zipPath,
      "only-show-errors": null,
    });

    return cmd(`az webapp deployment source config-zip ${flags}`);
  }
}

class Bot {
  private directline: DirectLine;

  constructor(private options: BotOptions) {}

  public async connect(): Promise<void> {
    this.directline = new DirectLine({
      secret: await this.secret(),
    });
  }

  public async status(): Promise<ConnectionStatus> {
    return new Promise((resolve, reject) => {
      const sub = this.directline
        .postActivity({
          from: { id: "bottester" },
          type: "message",
        })
        .flatMap(() => this.directline.connectionStatus$.asObservable())
        .subscribe(
          (status) => {
            sub.unsubscribe();
            resolve(status);
          },
          (error) => {
            sub.unsubscribe();
            reject(error);
          }
        );
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

    return internalProcess(options.parameters, options.parameters);
  }
}
