str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"
let INDEX = 0;


const ANSWER_CAP = 8

let ALL_QUESTIONS = {}

let ALL_CURRENT_ANSWERS = {Tot: 0}

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}


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

            <div style="margin-bottom: 2.5vmax; width: 25vmax" class="BUTTON_WRAPPER">

                <input id="QUESTION_INPUT_${INDEX}"              placeholder="Question"        class="TEXT_INPUT"    style="margin: auto; margin-bottom: 1vmax; width: 70%"       type="text">

                <div id="ANSWER_OUTPUT_${INDEX}" style="margin: auto" class="ANSWER_OUTPUT"></div>
                <button class="ADDER" onclick="AddAnswer(${INDEX})">+</button>
            </div>

        `
        // <input id="CORRECT_ANSWER_INPUT_${INDEX}"        placeholder="Correct"         class="Q_A_INPUT"          type="text"    style="z-index: 1; display: block">

        // var newcontent = document.createElement('div');
        // newcontent.innerHTML = text;

        OUTPUT.insertAdjacentHTML("beforeend", text)

        if (document.getElementById("drm") != undefined) {
            document.getElementById("drm").remove();
        }
        OUTPUT.insertAdjacentHTML("beforeend", `    
            <div id="drm" class="BUTTON_WRAPPER" style="margin-bottom: 2vmax">
                <button style="width: 25vmax;" onclick="addShit()">Add question</button>
            </div>
        `)

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

            currentanswers.push(encode_utf8(document.getElementById("ANSWER_INPUT_" + index + "_" + parseInt(answer+1)).value))

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
                    RoomName: encode_utf8(document.getElementById("ROOM_NAME").value.replace(filter, "")),
                    StartTime: parseInt(parseInt(document.getElementById("ROOM_START_TIME").value) + parseInt(new Date().getTime() / 1000)),
                    EndTime: parseInt(parseInt(document.getElementById("ROOM_END_TIME").value) + parseInt(new Date().getTime() / 1000)),
    
                    Questions: []
                }
    
                for (let i = 0; i < INDEX; i++)  {

                    RESULT_OBJECT.Questions.push({
                        Question: encode_utf8(document.getElementById("QUESTION_INPUT_" + i).value.replace(filter, "")),
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
                        'Content-type': 'application/json; charset="utf-8"',
                        headers: {questions: JSON.stringify(RESULT_OBJECT)},
                        'Cache-Control': 'no-cache',
                        
                    })
                    window.open("https://backend.artur.red/room/" + roomID, "_self")
                }catch(err){
                    console.log(RESULT_OBJECT)
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
