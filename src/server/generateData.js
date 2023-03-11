//disabled es-lint next line

const mock = require("./mock");
const cuid = require("cuid");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function generateUsers() {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      id: cuid(),
      username: mock.getRandomName(),
      password: mock.getRandomPassWord(),
      avatar: "http://localhost:9000/image/hacker.png",
      description: "这个人很懒什么也没有留下",
      email: mock.getRandomEmail(),
    };
    try {
      await prisma.user.create({
        data: user,
      });
      console.log(user);
    } catch (e) {
      throw "xxx";
    }
  }
}
async function generateBlogs() {
  const users = await prisma.user.findMany();
  const tags = await prisma.tag.findMany({
    take: 3,
  });
  const type = await prisma.type.findFirst();
  let i = 0;
  for (let user of users) {
    const blog = {
      id: cuid(),
      userId: user.id,
      title: "测试数据" + i,
      content: "测试内容",
      description: "测试描述",
      published: true,
      firstPicture: "http://127.0.0.1:9000/image/books.jpg",
      createTime: new Date(),
      tags: { connect: tags.map((p) => ({ id: p.id })) },
      typeId: type.id,
    };
    try {
      await prisma.blog.create({
        data: blog,
      });
    } catch (e) {
      throw "xxx";
    }
  }
}
// generateUsers();
generateBlogs();
