const ApplyText = async () => {

    const text = document.getElementById("message").value
    document.getElementById("message").value = ""

    if (text != "") {

        await fetch("https://backend.artur.red", {

            method: "GET",
            headers: {
                token: "ArturAuth",
                text: text
            }

        })

    }
}


console.log(fetch("HelloWorldServer/log.json", {method: "GET"}))
// document.getElementById("messages").innerHTML = 