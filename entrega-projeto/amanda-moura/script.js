const main = document.getElementById('main-content')
const input = document.querySelector('.search-input')
const button = document.querySelector('.search-button')

button.addEventListener('click', (e) => {
    e.preventDefault();
    const username = input.value.trim()
    username ? getGithubUser(username) : alert("Digite uma usuária válida")
    input.value = ""
})

async function getGithubUser (username) {
    try { 
        const response = await fetch (`https://api.github.com/users/${username}`)
        const userData = await response.json()
        if(response.status == 400){
            renderUserNotFound()
        }  
        else{
            renderUserCard(userData)  
        }   
    } catch (error) {
        console.error("Capturei um erro: ",error)
        
    }
}

function renderUserCard (user) {
    const { avatar_url, name, login, bio, followers, public_repos} = user
    main.innerHTML = `
    <div class="card">
        <img class="profile-img" src=${avatar_url} alt="foto da usuária do github">
        <h2 class="profile-title">${name}</h2>
        <h4 class="profile-subtitle">${login}</h4>
        <p class="profile-description">${bio}</p>
        <div class="profile-infos">
            <div class="box-icons">
                <img src="../../assets/people_outline.png" class="box-img">
                <p class="box-text">${followers}</p>        
            </div>
            <div class="box-icons">
            <img src="../../assets/vector.png" class="box-img">
            <p class="box-text">${public_repos}</p>        
            </div>
        </div>
    </div>
    `        
}

function renderUserNotFound() {
    main.innerHTML =  `
    <div class = 'notfound-box'>
        <h1 class= 'not-found-title'> 404 - Usuária não encontrada viss 😥</h1>
        <h3 class = 'not-found-subtitle'>Pesquise novamente, vá lá po </h3>
        <img class = 'not-found-img' src='../assets/not-found.png'>
    </div>
    `
}