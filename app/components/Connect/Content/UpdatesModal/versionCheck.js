const request = require('request');
const semver = require('semver');

export default function checkVersion(callback) {
  const currentVersion = 'v0.1.0-beta.4';

  const options = {
    url: 'https://api.github.com/repos/web-pal/DBGlass/releases/latest',
    headers: {
      'User-Agent': 'dbglass-app'
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const latestRelease = JSON.parse(body);
      const latestVersion = latestRelease.tag_name;
      if (semver.valid(latestVersion) && semver.valid(currentVersion)) {
        if (semver.gt(latestVersion, currentVersion)) {
          callback(latestRelease.html_url);
        } else {
          callback(false);
        }
      }
    }
  });
}
