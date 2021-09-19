const express = require('express');
const { Do } = require('faunadb');
//FaunaDB
const faunadb = require("faunadb")

//så man kan läsa .env filerna
require('dotenv').config();

const {
	Ref,
	Paginate,
	Get,
	Match,
	Index,
	Create,
	Collection,
	Lambda,
	Map: FdbMap,
	Documents,
	Delete,
	Var,
} = faunadb.query;

const client = new faunadb.Client({
	secret: process.env.SECRET
})
const GET_RANDOM_ID = () => {
	str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"

	let QuestionID = ""
	for (let i = 0; i < 15; i++) {
		QuestionID += str.charAt(Math.floor(Math.random() * str.length));;
	}
	return QuestionID;
}

const GET_NAVBAR = () => {
    return `
        <div class="NAVBAR">
            <a id="USER_ACCOUNT_NAV_LINK"><div class="USER_ACCOUNT_NAV" id="USER_ACCOUNT_NAV"></div></a>
            <p id="sgnout" onclick="s()">Sign out</p>


            <div class="TOP_USER_BAR" id="TOP_USER_BAR">
                <button><a href="https://backend.artur.red/CreateAccount">Create account</a></button>
                <button><a href="https://backend.artur.red/login">Log in</a></button>
            </div>

            <a class="LINK" href="https://backend.artur.red"><span style="transform: rotate(-90deg); display: inline-block;">⌃</span>back</a>
        </div>
        <script src="https://artur.red/Backend/JAVASCRIPT_FRONTEND/cookies.js"></script>

        <script src="https://artur.red/Backend/JAVASCRIPT_FRONTEND/Default.js"></script>

    `
}

