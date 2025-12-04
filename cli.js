#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

const program = new Command();

program
  .name('oamfe')
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
  .action(() => {
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

program.parse();
