//Express
const express = require('express');
const { Do } = require('faunadb');
const app = express();


var cors = require('cors')
app.use(cors())

const http = require("http");
console.log(`Max HTTP Header size is ${http.maxHeaderSize}`);

//FaunaDB
const faunadb = require("faunadb")

//så man kan läsa .env filerna
require('dotenv').config();

/* CONFIG */
const BACKEND_PORT = 3000



/* ROUTES FOR BACKEND.ARTUR.RED*/

var JoinRoomRoute = require('./BACKEND_ROUTES/ROOM.js');
var CreateRoomRoute = require('./BACKEND_ROUTES/CREATE_ROOM.js');

app.use("/", JoinRoomRoute)




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

// const GET_RANDOM_ID = () => {
// 	str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"

// 	let QuestionID = ""
// 	for (let i = 0; i < 15; i++) {
// 		QuestionID += str.charAt(Math.floor(Math.random() * str.length));;
// 	}
// 	return QuestionID;
// }

const CHECK_UID = async (UID) => {

    //Kolla om den kan fetcha user ID:et från faunaDB, om try-catch
    //blocket failar så returna status 404;
    try{
        await client.query(
			Get(Match(Index("user_by_id"), UID))
		)
        return 200;
    }catch{
        return 404;
    }
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

app.get("/checkUIDstatus", async (req, res) => {

    //Eftersom jag inte vill ha faunadb i frontend (personer kan se min fdb secret), så gör jag
    // en endpoint som tar en header med ett userID och kollar om usern fortfarande finns.
    res.sendStatus(await CHECK_UID(req.get("UID")));
})

//Skicka homepage filerna till "/", alltså bara backend.artur.red.
app.get('/style.css', function (req, res) { res.sendFile(__dirname + "/" + "style.css"); });
app.get("/", (req, res) => { res.sendFile(__dirname + "/HTML_FRONTEND/index.html") });


const GET_ALL_ROOMS = (DOC) => {

    let endString = ""

    DOC.data.forEach((element) => {
        endString += `<button class="ANIMATED_BUTTON" style="margin-left: 0.5vmax;"><a href="https://backend.artur.red/room/${element.data.id}">${element.data.title}</a></button>`
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

                <div
                    style="height: 64vmax;"
                    id="opt"
                >
                    ${endString}
                </div>

                <script>

                    var children = document.getElementById("opt").children;
                    for (var i = 0; i < children.length; i++) {
                        const x = (Math.random() * (0 - 80) + 80).toFixed(4)
                        const y = (Math.random() * (0 - 100) + 100).toFixed(4)
                        console.log((Math.random() * (0 - 100) + 100).toFixed(4))

                        children[i].style.animationDuration = (Math.random() * (2 - 10) + 10).toFixed(4) + "s"
                        children[i].style.position = "absolute";
                        children[i].style.top = y+"%";
                        children[i].style.left = x+"%";

                    }
                    
                </script>
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
                    <div class="">
                        <div class="ButtonContainer" style="max-height: 8vmax">
                            ${userRoomHTML}
                        </div>
                    </div>
                </div>
            </body>
        </html>
            
    `
}
app.get("/login", async (req, res) => {
    res.sendFile("./HTML_FRONTEND/Login.html", {root: __dirname})
});
app.get("/CreateAccount", async (req, res) => {
    res.sendFile("./HTML_FRONTEND/CreateAccount.html", {root: __dirname})
});

app.get("/user/:id?", async (req, res) => {

    try{
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
		res.sendFile("./HTML_FRONTEND/404.html", { root: __dirname })
    }
});

// // JOINA ROOM GETTER JOINA ROOM GETTER JOINA ROOM GETTER JOINA ROOM GETTER JOINA ROOM GETTER
// app.get("/room/:id", async (req, res) => {

// 	//Försök att hämta infon om dokumentet med id:t req.params.id...
// 	//Om det inte fungerar gå in i catch blocket och skicka att det inte fanns!
// 	try {
// 		//[NOTE] doc.ref.id är ID:et för det dokumentet du vill ha!

// 		//Kolla om ID:t finns först, annars om det inte finns så
// 		//Fortsätter koden i catch blocket.
// 		const doc = await client.query(
// 			Get(Match(Index("lobby_by_ID"), req.params.id.toString()))
// 		)

// 		//Går igenom alla dokument i kollektionen "Rooms", och man kan
// 		//sen ta lengthen av den genom att "GET_ALL_DOCUMENTS.data.length"
// 		const GET_ALL_DOCUMENTS = await client.query(
// 			FdbMap(
// 				Paginate(Documents(Collection('Rooms'))),
// 				Lambda(x => Get(x))
// 			)
// 		)
//         const USER = await client.query(Get(Match(Index("user_by_id"), doc.data.Creator)))

// 		res.send(SEND_QUESTION_FILE(req.params.id, doc.data, doc.data.title, USER))
// 		// res.send("Success! id:'" + doc.data.id + "', Currently " + GET_ALL_DOCUMENTS.data.length + " lobbys online! Currently " + doc.data.Online);
// 	}
// 	catch (err) {
// 		res.sendFile("./HTML_FRONTEND/404.html", { root: __dirname })
// 	}
// })

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
	res.sendFile("./HTML_FRONTEND/CreateLobby.html", { root: __dirname })
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
                            EndTime: QUESTION_HEADERS.EndTime,
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
		res.sendFile("./HTML_FRONTEND/404.html", { root: __dirname })
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