(window as any).process = {
  env: { DEBUG: undefined },
  nextTick: function () {
    return null;
  },
};
