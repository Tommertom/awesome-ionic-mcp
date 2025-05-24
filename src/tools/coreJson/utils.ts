import * as http from "http";
import * as https from "https";

export const getIonicCoreWithRedirect = async (
  url: string
): Promise<{ coreJson: any; version: string }> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res &&
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode <= 399 &&
          res.headers.location
        ) {
          // Redirect detected
          const version = extractIonicVersion(res.headers.location);
          https.get("https://unpkg.com" + res.headers.location, async (res) => {
            try {
              const result = await download(res);
              const coreJson = JSON.parse(result);
              resolve({ coreJson, version });
            } catch (err) {
              reject(err);
            }
          });
        } else {
          download(res)
            .then((result) => {
              const coreJson = JSON.parse(result);
              resolve({ coreJson, version: "unknown" });
            })
            .catch(reject);
        }
      })
      .on("error", reject);
  });
};

export function download(res: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    res.on("data", (chunk: Buffer) => {
      data += chunk.toString();
    });
    res.on("end", () => {
      resolve(data);
    });
    res.on("error", (err) => {
      reject(err);
    });
  });
}

export function extractIonicVersion(url: string) {
  const regex = /@(\d+\.\d+\.\d+)/;
  const match = url.match(regex);

  if (match) {
    const version = match[1];
    return version;
  } else {
    console.log("No version number found");
    return "ERROR";
  }
}

export const cleanedIonicDefinition = (ionic_core_definition: any) => {
  if (!ionic_core_definition) {
    return { error: "No definition found" };
  }

  //@ts-ignore
  delete ionic_core_definition["tag"];
  //@ts-ignore
  delete ionic_core_definition["docs"];
  //@ts-ignore
  delete ionic_core_definition["docsTags"];
  //@ts-ignore
  delete ionic_core_definition["usage"];
  //@ts-ignore
  delete ionic_core_definition["dependents"];
  //@ts-ignore
  delete ionic_core_definition["dependencies"];
  //@ts-ignore
  delete ionic_core_definition["dependencyGraph"];
  //@ts-ignore
  delete ionic_core_definition["filePath"];

  // for all elements in the props item, we delete things as well
  //@ts-ignore
  const propsArray = ionic_core_definition["props"];
  if (propsArray && Array.isArray(propsArray)) {
    for (let i = 0; i < propsArray.length; i++) {
      const prop = propsArray[i];
      if (prop) {
        //@ts-ignore
        delete prop["complexType"];
        //@ts-ignore
        delete prop["reflectToAttr"];
        //@ts-ignore
        delete prop["docsTags"];
        //@ts-ignore
        delete prop["optional"];
      }
    }
  }

  return ionic_core_definition;
};
