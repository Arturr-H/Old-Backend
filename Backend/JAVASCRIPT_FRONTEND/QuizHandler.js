
const SetEndDeadInterval = (EndTime) => {

    console.log(EndTime)

    setInterval(() => {

        if(parseInt(EndTime - new Date().getTime() / 1000) <= 0){
            location.reload();
        }
    
    }, 1000)
    
}

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