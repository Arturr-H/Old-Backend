str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"
let INDEX = 0;


const ANSWER_CAP = 8

let ALL_QUESTIONS = {}

const addShit = () => {

    if(INDEX <= 7){

        document.getElementById("OUTPUT").innerHTML += `

            <div class="INPUT_SEPARATOR ALIGN-CENTER">

                <button style="margin-right: 0%;">Question:</button>

                <input id="QUESTION_INPUT_${INDEX}"              placeholder="Question"        class="Q_A_INPUT"          type="text"       style="margin-right: 1vmax;">


                <button style="margin-right: 0%; z-index: 3">Answers:</button>
                <input id="ANSWER_INPUT_${INDEX}"                placeholder="Answers"         class="Q_A_INPUT"          type="text"    style="z-index: 2">
                <input id="CORRECT_ANSWER_INPUT_${INDEX}"        placeholder="Correct"         class="Q_A_INPUT"          type="text"    style="z-index: 1">

            </div>

        `
        
        INDEX += 1;
    }
}

const SUBMIT = async () => {

    if (getCookie("user_id") != "") {

        console.log("success!" + getCookie("user_id"))

        if (INDEX >= 1){

            let RESULT_OBJECT = {
                Creator: getCookie("user_id"),
                RoomName: document.getElementById("ROOM_NAME").value,
                StartTime: parseInt(parseInt(document.getElementById("ROOM_START_TIME").value) + parseInt(new Date().getTime() / 1000)),
                Questions: []
            }

            for (let i = 0; i < INDEX; i++) {
                RESULT_OBJECT.Questions.push({
                    Question: document.getElementById("QUESTION_INPUT_" + i).value,
                    Answers: document.getElementById("ANSWER_INPUT_" + i).value.split(",").slice(0, ANSWER_CAP),
                    RightAnswers: document.getElementById("CORRECT_ANSWER_INPUT_" + i).value.split(",").map(function(val){return parseInt(--val)}),
                })
            }
            roomID = ""
            for (let i = 0; i < 20; i++) {
                roomID += str.charAt(Math.floor(Math.random() * str.length));;
            }


            await fetch('https://backend.artur.red/Create_room/' + roomID, 
            {
                method: "GET",
                headers: {questions: JSON.stringify(RESULT_OBJECT)},
                'Cache-Control': 'no-cache',
            });

            open("https://backend.artur.red/room/" + roomID, "_self")
        }else{
            open("https://backend.artur.red/CreateAccount", "_self")
        }
    }    
}


const joinRoom = () => {
    val = document.getElementById("ROOM_ID_INPUT").value
    if (val != "" && val.length == 20){
        window.open("./room/" + document.getElementById("ROOM_ID_INPUT").value)
    }else{
        document.getElementById("WARNING").style.display = "block"
    }
}
