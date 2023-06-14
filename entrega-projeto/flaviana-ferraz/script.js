const main = document.getElementById('main-content')
const input = document.querySelector('.search-input')
const button = document.querySelector('.search-button')

button.addEventListener('click', (event)=> {
    event.preventDefault();
    const username = input.value.trim();
    username ? getGithubUser(username): alert("Digite uma usuária válida")
    input.value="";
})

async function getGithubUser(user){
    try {
        const response = await fetch(`https://api.github.com/users/${user}`)
        const userData = await response.json()
        if(response.status == 404){
            renderUsersNotFound();
        }else{
            renderUserCard(userData);
        }
    } catch (erro) {
        console.error("Erro caputurado" + erro)
    }
}

function renderUsersNotFound(){
    main.innerHTML = `
    <div class="not-found-box">
        <h1 class="not-found-title"> 404: Usuária não encontrada :( </h1>
        <h3 class="not-found-subtitle">Pesquise novamente</h3>
        <img class="not-found-img" src="/assets/notfound.png">
    </div>
    `
}

function renderUserCard(user){
    const {html_url, avatar_url, name, login, bio, followers, public_repos} = user
    main.innerHTML = `
    <div class="card">
        <a href=${html_url} target="_blank">
            <img class="profile-img" src="${avatar_url}" alt="foto da usuáriia do github">
        </a>
        <h2 class="profile-title">${name ? name:""}</h2>
        <h4 class="profile-subtitle">${login ? login:""}</h4>
        <p class="profile-description">${bio ? bio:""}</p>
        <div class="profile-infos">
            <div class="box-icons">
                    <img src="/assets/people_outline.png" class="box-icon">
                    <p class="box-text">${followers}</p>
            </div>
            <div id="repo-button" class="box-icons">
                <img src="/assets/Vector.png" class="box-icon">
                <p class="box-text">${public_repos}</p>
            </div>
        </div>
    </div>
    `
    
    const repoButton = document.getElementById('repo-button')

    repoButton.addEventListener('click', clicked = (event)=> {
    event.preventDefault();
    getRepositories(login);
    repoButton.removeEventListener('click', clicked);
    })   
}


async function getRepositories(username){
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`)
        const repositories = await response.json()

        if(repositories.length === 0){
            main.innerHTML += `
            <div id="no-repos-box">
                <h1 class="no-repos-title"> ${username} não possui Repositórios Públicos ainda.</h1>
            </div>
        `
        }else{
            renderRepositoriesCards(repositories)
        }
    }
     catch (erro) {
        console.error("Erro caputurado" + erro)
    }
}

function renderRepositoriesCards(repositories){
    const repositoriesList = document.createElement('div')
    repositoriesList.setAttribute('id', 'repositories-list')
    main.appendChild(repositoriesList)

    repositories.map((repository)=>{
        const{name, description, language, stargazers_count} = repository;
        return repositoriesList.innerHTML += `
        <div class="repository">
            <h2 class="repository-title">${name ? name: ""}</h2>
            <p class="repository-description">${description ? description: ""}</p>
            <div class="repository-details">
                <p class="repository-text" id="language"><img src="" id="img-language">${language ? language:""}</p>
                <p class="repository-text">
                <img src="/assets/star.png">${stargazers_count}</p>
            </div>
        </div>
        `
    })

    // imgLanguageRepresent();
}

// function imgLanguageRepresent( ){
//     let imgLanguage = document.getElementById('img-language');
//     let language = document.getElementById('language');
//     // let repositories = document.getElementById('repositories-list');
//     const linguagens = ["JavaScript", "CSS", "HTML"];
    
//     for (const lang of language) {
//         if(lang == linguagens[0]){
//             imgLanguage.src ="./assets/js_ball.jpg"
//         } else if(lang == linguagens[1]){
//             imgLanguage.src = "./assets/css_ball.jpg"
//         } else if(lang == linguagens[2]){
//             imgLanguage.src ="./assets/html_ball.jpg"
//         }else{
//             imgLanguage.src ="./assets/sem_ling.jpg"
//         }      
//     }
// }

function darkMode(){
    document.body.classList.toggle("dark");
    // let button = document.getElementById('darkbutton');
    // button.innerHTML = `
    // <button onClick="returnLightMode()"id='light-mode'>Light Mode</button>
    // `
}
