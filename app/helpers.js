const os = require('electron').remote.require('os');

const mixpanelWorkEnv = 'production';

/* global mixpanel */
export function mixPanelTrack(name, args) {
  if (process.env.NODE_ENV === mixpanelWorkEnv) {
    mixpanel.track(name, args);
  }
}

export function mixPanelRegister() {
  mixpanel.identify(window.key);
  if (process.env.NODE_ENV === mixpanelWorkEnv) {
    mixpanel.identify(window.key);
    // Temporary set people twice, for support first users, will be removed
    // after few versions
    mixpanel.people.set({
      $name: os.homedir().split('/').slice(-1)[0]
    });
    if (window.firstInstall) {
      window.firstInstall = false;
      try {
        mixpanel.people.set({
          $name: os.homedir().split('/').slice(-1)[0]
        });
        mixPanelTrack('firstInstall');
      } catch (e) {
        mixPanelTrack('error', { message: e });
      }
    }
  }
}

export function startAppMixpanelEvent() {
  if (process.env.NODE_ENV === mixpanelWorkEnv) {
    mixPanelRegister();
    mixPanelTrack('Start App');
    mixpanel.people.increment('Start App');
  }
}

