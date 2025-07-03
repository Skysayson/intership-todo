const express = require('express')
const router = express.Router()
const db = require('../db')
const { verifyToken } = require('../middleware/verifytoken')

router.post('/postTodo', verifyToken, async (req,res) => {
    const { email, title, content } = req.body

    if(!title) {
    return res.status(400).json({message: 'task must have a title'})
    }

    try {
        const checkUser = `SELECT * FROM \`user-auth\` WHERE email = ?`

        db.query(checkUser, [email], (err, result) => {
            if(result.length === 0 || err) {
                return res.status(500).json({ message: 'user_id does not exist' })
            }
                const user = result[0]

                const query = `INSERT INTO todos (user_id, title, content) VALUES (?, ?, ?)`
                
                const values = [user.id, title, content || '']

                db.query(query, values, (err, result) => {
                    if(err) {
                        return res.status(500).json({message: 'Error inserting task into db'})
                    }
                    res.status(200).json({message: 'Successfully inserted into db'})
                })

            })

    } catch (error) {
        if (error) return res.status(500).json({ message: 'internal server error' })
    }
})

router.get('/showTodo', verifyToken, async (req, res) => {
    const { email } = req.body

    if(!email) {
        return res.status(400).json({message: 'missing email'})
    }
    try {
        const findQuery = 'SELECT * FROM `user-auth` WHERE email = ?'

        db.query(findQuery, [email], (err, result) => {
            if(err || result.length === 0) {
                return res.status(400).json({message: 'could not find user'})
            }
            const foundId = result[0].id
            const todoQuery = 'SELECT * FROM todos WHERE user_id = ?'

            db.query(todoQuery, [foundId], (err,result) => {
                if(err) {
                    return res.status(500).json({ message: 'error fetching todos' })
                }
                return res.status(200).json({ result });
            })
        })
    } catch (err) {
        if (error) return res.status(500).json({ message: 'internal server error' })
    }
})

router.patch('/updateTodo', verifyToken, async (req, res) => {
    const { email, taskid, title, content, completed } = req.body
    
    if(!email) {
        return res.status(500).json({message: 'email does not exist'})
    }

    try {
        const findQuery = 'SELECT * FROM `user-auth` WHERE email = ?'

        db.query(findQuery, [email], (err, result) => {
            if(err || result.length === 0) {
                return res.status(400).json({ message: 'user does not exist'})
            }
            
            const foundId = result[0].id
            const findTodoQuery = 'SELECT * FROM todos WHERE user_id = ? AND taskid = ?'

            db.query(findTodoQuery, [foundId, taskid], (err, task) => {
                if(err || task.length === 0) {
                    return res.status(400).json({ message: 'user or task does not exist' })
                }
                const fields = [];
                const values = [];

                if (title !== undefined) {
                    fields.push('title = ?');
                    values.push(title);
                }
                if (content !== undefined) {
                    fields.push('content = ?');
                    values.push(content);
                }
                if (completed !== undefined) {
                    fields.push('completed = ?');
                    values.push(completed);
                }

                if (fields.length === 0) {
                    return res.status(400).json({ message: 'No update fields provided' });
                }

                const updateQuery = `UPDATE todos SET ${fields.join(', ')} WHERE user_id = ? AND taskid = ?`;
                values.push(foundId, taskid);

                db.query(updateQuery, values, (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update task' });
                    }
                    return res.status(200).json({ message: 'Task updated successfully' });
                });
            })
        })
    } catch (err) {
        if (error) return res.status(500).json({ message: 'internal server error' })
    }
})

router.delete('/deleteTodo', verifyToken, async (req,res) => {
    const { email, taskid } = req.body

    if(!email) {
        return res.status(400).json({ message: 'email does not exist' })
    }

    try{
        const findQuery = 'SELECT * FROM `user-auth` WHERE email = ?'
        db.query(findQuery, [email], (err, result) => {
            if (err) {
                return res.status(400).json({message: 'error finding user'})
            }
            const foundId = result[0].id

            const deleteTask = 'DELETE FROM todos WHERE user_id = ? AND taskid = ?'

            db.query(deleteTask, [foundId, taskid], (err, result) => {
                if (err || result.length === 0) {
                    return res.status(400).json({message: 'task does not exist'}, err)
                }

                if(result.affectedRows === 0) {
                    return res.status(400).json({ message: 'Task not found or already deleted' });
                }

                return res.status(200).json({message: 'successfully deleted task'})

            })
        })
    } catch (err) {
        if (err) return res.status(500).json({ message: 'internal server error' })
    }
})


module.exports = router