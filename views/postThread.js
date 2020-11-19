
const {syncAndSeed,conn,model:{Posts,Users}} = require('../db')
const {Op} = require('sequelize')

const postThread = async(id) => {
try{
        let posts = await Posts.findAll({
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


  let mainPost = await Posts.findByPk(id)

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
             <h2 class = 'postTitles'>${mainPost.post}</h2>
             <h3>Replies/Comments</h3>
                <ol>
                ${posts.map(post=>`
                <li class = 'replies'>
                ${post.post} 
                <small class = 'by'>by  ${post.user.name} on ${post.createdAt}</small>
                <form method='POST' action='/api/postList/postThread/${post.id}?_method=DELETE'>
                <button> delete </button>
                </form>
                </li>
                `).join('')}
                </ol>          
             </div>
             <div class = 'form'>
             <form method='POST'>
             <label for='post'>REPLY/COMMENT HERE</label>
             <input name = 'post' id='inputpost'></input>
             <label for='name'>ENTER NAME</label>
             <input name = 'name'></input>
             <button>Submit</button>
             </form>
             <div>
             <h2><a href = '/'> <<< Back </a></h2>  
        </body>
        </html> 
         `
return html
    }catch(error){
        console.log(error)
    }
}

module.exports = postThread