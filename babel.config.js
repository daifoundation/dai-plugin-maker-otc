module.exports = function(api) {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = ['@babel/plugin-transform-runtime'];
  const babelrcRoots = ['.', './lib/*'];

  return {
    presets,
    plugins,
    babelrcRoots
  };
};
