var faunadb = window.faunadb
q = faunadb.query
var client = new faunadb.Client({
    secret: 'fnAESh4OlQACS72aRDEol_Mhd2AIgUJRWhBx3tD3',
})

const GET_RANDOM_ID = () => {
	str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"

	let ID = ""
	for (let i = 0; i < 15; i++) {
		ID += str.charAt(Math.floor(Math.random() * str.length));;
	}
	return ID;
}

const throwError = (err) => {
    document.getElementById("erroroutput").innerHTML = err;
}

document.getElementById("SgnBTN").addEventListener("click", async () => {

    const email = document.getElementById("inpEm").value;
    const password = document.getElementById("inpPw").value;
    const name = document.getElementById("inpUn").value;
    const description = document.getElementById("inpDs").value;

    if(name.length <= 1){
        throwError("Name not specified");
    }
    if(password.length <= 6){
        throwError("Password is too weak");
    }
    else if (email.indexOf("@") == -1) {
        throwError("Invalid email adress.");
    }
    else{
        try{
            console.log(email)
            const doc = await client.query(
                q.Get(
                    q.Match(
                        q.Index("user_by_email"),
                        email
                    )
                )
            )
    
            throwError("Email already registered")
    
        }catch{
            const ID = GET_RANDOM_ID()
            await client.query(
                q.Create(
                    q.Collection('Users'),
                    {
                        data:{
                            Email: email,
                            Password: password,
                            Id: ID,
                            Username: name,
                            Description: description,
                        }
                    }
                )
            )
            setCookie("user_id", ID, 30);
            window.open("https://backend.artur.red", "_self");
        }
    }
})
