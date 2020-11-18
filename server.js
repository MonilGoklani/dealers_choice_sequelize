
const {syncAndSeed,conn,model:{Posts,Users}} = require('./db')
const postList = require('./views/postList')
const postThread = require('./views/postThread')
const express = require('express')
const {Op} = require('sequelize')
const app = express()
const path = require('path')

app.use('/public',express.static(path.join(__dirname+'/public')))


app.get('/',async(req,res,next)=>{
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
        res.send(await postList())
    }catch(error){
        next(error)
    }
})

app.get('/:id', async(req,res,next)=>{
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
        res.send(await postThread(req.params.id))
    }catch(error){
        next(error)
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
        next(error)
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