str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"
let INDEX = 0;


const ANSWER_CAP = 8

let ALL_QUESTIONS = {}

let ALL_CURRENT_ANSWERS = {Tot: 0}

const AddAnswer = (IDX) => {

    // if (ALL_CURRENT_ANSWERS["Q_" + IDX]) {
        
    // }




    if (ALL_CURRENT_ANSWERS["Q_" + IDX + "_INDX"] == undefined) {

        ALL_CURRENT_ANSWERS = { ...ALL_CURRENT_ANSWERS, 
            ...{
                ["Q_" + IDX]: [],
                ["Q_" + IDX + "_INDX"]: 0,
            }
        }    
    }

    //Increasa indexen...
    ALL_CURRENT_ANSWERS["Q_" + IDX + "_INDX"]++;


    ALL_CURRENT_ANSWERS["Q_" + IDX].push("answer")


    document.getElementById(`ANSWER_OUTPUT_${IDX}`).insertAdjacentHTML("beforeend", 
        `<input id="ANSWER_INPUT_${IDX}_${ALL_CURRENT_ANSWERS["Q_" + IDX].length}" placeholder="Answer" class="TEXT_INPUT" type="text">

        <label class="container">
            <input id="CHECKBOX_${IDX}_${ALL_CURRENT_ANSWERS["Q_" + IDX].length}" type="checkbox">
            <span class="checkmark"></span>
        </label>
        `
    )
}

const addShit = () => {

    if(INDEX <= 7){

        const OUTPUT = document.getElementById("OUTPUT")

        const text = `

            <div style="margin-bottom: 2.5vmax">
                <div class="INPUT_SEPARATOR ALIGN-CENTER BUTTON_WRAPPER">

                    <button style="margin-right: -0.6vmax;">Question:</button>

                    <input id="QUESTION_INPUT_${INDEX}"              placeholder="Question"        class="Q_A_INPUT"          type="text"       style="margin-right: 1vmax;">

                    <button style="margin-right: 0%; z-index: 3" onclick="AddAnswer(${INDEX})">Add answer</button>

                </div>
                <div id="ANSWER_OUTPUT_${INDEX}" class="ANSWER_OUTPUT BUTTON_WRAPPER"></div>
            </div>

        `
        // <input id="CORRECT_ANSWER_INPUT_${INDEX}"        placeholder="Correct"         class="Q_A_INPUT"          type="text"    style="z-index: 1; display: block">

        // var newcontent = document.createElement('div');
        // newcontent.innerHTML = text;

        OUTPUT.insertAdjacentHTML("beforeend", text)

        INDEX += 1;
    }
}
const throwerr = (err) => {
    document.getElementById("erroroutput").innerHTML = err
}
const SUBMIT = async () => {

    const filter = /[<>]/gm

    let ALL_ANSWERS = []
    let ALL_CORRECT_ANSWERS = []

    for (let index = 0; index < INDEX; index++) {

        let currentanswers = []
        let currentCorrectAnswers = []

        //Get all aswers for a question:
        for (let answer = 0; answer < ALL_CURRENT_ANSWERS["Q_" + index].length; answer++) {

            currentanswers.push(document.getElementById("ANSWER_INPUT_" + index + "_" + parseInt(answer+1)).value)

            if (document.getElementById("CHECKBOX_" + index + "_" + parseInt(answer+1)).checked == true) {
                currentCorrectAnswers.push(answer)
            }

        }
        ALL_ANSWERS.push(currentanswers)
        ALL_CORRECT_ANSWERS.push(currentCorrectAnswers)

        console.log(ALL_CORRECT_ANSWERS)
    }

    if (getCookie("user_id") != "") {

        if (INDEX >= 1){

            if (document.getElementById("ROOM_NAME").value.replace(filter, "") == "") {
                throwerr("Specify a room name!")
            }
            else if(document.getElementById("QUESTION_INPUT_0").value.replace(filter, "") == ""){
                throwerr("No question provided.")
            }
            // else if(document.getElementById("ANSWER_INPUT_0").value.replace(filter, "") == ""){
            //     throwerr("No answers provided.")
            // }    
            else{

                let RESULT_OBJECT = {
                    Creator: getCookie("user_id"),
                    RoomName: document.getElementById("ROOM_NAME").value.replace(filter, ""),
                    StartTime: parseInt(parseInt(document.getElementById("ROOM_START_TIME").value) + parseInt(new Date().getTime() / 1000)),
                    EndTime: parseInt(parseInt(document.getElementById("ROOM_END_TIME").value) + parseInt(new Date().getTime() / 1000)),
    
                    Questions: []
                }
    
                for (let i = 0; i < INDEX; i++)  {

                    RESULT_OBJECT.Questions.push({
                        Question: document.getElementById("QUESTION_INPUT_" + i).value.replace(filter, ""),
                        Answers: ALL_ANSWERS[i],
                        RightAnswers: ALL_CORRECT_ANSWERS[i],//document.getElementById("CORRECT_ANSWER_INPUT_" + i).value.split(",").map(function(val){return parseInt(--val)})
                    })
                }
                roomID = ""
                for (let i = 0; i < 20; i++) {
                    roomID += str.charAt(Math.floor(Math.random() * str.length));;
                }
    
                try{
                    await fetch('https://backend.artur.red/Create_room/' + roomID, 
                    {
                        method: "GET",
                        headers: {questions: JSON.stringify(RESULT_OBJECT)},
                        'Cache-Control': 'no-cache',
                    })
                    window.open("https://backend.artur.red/room/" + roomID, "_self")
                }catch(err){
                    throwerr(err)
                }
                console.log("done")
            }
        }else{
            throwerr("Add some questions!")
        }
    }else{
        window.open("https://backend.artur.red/CreateAccount")
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
