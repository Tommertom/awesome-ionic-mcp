import { cleanedIonicDefinition, getIonicCoreWithRedirect } from "./utils.js";

interface IonicData {
  coreJson: {
    components: any[];
  };
  ionic_components: {
    [key: string]: any;
  };
  version: string;
}

export const ionic_data: IonicData = {
  coreJson: {
    components: [],
  },
  ionic_components: {},
  version: "",
};

// not really all components
// https://raw.githubusercontent.com/ionic-team/ionic-docs/refs/heads/main/docs/components.md
export const giveAllIonicComponents = () => {
  const components = Object.keys(ionic_data.ionic_components);
  const result = components.map((c) => {
    return {
      name: c,
      description: ionic_data.ionic_components[c].description,
    };
  });
  return result;
};

export const initIonicData = async () => {
  console.log("Ionic data init");

  const ionicData = await getIonicCoreWithRedirect(
    "https://unpkg.com/@ionic/docs/core.json"
  );

  if (!ionicData) {
    console.log("Failed to load Ionic data");
    return;
  }

  if (
    ionicData.coreJson.components &&
    Array.isArray(ionicData.coreJson.components)
  ) {
    const components = ionicData.coreJson.components;
    components.forEach((component: any) => {
      if (component && component.tag) {
        ionic_data.ionic_components[component.tag] =
          cleanedIonicDefinition(component);
      }
    });
  } else {
    ionic_data.ionic_components = {};
  }

  ionic_data.coreJson = ionicData.coreJson;
  ionic_data.version = ionicData.version;
  console.log(
    "Ionic data loaded",
    ionic_data.version,
    Object.keys(ionic_data.ionic_components).length
  );
};
