# 汉字游戏 - GitHub Pages 部署指南

本指南将帮助您将汉字学习游戏部署到GitHub Pages上，让其他用户能够通过网络访问您的游戏。

## 1. GitHub Pages 基本概念

GitHub Pages是GitHub提供的一项静态网站托管服务，允许您直接从GitHub仓库托管网站：

- **免费托管**：可以免费托管您的React应用
- **自动构建**：支持自动构建和部署流程
- **自定义域名**：可以使用自己的域名
- **HTTPS支持**：自动启用HTTPS加密

GitHub Pages有两种类型：
1. **用户/组织页面**：从特定命名的仓库发布（`username.github.io`）
2. **项目页面**：从任何仓库的特定分支发布（通常是`gh-pages`分支）

本项目使用的是项目页面类型。

## 2. 手动部署步骤

如果您想手动部署应用到GitHub Pages，请按照以下步骤操作：

### 2.1 更新package.json文件中的homepage字段

打开`package.json`文件，确保`homepage`字段已设置：

```
"homepage": "https://您的GitHub用户名.github.io/hanzi-game",
```

请将`您的GitHub用户名`替换为您实际的GitHub用户名。

### 2.2 安装gh-pages包

如果尚未安装gh-pages包，请运行以下命令：

```
npm install --save-dev gh-pages
```

### 2.3 构建并部署应用

运行以下命令构建并部署应用：

```
npm run build
npm run deploy
```

这将执行以下操作：
1. 构建项目，创建优化后的生产版本
2. 将构建文件发布到`gh-pages`分支
3. 将该分支推送到GitHub

## 3. GitHub仓库设置

为了确保您的GitHub Pages部署正常工作，需要正确配置GitHub仓库：

### 3.1 启用GitHub Pages

1. 在GitHub上打开您的仓库
2. 点击"Settings"（设置）选项卡
3. 滚动到"Pages"部分
4. 在"Source"下，选择"Deploy from a branch"
5. 在"Branch"下拉菜单中，选择"gh-pages"和"/root"文件夹
6. 点击"Save"（保存）

### 3.2 查看部署状态

保存后，GitHub将开始构建您的站点。在"GitHub Pages"部分，您将看到一条消息，如："Your site is being published at https://您的用户名.github.io/hanzi-game"。

## 4. 自动部署流程

为了实现持续集成/持续部署(CI/CD)，我们已经配置了GitHub Actions工作流：

### 4.1 GitHub Actions工作流

项目中已经包含`.github/workflows/deploy.yml`配置文件，它会在每次推送到main分支时自动构建并部署应用：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
```

工作流程会：
1. 检出代码
2. 设置Node.js环境
3. 安装依赖
4. 构建项目
5. 部署到GitHub Pages

### 4.2 验证自动部署

当您将更改推送到`main`分支时：
1. 访问仓库的"Actions"选项卡
2. 查看最新的工作流运行状态
3. 如果工作流成功完成，您的更改应该已经部署到GitHub Pages上

## 5. 配置自定义域名（可选）

如果您希望使用自己的域名而不是github.io子域，请按照以下步骤操作：

### 5.1 添加自定义域名

1. 在GitHub仓库中，转到"Settings" > "Pages"
2. 在"Custom domain"部分，输入您的域名（例如：`hanzi-game.example.com`）
3. 点击"Save"

### 5.2 配置DNS记录

在您的域名注册商或DNS提供商处，添加以下DNS记录：

对于apex域（example.com）：
- 创建4个A记录指向GitHub Pages的IP地址：
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```

对于子域（hanzi-game.example.com）：
- 创建CNAME记录，指向`您的用户名.github.io`

### 5.3 创建CNAME文件

为确保自定义域名在部署后保留：

1. 在`public`文件夹中创建名为`CNAME`的文件（无扩展名）
2. 在文件中写入您的自定义域名（例如：`hanzi-game.example.com`）
3. 保存文件并提交到仓库

## 6. 部署排错指南

如果您在部署过程中遇到问题，可以参考以下常见问题解决方法：

### 6.1 404错误页面

**症状**：部署后访问网站显示404错误。

**可能原因与解决方法**：
- **路径问题**：确保`homepage`字段设置正确
- **构建问题**：检查构建过程是否成功完成
- **分支问题**：确认GitHub Pages配置为从正确的分支发布

### 6.2 静态资源404错误

**症状**：页面加载，但图像、CSS或JavaScript资源显示404错误。

**解决方法**：
- 确保所有资源路径使用相对路径
- 检查`public/index.html`中的`%PUBLIC_URL%`使用情况
- 在React Router中使用`basename`属性：
  ```jsx
  <Router basename={process.env.PUBLIC_URL}>
  ```

### 6.3 路由问题

**症状**：主页正常工作，但刷新非主页路由或直接访问非主页URL会显示404。

**解决方法**：
1. 创建一个`public/404.html`文件，内容如下：
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    const path = window.location.pathname;
    localStorage.setItem('redirect', path);
    window.location.href = '/hanzi-game';
  </script>
</head>
<body>
  重定向中...
</body>
</html>
```

2. 在`public/index.html`文件中添加以下脚本：
```html
<script>
  (function() {
    const redirect = localStorage.getItem('redirect');
    if (redirect && redirect !== window.location.pathname) {
      localStorage.removeItem('redirect');
      window.history.replaceState(null, null, redirect);
    }
  })();
</script>
```

### 6.4 GitHub Actions部署失败

**症状**：GitHub Actions工作流运行失败。

**解决方法**：
1. 检查工作流日志以查看具体错误
2. 确保工作流配置文件中的路径与项目结构匹配
3. 验证仓库权限设置，确保Actions有权限部署到Pages

## 7. 最佳实践

1. **测试构建**：在推送前在本地运行`npm run build`确保构建成功
2. **使用环境变量**：为不同环境配置使用`.env`文件
3. **保持依赖更新**：定期运行`npm update`更新依赖包
4. **定期检查部署状态**：确保网站持续可用

## 8. 相关资源

- [GitHub Pages官方文档](https://docs.github.com/en/pages)
- [Create React App部署文档](https://create-react-app.dev/docs/deployment/#github-pages)
- [React Router与GitHub Pages](https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing)

如果您有任何问题或遇到未在本指南中涵盖的问题，请在GitHub仓库中开一个issue寻求帮助。

祝您部署顺利！