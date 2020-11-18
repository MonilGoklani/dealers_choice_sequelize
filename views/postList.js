
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
                ['post']
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
       </body>
       </html> 
        `
    return html
    }catch(error){
        next(error)
    }
}

module.exports = postList