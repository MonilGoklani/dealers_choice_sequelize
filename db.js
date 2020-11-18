const Sequelize = require('sequelize');
const { STRING,UUID,UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/user_posts_db');

const Users = conn.define('users',{
    id:{
        type:UUID,
        primaryKey:true,
        defaultValue: UUIDV4
    },
    name:{
        type:STRING(30),
        allowNull:false,
        unique:true
    }
})

const Posts = conn.define('posts',{
    id:{
        type:UUID,
        primaryKey:true,
        defaultValue: UUIDV4
    },
    post:{
        type:STRING(1000),
        allowNull:false,
        unique:true
    }
})

Posts.belongsTo(Users);
Users.hasMany(Posts);

Posts.belongsTo(Posts,{as: 'parentPost'});
Posts.hasMany(Posts,{foreignKey:'parentPostId'});

const syncAndSeed = async() => {
await conn.sync({force:true});

const [adam,bob,charlie,derek] = await Promise.all(
    ['Adam','Bob','Charlie','Derek'].map(name=>Users.create({name}))
    )

const [post1,post2,post3,post4,post5,post6,post7,post8] = await Promise.all(
    ['Apple Pie is the best kind of Pie',
    'Anybody got movie recommendations?',
    'Pecan Pie is better',
    'Roger Federer is the GOAT',
    'Psssht! PeCAN\'T Pie can only dream of being as good',
    'The Shawshank Redemption',
    'The Godfather',
    'Nadal is right up there with him'
    ].map(post=>Posts.create({post}))
    )  

post1.userId=bob.id; 
post2.userId=derek.id;
post3.userId=adam.id; post3.parentPostId=post1.id;
post4.userId=charlie.id;
post5.userId=bob.id;post5.parentPostId=post1.id
post6.userId=bob.id;post6.parentPostId=post2.id
post7.userId=adam.id;post7.parentPostId=post2.id
post8.userId=bob.id;post8.parentPostId=post4.id

await Promise.all([
post1.save(),
post2.save(),
post3.save(),
post4.save(),
post5.save(),
post6.save(),
post7.save(),
post8.save()
])
}


module.exports={
    syncAndSeed,
    conn,
    model:{
        Posts,
        Users
    }
}