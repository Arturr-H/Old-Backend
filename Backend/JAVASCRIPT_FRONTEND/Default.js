if (getCookie("user_id") == "") {
    document.getElementById("USER_ACCOUNT_NAV_LINK").href = "https://backend.artur.red/CreateAccount"
}else{
    document.getElementById("USER_ACCOUNT_NAV_LINK").href = "https://backend.artur.red/user/" + getCookie("user_id")
    document.getElementById("USER_ACCOUNT_NAV").style.backgroundImage = "url('https://avatars.dicebear.com/api/personas/" + getCookie("user_id") + ".svg')"
    if(document.getElementById("TOP_USER_BAR") != undefined){
        document.getElementById("TOP_USER_BAR").remove();
    }
    // document.getElementById("USER_ACCOUNT_NAV_LINK").href = "https://backend.artur.red/user/" + getCookie("user_id")
}