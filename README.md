# **kaamelott-twitt-bot**
[![Dependency Status](https://david-dm.org/benjaminW78/kaamelott-twitt-bot.svg)](https://david-dm.org/benjaminW78/kaamelott-twitt-bot?view=list)

The MIT License (MIT)

this project is used to create videos from scrapped mp3 from a french serie soundboard and post it on twitter every day via this account : [@kaamelott_today](https://twitter.com/kaamelott_today).

### Table of Contents
**[Practical information](#practical-information)** 
**[Files tree](#files-tree)** 
**[Installation](#installation)** 
**[API documentation](#api-documentation)** 
**[Example](#example)** 
**[Acknowledgement](#acknowledgement)** **[Other project](#other-project)**

## **Practical information**
 *You must be familiar* with :
 - [ES6 async await](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/async_function)

## **Files tree**
```
./
├── app // current code app
│   ├── cleanNames.js // function to sanitize and return string like this: #CharacterName
│   ├── deleteGeneratedFiles.js// function to remove useless generated files mp3/mp4 etc
│   ├── download.js // code used to download mp3 and create mp4 film from it
│   ├── getSoundsJson.js // return json list of mp3 and content associated
│   ├── getTwittText.js // function which give us a string to post inside the twitt content
│   ├── index.js // main function with a timeout which test every minute if we are inside a given hour:minute for generating a twitt
│   └── random.js // function which return random number from a range between 0 and passed param
├── config.js // config usefull for local testing.
├── imgs // images content for mp4 background based on character name contained inside list from soundsJson.js
│   ├── Angharad.jpg
│   ├── Anna.jpg
│   ├── Arthur.jpg
│   ├── Attila.jpg
│   ├── Azénor.jpg
│   ├── background0.jpg
│   ├── background1.jpg
│   ├── background2.jpg
│   ├── background3.jpg
│   ├── Bohort.jpg
│   ├── Caius.jpg
│   ├── Calogrenant.jpg
│   ├── DameSéli.jpg
│   ├── Demetra.jpg
│   ├── Élias.jpg
│   ├── Galessin.jpg
│   ├── Gauvain.jpg
│   ├── Goustan.jpg
│   ├── Guenièvre.jpg
│   ├── Guethenoc.jpg
│   ├── Jacca.jpg
│   ├── Kadoc.jpg
│   ├── Karadoc.jpg
│   ├── Kay.jpg
│   ├── LaDameduLac.jpg
│   ├── Lancelot.jpg
│   ├── LeMaîtredarmes.jpg
│   ├── Léodagan.jpg
│   ├── LeRépurgateur.jpg
│   ├── LeRoiBurgonde.jpg
│   ├── Letavernier.jpg
│   ├── LInterprète.jpg
│   ├── Loth.jpg
│   ├── Merlin.jpg
│   ├── Narces.jpg
│   ├── Perceval.jpg
│   ├── PèreBlaise.jpg
│   ├── Roparzh.jpg
│   ├── Venec.jpg
│   └── Yvain.jpg
├── LICENSE
├── package.json
├── package-lock.json
└── sounds
    └── kaamelott-intro.mp3 //  serie sound generic merged with the downloaded sound from scraping
    
```
