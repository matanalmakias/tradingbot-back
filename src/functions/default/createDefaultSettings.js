import defSettings from "../../../content/defaults/defSettings.js";
import { Setting } from "../../db/models/setting.js";

const createDefaultSettings = async () => {
  let settings = await Setting.find();
  if (settings.length === 0) {
    for (let setting of defSettings) {
      let newSetting = new Setting(setting);
      await newSetting.save();
    }
    console.log(`Default settings saved`);
  }
};

export default createDefaultSettings;
