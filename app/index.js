const fs = require('fs')
const moment = require('moment')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const downloadSong = require('./download')
const deleteGeneratedFiles = require('./deleteGeneratedFiles')
const getTwittText = require('./getTwittText')
const getSoundsList = require('./getSoundsJson')
const postTweetWithMediaText = require('./postTweetWithMedia')
const generateSong = require('./generateSong')
const twittBot = require('./twittBot').twittBot
const config = require('./twittBot').config
const random = require('./random')

const express = require('express')
const app = express()


const request = require('request')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/new', function (req, res) {
    doNewTwitt()
    res.send('200', 'new twitt send')
})
app.post('/slack/new', function (req, res) {

    console.log(req.body)

    console.log('\n START GENERATION SLACK ITEM: ' + moment().utcOffset('+0200').format('DD/MM/YYYY HH:mm'))

    doNewSlack(req, res)
})

app.listen(process.env.PORT || 8080, function () {
    console.log(`kaamelott-twitt-bot app listening on port ${process.env.PORT || 8080}!`)
})

let mp3Name
let lastTrigger
let soundsList

function runTime() {

    let temp = moment().utcOffset('+0200').format('HH:mm')
    if (-1 !== config.trigger_hours.indexOf(temp) && lastTrigger != temp) {
        lastTrigger = temp
        console.log('\n START GENERATION TWITT: ' + moment().utcOffset('+0200').format('DD/MM/YYYY HH:mm'))

        doNewTwitt()
    }
    setTimeout(runTime, 60000)
}


runTime()


async function doNewTwitt(withSlack = false) {
    try {
        soundsList = await getSoundsList()
        let data = await downloadSong(soundsList)
        mp3Name = data

        if (data) {
            let request = await twittBot.get('statuses/user_timeline', { tweet_mode: 'extended', count: 200 })

            let currentTwittText = getTwittText(mp3Name, soundsList)
            let twittsText = request.data.map(function (current) {
                return current.full_text.split(' https://')[0]
            })
            if (-1 !== twittsText.indexOf(currentTwittText.twitt)) {
                deleteGeneratedFiles(mp3Name)
                doNewTwitt()
                console.log('DO DOWNLOAD AGAIN! because duplicate tweet: ' + currentTwittText.twitt + '\n')
                return false
            } else {
                let resultgenerateSong = await generateSong(mp3Name, soundsList)
                await postTweetWithMediaText(resultgenerateSong, soundsList)
                deleteGeneratedFiles(mp3Name)

                console.log('\n END GENERATION TWEET: ' + moment().utcOffset('+0200').format('DD/MM/YYYY HH:mm'))

                return true
            }
        } else {
            doNewTwitt()
        }
    } catch (err) {
        console.log(err)
    }
}


async function doNewSlack(req, res) {
    soundsList = await getSoundsList()
    let randomNumber = random(undefined, 100000)
    let data = await downloadSong(soundsList, randomNumber)
    mp3Name = data
    if (data) {
        const video = await generateSong(mp3Name, soundsList, true, randomNumber)

        const currentRequest = request.post(req.body['response_url'], function (err, resp, body) {
            deleteGeneratedFiles(mp3Name, randomNumber)
            if (err) {
                console.log('Error!')
            } else {
                console.log('URL: ' + body)


            }
            console.log('\n END GENERATION SLACK ITEM: ' + moment().utcOffset('+0200').format('DD/MM/YYYY HH:mm'))

        })

        let form = currentRequest.form()

        form.append('file', fs.createReadStream(path.resolve(video)), {
            filename: mp3Name,
            contentType: 'video/mpeg'
        })
        res.send(
            {
                'response_type': 'in_channel',
                'text': '\'c\'est pas faux\'',
                'attachments': [
                    {
                        'video': fs.createReadStream(path.resolve(video))
                    }
                ]
            })
        return true
    }
}
