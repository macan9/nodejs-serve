# nodejs-sequelize(orm)

## 1. 安装 sequelize-cli 框架
由于sequelize-cli依赖于sequelize包，sequelize又需要使用mysql2包来连接数据库，所以我们需要安装三个包。

`npm i sequelize mysql2 sequelize-cli --save -g`

当前目录新建配置文件 conf/db.config.js 

## 2. 初始化项目 创建和删除数据库
执行 `sequelize-cli init` 命令初始化sequelize项目，成功执行之后会创建4个文件夹。
- config： 包含配置文件，它高速CLI如何连接数据库
- models： 包含你项目的所有模型
- migrations： 包含所有迁移文件
- seeders： 包含所有种子文件

config文件夹中的config.json配置有3个环境，分别是开始环境、测试环境、生产环境。
![1607739072441](https://gitee.com/mc150324/PicGo/raw/master/img/2217722-20201219122108222-927139318.png)

执行 `sequelize-cli db:create` 命令
sequelize-cli 会根据 config/config.json 里面的环境配置信息自动为我们创建数据库，默认情况会根据开发环境信息进行配置。
`sequelize-cli db:drop` 命令会根据配置信息删除数据库。

## 3. 自定义环境变量

1. 设置环境变量。

```shell
#设置环境变量NODE_ENV的值为home
set NODE_ENV=home
#删除环境变量，此时会得到home
echo %NODE_ENV%
#还原NODE_ENV的环境变量
set NODE_ENV=
```

2. 在config/config.json中新增一项环境配置。

``` json
 "home": {
    "username": "root",
    "password": "root",
    "database": "c4az6_home",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
```
3. 再使用sequelize-cli创建数据库就会创建出home环境配置下的数据库了。
![1607740330502](https://gitee.com/mc150324/PicGo/raw/master/img/2217722-20201219122108935-1085354093.png)

## 4. 创建模型和执行迁移
### 创建模型
使用 `model:generate` 或者 `model:create` 命令创建一个模型文件
参数：
--name：模型名称，必须
--attributes：字段列表，必须
参考:model 文件夹下会生成一个 user.js 模型文件
![image-20230415213922683](https://gitee.com/mc150324/PicGo/raw/master/img/image-20230415213922683.png)
### 执行迁移
通过生成的 model 文件对数据库进行结构的创建、升级（修改）等操作
使用 `sequelize-cli db:migrate` 会找到迁移文件，然后执行里面的代码创建表和字段，同时会在数据库中创建一个sequelizemeta的表来记录迁移的脚本名称。
![1607741921213](https://gitee.com/mc150324/PicGo/raw/master/img/2217722-20201219122109214-1307896979.png)

通过 `sequelize-cli db:migrate:status` 命令查看迁移文件的状态
### 撤销迁移
`db:migrate:undo` 命令会撤销最近的一次迁移操作，会删除最近一次创建的表，会把sequelizemeta表里面的最近一次记录删除。
有时候我们撤销不一定就非要删表，我们可能会有其他动作，这个时候我们就可以通过手动修改迁移脚本中的down函数代码来实现自定义撤销操作。
另外我们还可以通过 `db:migrate:undo:all` 命令来撤销所有的迁移脚本。
通过 `db:migrate:undo --name` 脚本名命令指定撤销具体的迁移脚本。
``` shell
sequelize-cli db:migrate:undo 20201212030431-create-message.js
```
### 在表中添加字段
如何在不影响表原有的情况下添加新的字段？例如我们给users表中增加一个age字段。
创建迁移文件。
``` shell
sequelize-cli migration:create --name UserAddAge
```
创建之后找到迁移脚本文件，然后在up和down中增加如下代码。
``` js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'users',
      'age', {
        type: Sequelize.TINYINT
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'users',
      'age'
    )
  }
};
```
addColumn这个API的第一个参数是你要添加列的表名，age是添加的字段，type是数据类型。
removeColumn这个API是删除列。
添加代码之后再执行db:migrate命令发现已经有了age字段了。

## 5. 种子文件seeder
### 创建种子文件
命令：`sequelize-cli seed:create --name userTest`
### 添加测试数据
``` js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [
      {
        username: '张三',
        age: 20
      },
      {
        username: '李四',
        age: 21
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
```
up函数里面的 `bulkInsertAPI` 第一个参数是要操作的表名，第二个参数是要插入的数据，是一个数组对象的格式。
down函数里面的 `bulkDeleteAPI` 是用来删除数据的，这里是将users表的数据清空
### 运行种子文件
命令：`sequelize-cli db:seed:all`
指定运行种子文件：`db:seed` 种子文件
运行所有种子文件：`db:seed:all`
### 撤销种子文件
命令：`sequelize-cli db:seed:undo`
指定撤销种子文件：`db:seed:undo` 种子文件
撤销所有种子文件：`db:seed:undo:all`
如果哪天测试数据被我玩坏了，用这个命令就可以很方便的还原。
种子文件添加、撤销默认没有进行记录，因此我们需要手动添加记录，方便以后查看、溯源。
官方文档告诉我们需要在config/config.json配置文件中添加配置。
通过JSON的方式存储。
``` json
"development": {
    "username": "root",
    "password": "root",
    "database": "c4az6_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "seederStorage": "json",
    "seederStoragePath": "userTestDataLog.json"
}
```
通过数据库存储。
``` json
  "development": {
    "username": "root",
    "password": "root",
    "database": "c4az6_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "seederStorage": "sequelize",
    "seederStorageTableName": "userTestDataLog"
  },
  ```



