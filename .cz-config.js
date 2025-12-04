module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复bug' },
    { value: 'docs', name: 'docs:     文档更新' },
    { value: 'style', name: 'style:    代码格式修改(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加feature，也不是修复bug)'
    },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     增加测试' },
    { value: 'chore', name: 'chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert:   回滚' },
    { value: 'build', name: 'build:    构建系统或外部依赖的变动' },
    { value: 'ci', name: 'ci:       CI配置文件或脚本的变动' }
  ],

  scopes: [
    ['cli', 'CLI相关'],
    ['template', '模板相关'],
    ['config', '配置相关'],
    ['deps', '依赖相关'],
    ['docs', '文档相关'],
    ['test', '测试相关'],
    { name: '其他', value: '' }
  ],

  allowBreakingChanges: ['feat', 'fix'],

  messages: {
    type: '请选择提交类型:',
    scope: '请选择影响范围 (可选):',
    customScope: '请输入影响范围:',
    subject: '请简要描述提交 (必填):\n',
    body: '请输入详细描述 (可选):\n',
    breaking: '列出任何BREAKING CHANGES (可选):\n',
    footerPrefixesSelect: '选择关联issue前缀 (可选):',
    customFooterPrefix: '输入关联issue前缀:',
    footer: '请输入关联issue (如: #31, #I3244):\n',
    confirmCommit: '确认生成提交信息?'
  },

  skipQuestions: ['body', 'footer', 'breaking'],

  subjectMaxLength: 50,

  defaultScope: '',
  defaultBody: '',
  defaultIssues: '',

  allowCustomScopes: true,
  allowEmptyScopes: true,

  upperCaseSubject: false,

  breakingPrefix: 'BREAKING CHANGE:',
  footerPrefix: 'ISSUES CLOSED:'
};
