
const {syncAndSeed,conn,model:{Posts,Users}} = require('../db')
const {Op} = require('sequelize')

const postThread = async(id) => {
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
                    [Op.eq]:id
                }
            }
        });

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


const html =`
        <html>
        <head>
        <link rel='stylesheet' href = '/public/styles.css' />
        </head>
        <body>
             <h1>POSTBOX</h1>
             <div id='nestedObject'>
                 <ul>
                     <li><a href = '/api/users'>Users <small>(view as nested object)</small></a></li>
                     <li><a href = '/api/posts'>Posts <small>(view as nexted object)</small></a></li>
                 </ul>
             </div>
             <div>
             <h2 class = 'postTitles'>${posts[0].parentPost.post}</h2>
             <h3>Replies/Comments</h3>
                <ol>
                ${posts.map(post=>`
                <li class = 'replies'>
                ${post.post} <small class = 'by'>by  ${post.user.name} on ${post.createdAt}</small>
                </li>
                `).join('')}
                </ol>
                <h2><a href = '/'> <<< Back </a></h2>            
             </div>
        </body>
        </html> 
         `
return html
    }catch(error){
        console.log(error)
    }
}

module.exports = postThread