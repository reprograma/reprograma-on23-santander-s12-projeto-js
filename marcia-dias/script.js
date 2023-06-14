const main = document.getElementById('main-content')
const input = document.querySelector('.search-input')
const button = document.querySelector('.search-button')

button.addEventListener('click', (e) => {
    e.preventDefault();
    const username = input.value.trim()
    username ? getGithubUser(username) : alert("Digite uma usuária válida")
    input.value = ""
})

async function getGithubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`)
        const userData = await response.json()
        if (response.status == 404) {
            renderUserNotFound()
        } else {
            renderUserCard(userData)
        }

    }
    catch (err) {
        console.error("Capturei um erro: ", err)

    }
}

function renderUserCard(user) {
    const { avatar_url, name, login, bio, followers, public_repos, html_url } = user
    main.innerHTML = `
    <div class="card">
        <a href=${html_url} target="_blank"><img class="profile-img" src=${avatar_url} alt="foto da usuária do github"></a>
        <h2 class="profile-title">${name ? name : ""}</h2>
        <h4 class="profile-subtitle">${login ? login : ""}</h4>
        <p class="profile-description">${bio ? bio : ""}</p>
        <div class="profile-infos">
            <div class="box-icons">
                <img src="../../assets/people_outline.png" class="box-img">
                <p class="box-text">${followers}</p>        
            </div>
            <div id="repo-button" class="box-icons">
            <img src="../../assets/vector.png" class="box-img">
            <p class="box-text">${public_repos}</p>        
            </div>
        </div>
    </div>
    `

    const repoButton = document.getElementById('repo-button')

    repoButton.addEventListener('click', (e) => {
        e.preventDefault()
        getRepositories(login)
    })

}

function renderUserNotFound() {
    main.innerHTML = `
        <div class="not-found-box">
            <h1 class="not-found-title">404:Usuária não encontrada</h1>
            <h3 class="not-found-subtitle">Pesquise novamente🤒</h3>
            <img class="not-found-img" src="../../assets/notfound.png" alt="">
        </div>
    `
}

async function getRepositories(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`)
        const respositories = await response.json()
        if(respositories.length ==0){
            renderNoRepositories()
        }
        renderRepositoriesCard(respositories)
    }
    catch (err) {
        console.error("Capturei um erro: ", err)
    }

}

function renderRepositoriesCard(respositories) {
    let respositoriesList = document.getElementById('repositories-list')
    if(!respositoriesList){
        respositoriesList = document.createElement('div')
        respositoriesList.setAttribute('id', 'repositories-list')
        main.appendChild(respositoriesList)
    }
    else {
        respositoriesList.innerHTML = ""
    }


    respositories.map((repository) => {
        const { name, description, language, stargazers_count } = repository
        return respositoriesList.innerHTML += `
        <div class="repository">
            <h2 class="repository-title">${name ? name : ""}</h2>
            <p class="repository-description">${description ? description : ""}</p>
            <div class="repository-details>
                <p class="repository-text">${language ? language : ""}</p> 
                <p class="repository-text">
                <img src="../../assets/star.png">${stargazers_count ? stargazers_count : ""}</p>
            </div>
        </div>
        `
    })
}

function renderNoRepositories(username) {
    main.innerHTML = `
        <div class="not-repositories-box">
            <h2 class="not-repositories-title">Não possui repositórios públicos</h1>
            <h3 class="not-repositories-subtitle">Entre em contato com a usuária</h3>
        </div>
    `
}