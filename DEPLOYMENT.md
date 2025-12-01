# 生产环境部署指南

本文档提供了将「要事第一」应用部署到生产环境的详细步骤和注意事项。

## 构建结果

项目已成功构建，构建产物位于 `dist/` 目录下，包含以下文件：

- `index.html` - 主页面文件
- `assets/index-CKcuHqeb.css` - 压缩后的CSS文件
- `assets/index-Bo-W2ylu.js` - 压缩后的JavaScript文件
- `assets/vite.svg` - 静态资源文件

## 部署步骤

### 1. 选择部署平台

您可以将应用部署到以下常见平台：

- **Netlify** - 简单易用，支持自动部署
- **Vercel** - 适合React应用，提供优秀的性能
- **GitHub Pages** - 如果您使用GitHub管理代码
- **AWS S3 + CloudFront** - 企业级部署方案
- **Nginx/Apache服务器** - 自托管方案

### 2. 部署方法

#### Netlify部署

1. 访问 [Netlify](https://www.netlify.com/) 并注册/登录
2. 点击「New site from Git」
3. 选择您的代码仓库
4. 构建命令设置为 `npm run build`
5. 发布目录设置为 `dist`
6. 点击「Deploy site」

#### Vercel部署

1. 访问 [Vercel](https://vercel.com/) 并注册/登录
2. 点击「New Project」
3. 导入您的Git仓库
4. 保持默认设置（构建命令: `npm run build`, 输出目录: `dist`）
5. 点击「Deploy」

#### GitHub Pages部署

1. 安装gh-pages包: `npm install --save-dev gh-pages`
2. 在package.json中添加脚本:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
3. 运行 `npm run deploy`

#### 自托管（Nginx）

1. 将 `dist` 目录复制到服务器上
2. 安装Nginx: `sudo apt-get install nginx`
3. 配置Nginx站点: `/etc/nginx/sites-available/your-site`
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /path/to/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
4. 启用站点并重启Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 注意事项

1. **静态资源处理** - 确保构建后的静态资源能够正确加载
2. **路由配置** - 如果使用客户端路由（如React Router），确保服务器配置正确处理404情况，将所有路由请求指向index.html
3. **环境变量** - 如果应用需要环境变量，请在部署平台上正确配置
4. **缓存策略** - 考虑为静态资源设置适当的缓存策略，以提高性能
5. **HTTPS配置** - 生产环境应启用HTTPS，大多数部署平台提供免费的SSL证书

## 依赖管理

注意：项目使用了React 19.2.0版本，但react-beautiful-dnd库最高支持React 18。为解决依赖冲突，使用了`--legacy-peer-deps`参数进行安装。

如需在新环境中安装依赖，请使用：
```bash
npm install --legacy-peer-deps
```

## 后续维护

1. 更新代码后重新运行构建命令: `npm run build`
2. 重新部署更新后的构建产物
3. 定期更新依赖以获取安全补丁和性能改进

---

如有任何问题或需要额外的部署支持，请参考对应平台的官方文档。