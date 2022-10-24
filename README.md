<p align="center">
  <a href="https://ishkong.github.io/go-cqhttp-docs/">
    <img width="160" src="./public/cubilose.png" alt="logo">
  </a>
</p>

<div align="center">

# Cubilose

Cubilose 是基于 [Create-T3-App](https://github.com/mamoe/mirai) 开发的论坛框架，旨在为开发者提供简单易用、高效稳定的论坛搭建体验

</div>

<p align="center">
  <a href="https://raw.githubusercontent.com/SCMU-EA/cubilose/master/LICENSE">
    <img src="https://img.shields.io/github/license/SCMU-EA/cubilose" alt="license">
  </a>
  <a href="https://github.com/SCMU-EA/cubilose/releases">
    <img src="https://img.shields.io/github/v/release/SCMU-EA/cubilose?color=blueviolet&include_prereleases" alt="release">
  </a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FSCMU-EA%2Fcubilose?ref=badge_shield" alt="FOSSA Status">
    <img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FSCMU-EA%2Fcubilose.svg?type=shield" alt="license scan"/>
  </a>
  <a href="https://codecov.io/gh/SCMU-EA/cubilose">
    <img src="https://img.shields.io/codecov/c/github/SCMU-EA/cubilose?style=flat-square" alt="coverage">
  </a>
  <a href="https://www.codefactor.io/repository/github/SCMU-EA/cubilose">
    <img src="https://www.codefactor.io/repository/github/SCMU-EA/cubilose/badge" alt="CodeFactor" />
  </a>
  <a href="https://github.com/SCMU-EA/cubilose/actions">
    <img src="https://github.com/SCMU-EA/cubilose/workflows/CI/badge.svg" alt="action">
  </a>
</p>

<p align="center">
  <a href="#">文档</a>
  ·
  <a href="#">快速开始</a>
  ·
  <a href="#">参与贡献</a>
</p>

# **⚠ 开发中**

项目处于开发设计阶段，目前还不可用

# 如何开发

## 安装 pnpm

```bash
npm i -g pnpm
```

## 克隆仓库

```bash
git clone https://github.com/SCMU-EA/cubilose.git
```

## 初始化

```bash
pnpm prisma migrate dev  # 生成 SQL 文件
pnpm prisma generate     # 生成数据库和 Prisma Client
cp .env.example .env     # 复制环境变量模板 (⚠ 需要自行配置)
```

## 启动开发服务器

```bash
pnpm dev
```
