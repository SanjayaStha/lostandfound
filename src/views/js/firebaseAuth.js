function signOut() {
    console.log("---------------")
    firebase.auth().signOut()
    window.location.href = "/logout";
    // checkIfLoggedIn()
}

function signInWithGoogle() {
    console.log("----------------")
    var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
        .then((data) => {
            if (data.additionalUserInfo.isNewUser) {
                userRef = {
                    'name': data.user.displayName,
                    'email': data.user.email,
                    'photoURL': data.user.photoURL,
                    'uid': data.user.uid
                }
                const docRef = db.collection('users').doc(data.user.uid)
                docRef.set(userRef)
            }

            const user = data.user
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ idToken }),
                });
            });

            

        }).then(()=>{
            checkIfLoggedIn()

        })

    .catch(function(err) {
        console.log(err)
    })


}

function checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user logged in")
            // document.getElementById("signin-block").setAttribute('style', 'display:none; visibility:hidden')
            // document.getElementById("signout-block").setAttribute('style', 'display:inline-block')
            window.location.href = "/items";
        } else {
            console.log("user logged out")
            // document.getElementById("signout-block").setAttribute('style', 'display:none; visibility:hidden')
            // document.getElementById("signin-block").setAttribute('style', 'display:inline-block')
            // window.location.replace('/');
        }
    })

}

window.onload = function() {
    // checkIfLoggedIn()
}