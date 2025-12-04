#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

const program = new Command();

program
  .name('oam')
  .description('一个简单易用的前端脚手架工具')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('创建新的前端项目')
  .action(async projectName => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: '请选择项目模板：',
          choices: [
            { name: 'React + TypeScript', value: 'react' },
            { name: 'Vue 3 + TypeScript', value: 'vue' },
            { name: '原生 JavaScript', value: 'vanilla' }
          ]
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述：',
          default: 'A new frontend project'
        },
        {
          type: 'input',
          name: 'author',
          message: '请输入作者名称：',
          default: ''
        },
        {
          type: 'confirm',
          name: 'useNpm',
          message: '使用 npm 作为包管理器？',
          default: true
        }
      ]);

      const targetDir = path.resolve(process.cwd(), projectName);

      if (await fs.pathExists(targetDir)) {
        console.log(chalk.red(`目标目录 ${projectName} 已存在！`));
        return;
      }

      const spinner = ora('正在创建项目...').start();

      await createProject(targetDir, projectName, answers.template, answers);

      spinner.succeed('项目创建成功！');

      console.log(chalk.green('\n✅ 项目创建完成！'));
      console.log(chalk.blue('\n📝 接下来的步骤：'));
      console.log(`   cd ${projectName}`);
      console.log(`   ${answers.useNpm ? 'npm install' : 'yarn install'}`);
      console.log(`   ${answers.useNpm ? 'npm run dev' : 'yarn dev'}`);
    } catch (error) {
      console.error(chalk.red('创建项目失败：'), error.message);
    }
  });

program
  .command('list')
  .description('列出所有可用模板')
  .action(async () => {
    const { default: chalk } = await import('chalk');
    console.log(chalk.blue('📋 可用模板列表：'));
    console.log('  • React + TypeScript - 现代化的 React 开发框架');
    console.log('  • Vue 3 + TypeScript - 渐进式 JavaScript 框架');
    console.log('  • 原生 JavaScript - 简单的 HTML/CSS/JS 项目');
  });

