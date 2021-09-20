if (getCookie("user_id") == "unavailable" || getCookie("user_id") == "") {
    document.getElementById("USER_ACCOUNT_NAV_LINK").href = "https://backend.artur.red/CreateAccount"
    if(document.getElementById("sgnout") != undefined){
        document.getElementById("sgnout").remove();
    }
}else{
    document.getElementById("USER_ACCOUNT_NAV_LINK").href = "https://backend.artur.red/user/" + getCookie("user_id")
    document.getElementById("USER_ACCOUNT_NAV").style.backgroundImage = "url('https://avatars.dicebear.com/api/personas/" + getCookie("user_id") + ".svg')"
    if(document.getElementById("TOP_USER_BAR") != undefined){
        document.getElementById("TOP_USER_BAR").remove();
    }
    // document.getElementById("USER_ACCOUNT_NAV_LINK").href = "https://backend.artur.red/user/" + getCookie("user_id")
}

const CHECK_UID_AVAILABILITY = async () => {

    //kolla om UID:et fortfarande finns, om den inte finns så logga ut.

    await fetch("https://backend.artur.red/checkUIDstatus", {
        headers:{
            UID: getCookie("user_id")
        }
    }).then((res) => {
        if (res.status == 404) {
            if (getCookie("user_id") != "unavailable") {
                setCookie("user_id", "unavailable", 30)
                window.location.reload();
            }
        }
    })
}

CHECK_UID_AVAILABILITY()


if (document.getElementById("sgnout") != undefined) {
    document.getElementById("sgnout").addEventListener("click", () => {
        setCookie("user_id", "", 30);
        window.location.reload()
    });
}

const createRoom = () => {

    window.open("https://backend.artur.red/create", "_self")

}
