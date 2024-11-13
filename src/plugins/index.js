import vuetify from "./vuetify";

import VueTheMask from "vue-the-mask";

export function registerPlugins(app) {
  app.use(vuetify);
  app.use(VueTheMask);
}
