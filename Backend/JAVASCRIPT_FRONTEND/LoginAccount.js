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

document.getElementById("LgnBTN").addEventListener("click", async () => {

    const email = document.getElementById("inpEm").value;
    const password = document.getElementById("inpPw").value;


    try{
        const doc = await client.query(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    email
                )
            )
        )

        if (doc.data.Password == password) {
            console.log("Succesfully logged in to artur.red!")

        }


    }catch(err){
        console.log(err)
        console.log("account not found!")
    }
})