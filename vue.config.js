const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // 路径别名
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src')) // 主包
      .set('@comps', resolve('src/components')) // 主包组件
      .set('@sub', resolve('src/packPages')); // 分包
  }
};