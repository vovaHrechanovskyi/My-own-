import express from 'express'
const app = express()
import { appendFileSync } from 'fs'

app.use(express.static('./'))
app.use(express.json())

// app.get('/game', (req, res) => {
//     res.sendFile(__dirname, 'game.js')
// })

app.post('/statistic', (req, res) => {
    appendFileSync('stats.txt', JSON.stringify(req.body) + '\n')
})

app.listen(3000, () => {
    console.log('(-)')
});
