# 人力资源管理系统 - 项目总结

## 项目概述

这是一个功能完整的企业级人力资源管理系统，采用前后端分离架构，适合作为简历项目展示。项目包含完整的用户认证、员工管理、部门管理、考勤管理和薪资管理功能。

## 技术架构

### 前端技术栈
- **Vue 3** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Element Plus** - UI组件库
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **Axios** - HTTP请求
- **ECharts** - 数据可视化

### 后端技术栈
- **Spring Boot 3.2** - Java快速开发框架
- **Spring Security** - 安全框架
- **JWT** - 身份认证
- **MyBatis Plus** - ORM框架
- **MySQL 8.0** - 数据库
- **Redis** - 缓存

## 核心功能

### 1. 用户认证模块
- JWT Token认证机制
- 登录/注册功能
- 密码加密存储
- 角色权限控制

### 2. 员工管理
- 员工信息CRUD
- 条件搜索、分页
- Excel导入/导出
- 批量操作

### 3. 部门管理
- 树形部门结构
- 部门CRUD
- 部门员工查看

### 4. 考勤管理
- 上下班打卡
- 考勤记录查询
- 考勤统计
- 补卡功能

### 5. 薪资管理
- 薪资自动计算
- 薪资确认
- 薪资统计
- 批量操作

### 6. 数据可视化
- 仪表盘展示
- ECharts图表
- 实时数据

## 项目结构

```
hr-system/
├── frontend/              # Vue3前端项目
│   ├── src/
│   │   ├── api/          # API接口 (6个文件)
│   │   ├── components/   # 公共组件
│   │   ├── layouts/      # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── store/        # Pinia状态管理
│   │   ├── types/        # TypeScript类型
│   │   ├── utils/        # 工具函数
│   │   └── views/        # 页面视图 (7个页面)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/               # Spring Boot后端项目
│   ├── src/main/java/com/hr/system/
│   │   ├── config/       # 配置类 (2个)
│   │   ├── controller/   # 控制器 (6个)
│   │   ├── dto/          # 数据传输对象 (8个)
│   │   ├── entity/       # 实体类 (5个)
│   │   ├── exception/    # 异常处理
│   │   ├── mapper/       # 数据访问层 (5个)
│   │   ├── security/     # 安全配置
│   │   ├── service/      # 业务逻辑层 (5个接口 + 5个实现)
│   │   └── utils/        # 工具类
│   ├── src/main/resources/
│   │   ├── mapper/       # MyBatis XML (3个)
│   │   └── db/           # 数据库脚本
│   └── pom.xml
│
└── README.md
```

## 文件统计

- **总文件数**: 78个
- **前端代码**: 约 3500 行
- **后端代码**: 约 4500 行
- **项目大小**: 约 400KB

## 核心亮点

### 前端亮点
1. TypeScript全程类型支持
2. 组件化开发，代码复用性高
3. 响应式布局，适配多设备
4. 完整的状态管理方案
5. 路由守卫实现权限控制
6. ECharts数据可视化

### 后端亮点
1. RESTful API设计规范
2. JWT无状态认证
3. Spring Security权限控制
4. MyBatis Plus简化开发
5. 全局异常统一处理
6. Bean Validation参数校验
7. 逻辑删除保护数据

## 数据库设计

包含6张核心表：
- `sys_user` - 用户表
- `hr_employee` - 员工表
- `hr_department` - 部门表
- `hr_position` - 职位表
- `hr_attendance` - 考勤表
- `hr_salary` - 薪资表

## 演示数据

系统预置了演示数据：
- 2个用户账号（admin/user）
- 5个部门
- 5个职位
- 5个员工

## 启动方式

### 后端
```bash
cd backend
mvn spring-boot:run
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

## 访问地址

- 前端: http://localhost:3000
- 后端: http://localhost:8080
- 登录账号: admin / 123456

## 适合简历展示的原因

1. **技术栈主流** - 使用Vue3 + Spring Boot等热门技术
2. **功能完整** - 包含企业级系统的核心功能
3. **代码规范** - 遵循最佳实践，结构清晰
4. **前后端分离** - 现代化架构设计
5. **企业级特性** - 认证、权限、数据校验等
6. **可扩展性强** - 易于添加新功能模块

## 学习价值

通过本项目可以学习到：
- 前后端分离架构设计
- RESTful API开发规范
- JWT认证实现
- 数据库设计与优化
- 前端工程化实践
- 企业级代码规范

## 扩展建议

可进一步扩展的功能：
- 招聘管理
- 培训管理
- 绩效考核
- 员工自助
- 报表中心
- 消息通知
- 工作流审批