async function createProject(targetDir, projectName, template, options) {
  const templateDir = path.join(__dirname, 'templates', template);

  await fs.ensureDir(targetDir);
  await fs.copy(templateDir, targetDir);

  const packageJsonPath = path.join(targetDir, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;
    packageJson.description = options.description;
    if (options.author) {
      packageJson.author = options.author;
    }
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  const readmePath = path.join(targetDir, 'README.md');
  if (await fs.pathExists(readmePath)) {
    let readme = await fs.readFile(readmePath, 'utf8');
    readme = readme.replace(/{{projectName}}/g, projectName);
    readme = readme.replace(/{{description}}/g, options.description);
    await fs.writeFile(readmePath, readme);
  }
}

// 生成组件的核心函数
async function generateComponent(componentName, answers) {
  const componentType = answers.type;
  const currentDir = process.cwd();

  // 检查是否在 CLI 工具目录中
  if (currentDir === __dirname || currentDir === path.dirname(__dirname)) {
    console.log(chalk.red('❌ 不能在 CLI 工具目录中生成组件！'));
    console.log(chalk.yellow('💡 请先在您的项目目录中运行此命令：'));
    console.log(chalk.cyan('   cd your-project-directory'));
    console.log(chalk.cyan(`   oamfe component ${componentName}`));
    return;
  }

  const basePath =
    answers.destination === 'custom' ? answers.customPath : answers.destination;
  const targetDir = path.join(currentDir, basePath, componentName);

  const spinner = ora('正在创建组件...').start();

  try {
    await fs.ensureDir(targetDir);

    if (componentType === 'react') {
      // React 组件
      const componentContent = `import React from 'react';
${answers.hasStyles ? `import styles from './${componentName}.module.css';` : ''}

export interface ${componentName}Props {
${answers.description ? '  /**\n   * ' + answers.description + '\n   */' : ''}
  children?: React.ReactNode;
}

const ${componentName}: React.FC<${componentName}Props> = ({ children }) => {
  return (
    <div${answers.hasStyles ? ' className={styles.container}' : ''}>
      <h1>${componentName} Component</h1>
      {children}
    </div>
  );
};

export default ${componentName};`;

      await fs.writeFile(
        path.join(targetDir, `${componentName}.tsx`),
        componentContent
      );

      if (answers.hasStyles) {
        const stylesContent = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}`;
        await fs.writeFile(
          path.join(targetDir, `${componentName}.module.css`),
          stylesContent
        );
      }

      if (answers.hasTests) {
        const testContent = `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders component', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName} Component')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <${componentName}>
        <div>Test Children</div>
      </${componentName}>
    );
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });
});`;
        await fs.writeFile(
          path.join(targetDir, `${componentName}.test.tsx`),
          testContent
        );
      }

      const indexContent = `export { default } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';`;
      await fs.writeFile(path.join(targetDir, 'index.ts'), indexContent);
    } else if (componentType === 'vue') {
      // Vue 组件
      const componentContent = `<template>
  <div class="${componentName.toLowerCase()}-container">
    <h1>${componentName} Component</h1>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
${answers.hasStyles ? `import './${componentName}.css';` : ''}

interface Props {
${answers.description ? '  /**\n   * ' + answers.description + '\n   */' : ''}
}

defineProps<Props>();
</script>`;

      await fs.writeFile(
        path.join(targetDir, `${componentName}.vue`),
        componentContent
      );

      if (answers.hasStyles) {
        const stylesContent = `.${componentName.toLowerCase()}-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}`;
        await fs.writeFile(
          path.join(targetDir, `${componentName}.css`),
          stylesContent
        );
      }

      if (answers.hasTests) {
        const testContent = `import { mount } from '@vue/test-utils';
import ${componentName} from './${componentName}.vue';

describe('${componentName}', () => {
  it('renders component', () => {
    const wrapper = mount(${componentName});
    expect(wrapper.find('h1').text()).toBe('${componentName} Component');
  });
});`;
        await fs.writeFile(
          path.join(targetDir, `${componentName}.spec.js`),
          testContent
        );
      }
    } else if (componentType === 'vanilla') {
      // 原生 JS 组件
      const componentContent = `${answers.hasStyles ? `import './${componentName}.css';` : ''}

/**
 * ${componentName} Class
${answers.description ? ' * ' + answers.description : ''}
 */
class ${componentName} {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = \`
      <div class="${componentName.toLowerCase()}-container">
        <h1>${componentName} Component</h1>
        <div class="content"></div>
      </div>
    \`;
  }

  setContent(content) {
    const contentEl = this.container.querySelector('.content');
    if (contentEl) {
      contentEl.innerHTML = content;
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

export default ${componentName};`;

      await fs.writeFile(
        path.join(targetDir, `${componentName}.js`),
        componentContent
      );

      if (answers.hasStyles) {
        const stylesContent = `.${componentName.toLowerCase()}-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.content {
  width: 100%;
  padding: 1rem;
}`;
        await fs.writeFile(
          path.join(targetDir, `${componentName}.css`),
          stylesContent
        );
      }
    }

    spinner.succeed('组件创建成功！');
  } catch (error) {
    spinner.fail('组件创建失败！');
    throw error;
  }
}

// component命令
program
  .command('component <name>')
  .alias('c')
  .description('快速创建组件')
  .action(async componentName => {
    try {
      const answers = await inquirer.prompt([
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
      ]);

      // 执行组件生成
      await generateComponent(componentName, answers);

      console.log(chalk.green(`✅ 组件 ${componentName} 创建成功！`));
    } catch (error) {
      console.error(chalk.red('创建组件失败：'), error.message);
    }
  });

program
  .command('generate')
  .alias('g')
  .description('使用 plop 生成器创建组件、hook等')
  .action(() => {
    try {
      const { spawn } = require('child_process');
      const child = spawn('npx', ['plop'], {
        cwd: __dirname,
        stdio: 'inherit'
      });

      child.on('close', code => {
        if (code !== 0) {
          console.log(chalk.red('生成器执行失败'));
        }
      });
    } catch (error) {
      console.error(chalk.red('生成失败：'), error.message);
    }
  });

// 添加帮助信息
program.on('command:*', () => {
  console.log(chalk.red('未知的命令：'), program.args.join(' '));
  console.log(chalk.blue('使用 oam --help 查看可用命令'));
  process.exit(1);
});

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse();
