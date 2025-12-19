const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



async function signUp() {
    try {
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value
        const response = await axios.post("http://localhost:3000/signup", {
            email : email,
            password : password,
            name : name
        })
        const data = response.data;
        alert(data.msg + "sign in to continue");
    }catch(err) {
        if(err.response){
            alert(err.response.data.msg)
        }else {
            alert("Network Error, can't connect to the server");
        }
    }
}

async function signIn() {
    try {
        const email = document.getElementById("signinEmail").value;
        const password = document.getElementById("signinPassword").value;
        const response = await axios.post("http://localhost:3000/signin", {
            email : email,
            password : password
        })
        const data = response.data;
        const token = response.data.token;
        localStorage.setItem("token", token);
        alert("sign in successfully");
        window.location.href = "/me";
    }catch(err) {
        if(err.response) {
            alert(err.response.data.msg);
        }else {
            alert("Network Error");
        }
    }
}