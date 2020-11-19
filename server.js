
const {syncAndSeed,conn,model:{Posts,Users}} = require('./db');
const postList = require('./views/postList');
const postThread = require('./views/postThread');
const express = require('express');
const {Op} = require('sequelize');
const app = express();
const path = require('path');


app.use('/public',express.static(path.join(__dirname+'/public')));
app.use(express.urlencoded({extended:false}));
app.use(require('method-override')('_method'));

app.get('/',(req,res,next)=>{
    res.redirect('/api/postList')
});

app.delete('/api/postList/postThread/:id',async(req,res,next)=>{
    try{
        const post = await Posts.findByPk(req.params.id)
        const parentId = post.parentPostId
        await post.destroy()
        res.redirect(`/api/postList/${parentId}`)
    }catch(error){
        next(error)
    }
})

app.delete('/api/postList/:id',async(req,res,next)=>{
    try{
        const subposts = await Posts.findAll({
            include: {
                model:Posts,
                as:'parentPost'
            },
            where:{
                parentPostId:req.params.id
            }
        })
        await Promise.all(subposts.map(post=>{
            post.destroy()
        }))
        const post = await Posts.findByPk(req.params.id)
        await post.destroy()
        res.redirect('/')
    }catch(error){
        next(error)
    }
})

app.post('/api/postList/',async(req,res,next)=>{
    try{
        const newUser = await Users.create({name:req.body.name});
        const newPost = await Posts.create({post:req.body.post});
        newPost.userId= newUser.id;
        newPost.parentPostId=null;
        await newPost.save();
        res.redirect('/');

    }catch(error){
        next(error);
    }
})

app.post('/api/postList/:id',async(req,res,next)=>{
    try{
        const newUser = await Users.create({name:req.body.name});
        const newPost = await Posts.create({post:req.body.post});
        newPost.userId= newUser.id;
        newPost.parentPostId=req.params.id;
        await newPost.save();
        res.redirect(`/api/postList/${req.params.id}`);

    }catch(error){
        next(error);
    }
})

app.get('/api/postList',async(req,res,next)=>{
    try{
        const parentPosts = await Posts.findAll({
            include: [
                {
                    model:Posts,
                    as:'parentPost'
                },
                {
                   model: Users
                }
            ],
            order:[
                ['post']
            ],
            where: {
                parentPostId: {
                    [Op.is]:null
                }
            }
        });
        res.send(await postList());
    }catch(error){
        next(error);
    }
})

app.get('/api/postList/:id', async(req,res,next)=>{
    try{
        const posts = await Posts.findAll({
            include: [
                {
                    model:Posts,
                    as:'parentPost'
                },
                {
                   model: Users
                }
            ],
            order:[
                ['post']
            ],
            where: {
                parentPostId: {
                    [Op.eq]:req.params.id
                }
            }
        });
        res.send(await postThread(req.params.id));
    }catch(error){
        next(error);
    }
})

app.get('/api/users',async(req,res,next)=>{
    try{
        const users = await Users.findAll({
            include: [
                {
                model:Posts
                }
            ]
        });
        res.send(users);
    }catch(error){
        next(error);
    }
})

app.get('/api/posts',async(req,res,next)=>{
    try{
        const posts = await Posts.findAll({
            include: [
                {
                    model:Posts,
                    as:'parentPost'
                },
                {
                   model: Users
                }
            ],
            order:[
                ['post']
            ]
        });
        res.send(posts);
    }catch(error){
        next(error)
    }
})


const init = async() => {
    try{
        await conn.authenticate();
        await syncAndSeed();
        const port = process.env.PORT || 3000
        app.listen(port,()=>{console.log(`Listing on port: ${port}`)})
    }catch(error){
        console.log(error);
    }
}

init()