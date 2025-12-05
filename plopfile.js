module.exports = function (plop) {
  const path = require('path');

  // 获取CLI工具目录
  const cliDir = __dirname;

  // 添加自定义helper
  plop.addHelper('upperCase', text => text.toUpperCase());
  plop.addHelper('lowerCase', text => text.toLowerCase());
  plop.addHelper('camelCase', text => {
    return text.replace(/-([a-z])/g, g => g[1].toUpperCase());
  });

  // 添加kebabName helper
  plop.addHelper('kebabName', text => {
    return text
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  });

  // 添加 pascalCase helper
  plop.addHelper('pascalCase', text => {
    return text.replace(/(?:^|[-_])(\w)/g, (_, char, index) => {
      return index === 0 ? char.toUpperCase() : char.toUpperCase();
    });
  });

  // 添加 kebabCase helper
  plop.addHelper('kebabCase', text => {
    return text
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  });

  // 生成器配置
  plop.setGenerator('component', {
    description: '创建新的组件',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: '请选择组件类型：',
        choices: [
          { name: 'React 组件', value: 'react' },
          { name: 'Vue 组件', value: 'vue' },
          { name: '原生 JS 组件', value: 'vanilla' }
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名称：',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return '组件名称是必填的';
        }
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入组件描述（可选）：',
        default: ''
      },
      {
        type: 'confirm',
        name: 'hasTests',
        message: '是否需要测试文件？',
        default: false
      },
      {
        type: 'confirm',
        name: 'hasStyles',
        message: '是否需要样式文件？',
        default: true
      },
      {
        type: 'list',
        name: 'destination',
        message: '请选择目标目录：',
        choices: [
          { name: 'src/components', value: 'src/components' },
          { name: 'src/pages', value: 'src/pages' },
          { name: 'src/utils', value: 'src/utils' },
          { name: 'custom', value: 'custom' }
        ]
      },
      {
        type: 'input',
        name: 'customPath',
        message: '请输入自定义路径：',
        when: function (answers) {
          return answers.destination === 'custom';
        },
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return '自定义路径是必填的';
        }
      }
    ],
    actions: function (data) {
      const actions = [];
      const componentType = data.type;

      // 确定目标路径
      let basePath =
        data.destination === 'custom' ? data.customPath : data.destination;

      if (componentType === 'react') {
        // React 组件模板
        actions.push({
          type: 'add',
          path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.tsx`,
          templateFile: path.join(cliDir, 'plop/templates/react-component.hbs')
        });

        if (data.hasStyles) {
          actions.push({
            type: 'add',
            path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.module.css`,
            templateFile: path.join(cliDir, 'plop/templates/react-styles.hbs')
          });
        }

        if (data.hasTests) {
          actions.push({
            type: 'add',
            path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.test.tsx`,
            templateFile: path.join(cliDir, 'plop/templates/react-test.hbs')
          });
        }

        actions.push({
          type: 'add',
          path: `${basePath}/{{kebabName name}}/index.ts`,
          templateFile: path.join(cliDir, 'plop/templates/react-index.hbs')
        });
      } else if (componentType === 'vue') {
        // Vue 组件模板
        actions.push({
          type: 'add',
          path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.vue`,
          templateFile: path.join(cliDir, 'plop/templates/vue-component.hbs')
        });

        if (data.hasStyles) {
          actions.push({
            type: 'add',
            path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.css`,
            templateFile: path.join(cliDir, 'plop/templates/vue-styles.hbs')
          });
        }

        if (data.hasTests) {
          actions.push({
            type: 'add',
            path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.spec.js`,
            templateFile: path.join(cliDir, 'plop/templates/vue-test.hbs')
          });
        }
      } else if (componentType === 'vanilla') {
        // 原生 JS 组件模板
        actions.push({
          type: 'add',
          path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.js`,
          templateFile: path.join(
            cliDir,
            'plop/templates/vanilla-component.hbs'
          )
        });

        if (data.hasStyles) {
          actions.push({
            type: 'add',
            path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.css`,
            templateFile: path.join(cliDir, 'plop/templates/vanilla-styles.hbs')
          });
        }

        if (data.hasTests) {
          actions.push({
            type: 'add',
            path: `${basePath}/{{kebabName name}}/{{pascalCase name}}.test.js`,
            templateFile: path.join(cliDir, 'plop/templates/vanilla-test.hbs')
          });
        }
      }

      return actions;
    }
  });

  plop.setGenerator('hook', {
    description: '创建自定义 Hook',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: '请选择 Hook 类型：',
        choices: [
          { name: 'React Hook', value: 'react' },
          { name: 'Vue Composition API', value: 'vue' },
          { name: '自定义工具函数', value: 'utility' }
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入 Hook 名称（以 use 开头）：',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Hook 名称是必填的';
        }
      }
    ],
    actions: function (data) {
      const actions = [];

      if (data.type === 'react') {
        actions.push({
          type: 'add',
          path: 'src/hooks/{{name}}.ts',
          templateFile: path.join(cliDir, 'plop/templates/react-hook.hbs')
        });
      } else if (data.type === 'vue') {
        actions.push({
          type: 'add',
          path: 'src/composables/{{name}}.ts',
          templateFile: path.join(cliDir, 'plop/templates/vue-composable.hbs')
        });
      } else if (data.type === 'utility') {
        actions.push({
          type: 'add',
          path: 'src/utils/{{name}}.ts',
          templateFile: path.join(cliDir, 'plop/templates/utility-function.hbs')
        });
      }

      return actions;
    }
  });
};
