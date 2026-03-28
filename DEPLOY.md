# HR管理系统 - 部署指南

## 项目简介
- **技术栈**: Spring Boot 3 + Vue 3 + H2数据库
- **功能**: 员工管理、部门管理、考勤管理、薪资管理
- **默认账号**: admin/123456 或 user/123456

---

## 方案一：Railway部署（推荐，免费）

Railway提供免费额度，适合展示项目。

### 步骤：

1. **注册账号**
   - 访问 https://railway.app
   - 使用GitHub账号登录

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 授权并选择你的代码仓库

3. **部署配置**
   - Railway会自动识别 `railway.toml` 配置文件
   - 无需额外配置，点击部署即可

4. **获取域名**
   - 部署完成后，Railway会自动分配一个域名
   - 格式：`https://hr-management-system-xxxx.up.railway.app`

### 优点：
- ✅ 完全免费
- ✅ 自动CI/CD
- ✅ 自动HTTPS
- ✅ 全球CDN

### 缺点：
- ⚠️ 免费版有休眠机制（15分钟无访问会休眠，首次访问需等待唤醒）

---

## 方案二：Render部署（免费）

### 步骤：

1. **注册账号**
   - 访问 https://render.com
   - 使用GitHub账号登录

2. **创建Web Service**
   - 点击 "New +" → "Web Service"
   - 选择你的GitHub仓库

3. **配置服务**
   ```
   Name: hr-management-system
   Runtime: Docker
   Branch: main
   Root Directory: (留空)
   Docker Command: (留空，使用Dockerfile)
   ```

4. **环境变量**（可选）
   ```
   JWT_SECRET=your-secret-key
   ```

5. **部署**
   - 点击 "Create Web Service"
   - 等待构建完成（约5-10分钟）

### 优点：
- ✅ 支持Docker
- ✅ 免费SSL证书
- ✅ 自动部署

### 缺点：
- ⚠️ 免费版休眠后首次访问慢（约30秒唤醒时间）

---

## 方案三：阿里云/腾讯云服务器（付费，国内访问快）

适合需要稳定服务、国内快速访问的场景。

### 推荐配置：
- **CPU**: 1核
- **内存**: 2GB
- **带宽**: 1Mbps
- **系统**: Ubuntu 22.04 LTS
- **价格**: 约100元/年（学生优惠）

### 部署步骤：

#### 1. 购买服务器
- 阿里云：https://www.aliyun.com
- 腾讯云：https://cloud.tencent.com
- 选择 "轻量应用服务器" 或 "云服务器ECS"

#### 2. 连接服务器
```bash
ssh root@你的服务器IP
```

#### 3. 安装Java环境
```bash
# 更新系统
apt update && apt upgrade -y

# 安装Java 17
apt install openjdk-17-jre-headless -y

# 验证安装
java -version
```

#### 4. 上传项目文件
```bash
# 在本地执行，将jar文件上传到服务器
scp backend/target/hr-management-system-1.0.0.jar root@你的服务器IP:/opt/
```

#### 5. 创建启动脚本
```bash
cat > /opt/start.sh << 'EOF'
#!/bin/bash
cd /opt
nohup java -jar hr-management-system-1.0.0.jar --spring.profiles.active=prod > app.log 2>&1 &
echo $! > app.pid
echo "应用已启动"
EOF

chmod +x /opt/start.sh
```

#### 6. 创建停止脚本
```bash
cat > /opt/stop.sh << 'EOF'
#!/bin/bash
if [ -f /opt/app.pid ]; then
    kill $(cat /opt/app.pid)
    rm /opt/app.pid
    echo "应用已停止"
else
    echo "应用未运行"
fi
EOF

chmod +x /opt/stop.sh
```

#### 7. 配置Nginx反向代理（推荐）
```bash
# 安装Nginx
apt install nginx -y

# 配置Nginx
cat > /etc/nginx/sites-available/hr-system << 'EOF'
server {
    listen 80;
    server_name 你的域名或IP;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 启用配置
ln -s /etc/nginx/sites-available/hr-system /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# 测试并重载Nginx
nginx -t
systemctl reload nginx
```

#### 8. 配置HTTPS（可选，使用Certbot）
```bash
# 安装Certbot
apt install certbot python3-certbot-nginx -y

# 申请证书（需要先有域名解析到服务器）
certbot --nginx -d 你的域名

# 自动续期测试
certbot renew --dry-run
```

#### 9. 启动应用
```bash
/opt/start.sh
```

#### 10. 查看日志
```bash
tail -f /opt/app.log
```

---

## 方案四：Docker部署（任何支持Docker的平台）

### 本地构建并运行：

```bash
# 构建镜像
docker build -t hr-management-system .

# 运行容器
docker run -d \
  --name hr-system \
  -p 8080:8080 \
  -e JWT_SECRET=your-secret-key \
  --restart unless-stopped \
  hr-management-system
```

### 推送到Docker Hub：

```bash
# 登录Docker Hub
docker login

# 标记镜像
docker tag hr-management-system 你的用户名/hr-management-system:latest

# 推送镜像
docker push 你的用户名/hr-management-system:latest
```

---

## 各方案对比

| 方案 | 费用 | 访问速度 | 稳定性 | 适合场景 |
|------|------|----------|--------|----------|
| Railway | 免费 | 海外快 | 有休眠 | 简历展示 |
| Render | 免费 | 海外快 | 有休眠 | 简历展示 |
| 阿里云/腾讯云 | ~100元/年 | 国内快 | 稳定 | 正式项目 |
| Docker | 取决于平台 | 取决于平台 | 取决于平台 | 灵活部署 |

---

## 常见问题

### 1. 如何更新部署？

**Railway/Render**: 推送代码到GitHub，自动重新部署

**云服务器**:
```bash
/opt/stop.sh
# 上传新的jar文件
/opt/start.sh
```

### 2. 如何查看日志？

**Railway/Render**: 在平台控制台查看

**云服务器**:
```bash
tail -f /opt/app.log
```

### 3. 如何备份数据？

由于使用H2内存数据库，数据在重启后会重置。如需持久化，建议：
- 使用H2文件模式（修改application-prod.yml）
- 或切换到MySQL/PostgreSQL

### 4. 自定义域名？

**Railway**: 在设置中添加自定义域名

**Render**: 在设置中添加自定义域名

**云服务器**: 配置Nginx并申请SSL证书

---

## 需要帮助？

如有部署问题，可以：
1. 查看各平台的官方文档
2. 在GitHub Issues中提问
3. 搜索相关错误信息

---

**部署完成后，您将获得一个可以写进简历的在线链接！** 🎉
