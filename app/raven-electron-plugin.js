const PATH_MATCH_RE = /[^/]+$/;

function normalizeUrl(url) {
  const match = url.match(PATH_MATCH_RE);
  return match ? `~/${match[0]}` : url;
}

function electronPlugin(Raven) {
  Raven.setDataCallback((data) => {
    electronPlugin._normalizeData(data); // eslint-disable-line
  });
}

electronPlugin._normalizeData = function normalizeData(data) { // eslint-disable-line
  if (data.culprit) {
    data.culprit = normalizeUrl(data.culprit); // eslint-disable-line

    const stacktrace = data.stacktrace || data.exception && data.exception.values[0].stacktrace; // eslint-disable-line
    if (stacktrace) {
      stacktrace.frames.forEach((frame) => {
        frame.filename = normalizeUrl(frame.filename); // eslint-disable-line
      });
    }
  }
};

module.exports = electronPlugin;
