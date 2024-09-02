# 使用Node官方提供的镜像作为基础镜像
FROM node:latest

# 设置工作目录
WORKDIR /app

# 复制package.json文件和package-lock.json文件到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 暴露容器的端口号
EXPOSE 3000

# 运行React应用
CMD ["npm", "start"]
# CMD bash