const SEND_QUESTION_FILE = (ID, DOC, NAME, USER) => {

    let EndString = ""


    DOC.Questions.forEach(element => {

        let QuestionID = GET_RANDOM_ID()
        EndString += "<div class='QUESTION_CONTAINER'><p class='QuestionTitle'>" + element.Question + "</p> <p style='text-align: center; color: rgba(255, 255, 255, 0.7)'>" + ((element.RightAnswers.length >= 2) ? "This question contains multiple answers" : "") + "</p> <div class='ButtonContainer'>"

        element.Answers.forEach((answer, indx) => {

            QuestionID = GET_RANDOM_ID()

            if (element.RightAnswers.indexOf(indx) != -1) {

                EndString += `<button id="id--` + QuestionID + `-" onclick='check("id--` + QuestionID + `-")'>` + answer + `</button>`

            } else {

                EndString += `<button id="id--` + QuestionID + `" onclick='check("id--` + QuestionID + `")'>` + answer + `</button>`

            }
        })

        EndString += "</div></div>"
    });


    //Kolla om start time har passerat eller itne.c
    if(DOC.StartTime >= new Date().getTime() / 1000){
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link rel="icon" href="https://artur.red/Backend/DATA/favicon.png">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;600&display=swap" rel="stylesheet"> 
                <link rel="stylesheet" href="https://backend.artur.red/style.css" type="text/css">
                <title id="title">Lobby opening in ${parseInt(DOC.StartTime - new Date().getTime() / 1000)}</title>
            </head>
            <body>
                
                ${GET_NAVBAR()}
                <div class="SPINNING_CIRCLE_COUNTDOWN"></div>
                <h1 class="SPINNING_CIRCLE_COUNTDOWN_TEXT" id="RoomCountdown">${parseInt(DOC.StartTime - new Date().getTime() / 1000)}</h1>
                <p style="text-align: center">Share this lobby with others!</p>
                <h6>Click to copy</h6>
                <p class="ROOM_ID_COPY" onclick="copyToClipboard('${ID}')">${ID}</p>

                <script>
                    function copyToClipboard(value) {
                        navigator.clipboard.writeText(value)
                    }
                    let CurrentDate = new Date();
                    setInterval(() => {

                        if(parseInt(${DOC.StartTime} - CurrentDate.getTime() / 1000) <= 0){
                            location.reload();
                        }else{
                            CurrentDate = new Date()
                            document.getElementById("title").innerHTML = "Lobby opening in " + parseInt(${DOC.StartTime} - CurrentDate.getTime() / 1000);
                            document.getElementById("RoomCountdown").innerHTML = parseInt(${DOC.StartTime} - CurrentDate.getTime() / 1000);
                        }
                    }, 1000)
                </script>
            </body>
            </html>
        `
    }else if (DOC.EndTime <= new Date().getTime() / 1000){
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap" rel="stylesheet">
                <link rel="icon" href="https://artur.red/Backend/DATA/favicon.png">

                <title>Error</title>
            </head>
            <body>
                ${GET_NAVBAR()}

                <h1>404 - Page not found.</h1>
                <a href="https://backend.artur.red"><p>Homepage</p></a>
                <style>
                    h1{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 600;
                        font-size: 3.5vmax;

                        margin: 0%;
                        padding: 0%;

                        color: rgb(0, 0, 0);

                        text-align: center;
                    }
                    p{
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 300;
                        font-size: 1.5vmax;

                        color: rgb(35, 15, 255);
                        text-align: center;
                        text-decoration: underline solid 2px blue;
                        cursor: pointer;
                    }
                </style>
                <script src="https://artur.red/Backend/JAVASCRIPT_FRONTEND/cookies.js"></script>
                <script src="https://artur.red/Backend/JAVASCRIPT_FRONTEND/Default.js"></script>

            </body>
            </html>
        `
    }else{
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link rel="icon" href="https://artur.red/Backend/DATA/favicon.png">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;600&display=swap" rel="stylesheet"> 
                <link rel="stylesheet" href="https://backend.artur.red/style.css" type="text/css">
                <title>${NAME} - ${USER.data.Username}</title>
                
            </head>
            <body>
                ${GET_NAVBAR()}
                <h1 class="SmallH1" style="position: absolute; top: 2.5vmax; right: 0.5vmax" id="DeadCountdown"></h1>

                <h1>${NAME}</h1>
                <h1 class="SmallH1" style="text-align: center">by<span style="text-decoration: underline 0.3vmax rgb(114, 227, 185)"><a href="https://backend.artur.red/user/${DOC.Creator}">${USER.data.Username}</a></span></h1>

                
                ${EndString}
                <h1 id="endScore"></h1>

                <script>

                    setInterval(() => {

                        if(parseInt(${DOC.EndTime} - new Date().getTime() / 1000) <= 0){
                            location.reload();
                        }if(parseInt(${DOC.EndTime} - new Date().getTime() / 1000) <= 60){
                            document.getElementById("DeadCountdown").innerHTML = parseInt(${DOC.EndTime} - new Date().getTime() / 1000)
                        }

                    }, 1000)


                    let finalScore = [0, 0, 0]
                    let clicked = []

                    const update = () => {
                        document.getElementById("endScore").innerHTML = parseInt(finalScore[0]/finalScore[2]*100) + "% right"
                    }

                    const check = (i_) => {

                        if(clicked.includes(i_) == false){

                            if(i_.slice(-1)=="-"){
                                finalScore[0]++;
                                finalScore[2]++;
                                update()
                                document.getElementById(i_).style.background = "rgb(114, 227, 185)"
                                clicked.push(i_)
                            }else{
                                finalScore[1]++;
                                finalScore[2]++;
                                update()
                                document.getElementById(i_).style.background = "#f4665f"
                                clicked.push(i_)

                            }
                        }
                    }
                </script>
            </body>
            </html>
        `
    }
}

module.exports = (function() {


    var app = express.Router();

    // JOINA ROOM GETTER JOINA ROOM GETTER JOINA ROOM GETTER JOINA ROOM GETTER JOINA ROOM GETTER
    app.get("/room/:id", async (req, res) => {

        //Försök att hämta infon om dokumentet med id:t req.params.id...
        //Om det inte fungerar gå in i catch blocket och skicka att det inte fanns!
        try {
            //[NOTE] doc.ref.id är ID:et för det dokumentet du vill ha!

            //Kolla om ID:t finns först, annars om det inte finns så
            //Fortsätter koden i catch blocket.
            const doc = await client.query(
                Get(Match(Index("lobby_by_ID"), req.params.id.toString()))
            )

            //Går igenom alla dokument i kollektionen "Rooms", och man kan
            //sen ta lengthen av den genom att "GET_ALL_DOCUMENTS.data.length"
            const GET_ALL_DOCUMENTS = await client.query(
                FdbMap(
                    Paginate(Documents(Collection('Rooms'))),
                    Lambda(x => Get(x))
                )
            )
            const USER = await client.query(Get(Match(Index("user_by_id"), doc.data.Creator)))

            res.send(SEND_QUESTION_FILE(req.params.id, doc.data, doc.data.title, USER))
        }
        catch (err) {
            res.sendFile("../HTML_FRONTEND/404.html", { root: __dirname })
        }
    })
    return app;
})();