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
  .command('create')
  .description('创建新的前端项目')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称：',
          validate: function (value) {
            if (/.+/.test(value)) {
              return true;
            }
            return '项目名称是必填的';
          }
        },
        {
          type: 'list',
          name: 'template',
          message: '请选择项目模板：',
          choices: [
            { name: 'ruoyi-vue3 - 企业级后台管理系统', value: 'ruoyi-vue3' }
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

      const projectName = answers.projectName;
      const targetDir = path.resolve(process.cwd(), projectName);

      if (await fs.pathExists(targetDir)) {
        console.log(chalk.red(`目标目录 ${projectName} 已存在！`));
        return;
      }

      const spinner = ora('正在从 GitLab 克隆 ruoyi-vue3 模板...').start();
      await createProjectFromGitLab(targetDir, projectName, answers);
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
  .description('列出可用信息')
  .action(async () => {
    const { default: chalk } = await import('chalk');
    console.log(chalk.blue('📋 oamfe CLI 信息：'));
    console.log('  • create - 创建新项目（支持多种模板）');
    console.log('  • component - 生成 React、Vue 或原生 JS 组件');
    console.log('  • generate - 使用 plop 生成器');
    console.log('');
    console.log(chalk.yellow('📦 支持的模板：'));
    console.log('  🏢 ruoyi-vue3 - 企业级后台管理系统');
    console.log(
      '    GitLab: ssh://git@gitlab.juneyaoair.com:10022/yidongyunxing/ruoyi-vue3.git'
    );
  });

async function createProjectFromGitLab(targetDir, projectName, options) {
  const { spawn } = require('child_process');
  const tempDir = path.join(require('os').tmpdir(), `ruoyi-vue3-${Date.now()}`);

  try {
    // 克隆 GitLab 仓库到临时目录
    console.log(chalk.blue('🔄 正在克隆 GitLab 仓库...'));
    await new Promise((resolve, reject) => {
      const gitClone = spawn('git', [
        'clone',
        '--depth',
        '1',
        'ssh://git@gitlab.juneyaoair.com:10022/yidongyunxing/ruoyi-vue3.git',
        tempDir
      ]);

      gitClone.stdout.on('data', data => {
        console.log(data.toString());
      });

      gitClone.stderr.on('data', data => {
        console.error(data.toString());
      });

      gitClone.on('close', code => {
        if (code === 0) {
          console.log(chalk.green('✅ Git 仓库克隆成功'));
          resolve();
        } else {
          reject(new Error(`Git clone failed with code ${code}`));
        }
      });

      gitClone.on('error', reject);
    });

    // 复制模板文件到目标目录
    await fs.ensureDir(targetDir);
    await fs.copy(tempDir, targetDir);

    // 清理临时目录
    await fs.remove(tempDir);

    // 更新 package.json
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

    // 更新 README.md
    const readmePath = path.join(targetDir, 'README.md');
    if (await fs.pathExists(readmePath)) {
      let readme = await fs.readFile(readmePath, 'utf8');
      readme = readme.replace(/{{projectName}}/g, projectName);
      readme = readme.replace(/{{description}}/g, options.description);
      await fs.writeFile(readmePath, readme);
    }

    // 删除 .git 目录以创建新的仓库
    const gitDir = path.join(targetDir, '.git');
    if (await fs.pathExists(gitDir)) {
      await fs.remove(gitDir);
    }
  } catch (error) {
    // 清理临时目录
    if (await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
    throw error;
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
  .action(async () => {
    try {
      const currentDir = process.cwd();
      let targetDir = currentDir;

      // 检查是否在 CLI 工具目录中
      if (currentDir === __dirname || currentDir === path.dirname(__dirname)) {
        console.log(chalk.red('❌ 不能在 CLI 工具目录中生成组件！'));
        console.log(chalk.yellow('💡 请先在您的项目目录中运行此命令：'));
        console.log(chalk.cyan('   cd your-project-directory'));
        console.log(chalk.cyan('   oamfe g'));

        // 提供一个选项让用户输入目标目录
        const { useCustomDir } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'useCustomDir',
            message: '是否要指定目标项目目录？',
            default: true
          }
        ]);

        if (useCustomDir) {
          const { targetDir: userDir } = await inquirer.prompt([
            {
              type: 'input',
              name: 'targetDir',
              message: '请输入目标项目目录的绝对路径：',
              validate: function (value) {
                if (!/.+/.test(value)) {
                  return '目标目录路径是必填的';
                }
                if (!fs.existsSync(value)) {
                  return '目标目录不存在';
                }
                return true;
              }
            }
          ]);
          targetDir = userDir;
        } else {
          return;
        }
      }

      console.log(chalk.blue(`🔄 在 ${targetDir} 目录中执行生成器...`));

      const { spawn } = require('child_process');
      const child = spawn(
        'npx',
        [
          'plop',
          '--plopfile',
          path.join(__dirname, 'plopfile.js'),
          '--dest',
          targetDir
        ],
        {
          cwd: targetDir,
          stdio: 'inherit'
        }
      );

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
