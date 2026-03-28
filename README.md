# 人力资源管理系统 (HR Management System)

一个功能完善的企业级人力资源管理系统，采用前后端分离架构，适合作为简历项目展示。

## 项目简介

本项目是一个完整的人力资源管理解决方案，包含员工管理、部门管理、考勤管理、薪资管理等核心功能模块。系统设计遵循企业级开发规范，代码结构清晰，功能完整，可直接用于简历展示。

## 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - 基于Vue 3的组件库
- **Pinia** - Vue官方推荐的状态管理方案
- **Vue Router** - Vue官方路由管理器
- **Axios** - HTTP客户端
- **ECharts** - 数据可视化图表库
- **Day.js** - 轻量级日期处理库

### 后端
- **Spring Boot 3.2** - 快速开发框架
- **Spring Security** - 安全认证与授权
- **JWT** - JSON Web Token身份认证
- **MyBatis Plus** - 优秀的ORM框架
- **MySQL 8.0** - 关系型数据库
- **Redis** - 缓存数据库
- **Maven** - 项目构建工具
- **Lombok** - 代码简化工具

## 功能模块

### 1. 用户认证模块
- 用户登录/注册
- JWT Token认证
- 密码加密存储
- 角色权限控制

### 2. 员工管理模块
- 员工信息CRUD
- 条件搜索与分页
- 数据导入/导出（Excel）
- 员工状态管理

### 3. 部门管理模块
- 部门树形结构
- 部门CRUD
- 部门员工列表

### 4. 考勤管理模块
- 上下班打卡
- 考勤记录查询
- 考勤统计分析
- 补卡申请

### 5. 薪资管理模块
- 薪资计算
- 薪资确认
- 薪资统计
- 薪资导出

### 6. 数据可视化
- 仪表盘数据展示
- ECharts图表
- 实时数据统计

## 项目结构

```
hr-system/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API接口
│   │   ├── components/      # 公共组件
│   │   ├── layouts/         # 布局组件
│   │   ├── router/          # 路由配置
│   │   ├── store/           # Pinia状态管理
│   │   ├── types/           # TypeScript类型定义
│   │   ├── utils/           # 工具函数
│   │   ├── views/           # 页面视图
│   │   ├── App.vue          # 根组件
│   │   └── main.ts          # 入口文件
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                  # 后端项目
│   ├── src/main/java/com/hr/system/
│   │   ├── config/          # 配置类
│   │   ├── controller/      # 控制器层
│   │   ├── dto/             # 数据传输对象
│   │   ├── entity/          # 实体类
│   │   ├── exception/       # 异常处理
│   │   ├── mapper/          # 数据访问层
│   │   ├── security/        # 安全配置
│   │   ├── service/         # 业务逻辑层
│   │   └── utils/           # 工具类
│   ├── src/main/resources/
│   │   ├── mapper/          # MyBatis XML映射文件
│   │   ├── db/              # 数据库脚本
│   │   └── application.yml  # 应用配置
│   └── pom.xml
│
└── README.md
```

## 快速开始

### 环境要求
- JDK 17+
- Node.js 18+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.8+

### 后端部署

1. 创建数据库
```sql
-- 执行数据库脚本
source backend/src/main/resources/db/schema.sql
```

2. 修改配置文件
```yaml
# backend/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/hr_system
    username: root
    password: your_password
  
  redis:
    host: localhost
    port: 6379
```

3. 启动项目
```bash
cd backend
mvn spring-boot:run
```

后端服务默认运行在 http://localhost:8080

### 前端部署

1. 安装依赖
```bash
cd frontend
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

前端服务默认运行在 http://localhost:3000

3. 生产构建
```bash
npm run build
```

## 演示账号

- **管理员账号**: admin / 123456
- **普通用户**: user / 123456

## 核心亮点

### 前端亮点
1. **TypeScript全程类型支持** - 提升代码质量和开发效率
2. **组件化开发** - 高内聚低耦合的组件设计
3. **响应式布局** - 适配各种屏幕尺寸
4. **状态管理** - Pinia实现全局状态管理
5. **路由守卫** - 实现权限控制和登录验证
6. **数据可视化** - ECharts实现图表展示

### 后端亮点
1. **RESTful API设计** - 规范的接口设计
2. **JWT认证** - 无状态的安全认证机制
3. **Spring Security** - 完善的权限控制
4. **MyBatis Plus** - 简化数据库操作
5. **全局异常处理** - 统一的错误响应
6. **数据校验** - Bean Validation参数校验

## 学习价值

本项目涵盖了企业级开发的常用技术栈和最佳实践：

- 前后端分离架构设计
- RESTful API设计与实现
- 用户认证与权限控制
- 数据库设计与优化
- 前端工程化实践
- 代码规范与文档编写

## 扩展建议

可以根据需要添加以下功能：
- 招聘管理模块
- 培训管理模块
- 绩效管理模块
- 员工自助服务
- 报表统计中心
- 系统日志审计
- 消息通知系统

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎交流讨论。
