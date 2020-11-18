
const {syncAndSeed,conn,model:{Posts,Users}} = require('../db')
const {Op} = require('sequelize')

const postList = async() => {
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
                ['createdAt']
            ],
            where: {
                parentPostId: {
                    [Op.is]:null
                }
            }
        });

        const html = `
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
            <div class = 'postTitles'>
            <ol>
            ${parentPosts.map(parentPost=>`
            <li class = 'posts'>
            <a href = '/${parentPost.id}'>${parentPost.post}</a><small class = 'by'> by ${parentPost.user.name}</small>
            </li>
            `).join('')}
            </ol>
            </div>
            <div class = 'form'>
            <form method='POST'>
            <label for='post'>POST HERE</label>
            <input name = 'post'></input>
            <label for='name'>ENTER NAME</label>
            <input name = 'name'></input>
            <button>Submit</button>
            </form>
            <div>
       </body>
       </html> 
        `
    return html
    }catch(error){
        console.log(error)
    }
}

module.exports = postList