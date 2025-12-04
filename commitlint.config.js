module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式修改
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 构建系统或外部依赖的变动
        'ci' // CI配置文件或脚本的变动
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-empty': [0], // scope可选
    'scope-enum': [0], // 不限制scope
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 50],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 72],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 72]
  }
};
