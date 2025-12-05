// 验证 .cz-config.js 配置的用法
const config = require('./.cz-config.js');

console.log('.cz-config.js 配置:');
console.log('1. types 数组:', config.types?.length || 0, '个');
console.log('2. messages 配置:', config.messages ? '存在' : '不存在');
console.log('3. 示例类型:', config.types?.[0]);

// 检查是否被正确导出
if (typeof config === 'object' && config.types) {
  console.log('✅ .cz-config.js 配置正确');
} else {
  console.log('❌ .cz-config.js 配置有问题');
}
