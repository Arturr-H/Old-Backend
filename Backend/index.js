//Express
const express = require('express');
const { Do } = require('faunadb');
const app = express();

//FaunaDB
const faunadb = require("faunadb")

//så man kan läsa .env filerna
require('dotenv').config();

/* CONFIG */
const BACKEND_PORT = 3000

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


//Skicka homepage filerna till "/", alltså bara backend.artur.red.
app.get('/style.css', function (req, res) { res.sendFile(__dirname + "/" + "style.css"); });
app.get("/", (req, res) => { res.sendFile(__dirname + "/index.html") });

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
                <link rel="icon" href="https://artur.red/favicon.png">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;600&display=swap" rel="stylesheet"> 
                <link rel="stylesheet" href="https://backend.artur.red/style.css" type="text/css">
                <title id="title">Lobby opening in ${parseInt(DOC.StartTime - new Date().getTime() / 1000)}</title>
            </head>
            <body>
                
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
    }else{
    	return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link rel="icon" href="https://artur.red/favicon.png">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;600&display=swap" rel="stylesheet"> 
                <link rel="stylesheet" href="https://backend.artur.red/style.css" type="text/css">
                <title>Lobby ${ID}</title>
            </head>
            <body>
                <h1>${NAME}</h1>
                <h1 class="SmallH1" style="text-align: center">by<span style="text-decoration: underline 0.2vmax rgb(114, 227, 185)"><a href="https://backend.artur.red/user/${DOC.Creator}">${USER.data.Username}</a></span></h1>
            
                
                ${EndString}
                <h1 id="endScore"></h1>

                <script>

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
const GET_ALL_ROOMS = (DOC) => {

    let endString = ""

    DOC.data.forEach((element) => {
        endString += `<button style="margin-left: 0.5vmax;"><a href="https://backend.artur.red/room/${element.data.id}">${element.data.title}</a></button>`
    })

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">

                <link rel="icon" href="https://artur.red/favicon.png">
                <link rel="stylesheet" href="https://backend.artur.red/style.css" type="text/css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap" rel="stylesheet"> 
                <title>Featured rooms!</title>
            </head>
            <body>
                <h1>Available rooms</h1>
                <div class="CenterScroll">
                    ${endString}
                </div>
            </body>
        </html>
    `
}
const SEND_USER_PAGE = (USER, USER_ROOMS) => {

    let userRoomHTML = ""

    USER_ROOMS.data.map((room) => {
        userRoomHTML += `<a href="https://backend.artur.red/room/${room.data.id}"><button>${room.data.title}</button></a>`
    });

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap" rel="stylesheet"> 
                <link rel="icon" href="https://artur.red/Backend/DATA/favicon.png">

                <link rel="stylesheet" href="https://artur.red/Backend/style.css" type="text/css">
                <title>Backend of artur.red</title>

            </head>
            <body>
                <h1>${USER.data.Username}</h1>
                <div class="margined">
                    <p>${(USER.data.Description == undefined) ? USER.data.Username + " has no description." : USER.data.Description}</p>
                </div>
                <div class="margined">
                    <h1 class="SmallH1">${USER.data.Username}'s rooms:</h1>
                    ${userRoomHTML}
                </div>
            </body>
        </html>
            
    `
}
app.get("/login", async (req, res) => {
    res.sendFile("./Login.html", {root: __dirname})
});
app.get("/CreateAccount", async (req, res) => {
    res.sendFile("./CreateAccount.html", {root: __dirname})
});

app.get("/user/:id?", async (req, res) => {

    try{//rooms_by_creator_id
        const USER = await client.query(
			Get(Match(Index("user_by_id"), req.params.id.toString()))
		)

        const USER_ROOMS = await client.query(
            FdbMap(
                Paginate(
                    Match(Index("rooms_by_creator_id"), USER.data.Id)
                ),

                Lambda(
                    "user",
                    Get(Var("user"))
                )
            )
        )
        res.send(SEND_USER_PAGE(USER, USER_ROOMS))

    }catch(err){
		res.sendFile("./404.html", { root: __dirname })
    }
});

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
		// res.send("Success! id:'" + doc.data.id + "', Currently " + GET_ALL_DOCUMENTS.data.length + " lobbys online! Currently " + doc.data.Online);
	}
	catch (err) {
		res.sendFile("./404.html", { root: __dirname })
	}
})

app.get("/rooms", async (req, res) => {
    const GET_ALL_DOCUMENTS = await client.query(
        FdbMap(
            Paginate(Documents(Collection('Rooms'))),
            Lambda(x => Get(x))
        )
    )
	res.send(GET_ALL_ROOMS(GET_ALL_DOCUMENTS))
})


//create sektionen, html sidan asså.
app.get("/create", async (req, res) => {
	res.sendFile("./CreateLobby.html", { root: __dirname })
})
// SKAPA ROOM GETTER SKAPA ROOM GETTER SKAPA ROOM GETTER SKAPA ROOM GETTER SKAPA ROOM GETTER
app.get("/Create_room/:id", async (req, res) => {

	const QUESTION_HEADERS = JSON.parse(req.headers.questions)

	if (req.params.id.length == 20) {

		try {
			await client.query(
				Create(
					Collection('Rooms'),
					{
						data: {
							id: req.params.id.toString(),
							title: QUESTION_HEADERS.RoomName,
							Questions: QUESTION_HEADERS.Questions,
                            StartTime: QUESTION_HEADERS.StartTime,
                            Creator: QUESTION_HEADERS.Creator,
						}
					},
				)
			)
			res.redirect("https://backend.artur.red/room/" + req.params.id)

		} catch (err) {
			console.log(err)
		}

	} else {
		res.sendFile("./404.html", { root: __dirname })
	}
})

// BARA I DEVELOPMENT TA BORT SENARE
app.get("/delete", async (req, res) => {
	try {
		await client.query(
			FdbMap(
				Paginate(
					Documents(Collection('Rooms')),
					{ size: 9999 }
				),
				Lambda(
					['ref'],
					Delete(Var('ref'))
				)
			)
		)
		res.send("deleted")

	} catch (err) {
		console.log(err)
		res.send("undable to execute")
	}
})


//Starta servern!
app.listen(BACKEND_PORT, () => {
	console.log(`working on :${BACKEND_PORT}`)
})