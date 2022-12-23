module.exports = {
  queryObject: {
    //用户表
    createUserInfo: `create table if not exists user_info(
              id int primary key auto_increment,
              phonenum varchar(11)not null,
              password varchar(255)not null,
              nickname varchar(255)not null
              )`,
    //原料表
    createStapleInfo: `create table if not exists staple_info(
                id int primary key auto_increment,
                material varchar(255)not null,
                authorId varchar(50)not null,
                supplier varchar(255)not null,
                count varchar(255)not null,
                unitPrice varchar(255)not null,
                total varchar(255)not null,
                date varchar(255)not null,
                timestamp varchar(255)not null
            )`,
    //人员表
    createMemberInfo: `create table if not exists member_info(
                id int primary key auto_increment,
                phonenum varchar(11)not null,
                authorId varchar(50)not null,
                name varchar(255)not null,
                address varchar(255)not null,
                date varchar(255)not null,
                timestamp varchar(255)not null
            )`,
    //入库表
    createProductInInfo: `create table if not exists productIn_info(
            id int primary key auto_increment,
            product varchar(50)not null,
            makerId varchar(50)not null,
            count varchar(50)not null,
            unitPrice varchar(50)not null,
            total varchar(50)not null,
            date varchar(255)not null,
            timestamp varchar(255)not null
        )`,
  },
};
