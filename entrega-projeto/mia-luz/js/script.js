const input = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const mainContainer = document.getElementById("main__container")



searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    const username = input.value.trim()
    username ? getUserData(username) : alert('Digite uma usuária válida')
    input.value = ""
})

const getUserData = async (username) => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`)
        const userData = await response.json()
        response.status == 404 ? renderUserNotFound()  : renderUserCard(userData)
    } catch (error) {
        console.error(error)
    }
}

const renderUserCard = (user) => {
    const { login, html_url, name, bio, followers, public_repos, avatar_url } = user

    mainContainer.innerHTML = `
    <section class="user-card__container" id="card-container">
    <a href=${html_url} target="_blank">
                <img class="user-card__img"src=${avatar_url} 
                alt="foto da usuaria do github">     
            </a>

            <a href=${html_url} target="_blank" class="user-card__name">
                <h2>${name ? name : ''}</h2>
            </a>

            <h4 class="user-card__username">${login}</h4>
            <p class="user-card__bio">${bio ? bio : ''}</p>

            <div class="info-icons__container">

                <div class="info-icons__icon">
                    <img src="../../assets/people_outline.png" alt="icon followers">
                    <p class="info-icons__number">${followers}</p>
                </div>

                <div class="info-icons__icon" id="repos-button">
                    <img src="../../assets/Vector.png" alt="icon repos">
                    <p class="info-icons__number">${public_repos}</p>
                </div>

            </div>
        </section>
    `

    const reposButton = document.getElementById('repos-button')
    
    reposButton.addEventListener('click', showReposWhenClicked = async (e) => {
        e.preventDefault()
        try {
            const reposList = await getRepos(login)

            reposList.length >= 1 ? renderRepos(reposList) :  mainContainer.innerHTML += `
                    <section class="no-repos__container">
                        <h2 class="no-repos__title">${login} não tem repositórios públicos ainda</h2>
                    </section>
                    `
        
            reposButton.removeEventListener('click', showReposWhenClicked)
        } catch (error) {
            console.error(error)
        }
     
    })
}

const renderUserNotFound = () => {
    mainContainer.innerHTML = `
    <section class="not-found__container">
        <h1 class="not-found__title">Usuária Não Encontrada 😢</h1>
        <h3 class="not-found__subtitle">Pesquise Novamente</h3>
        <img class="not-found__img" src="../../assets/notfound.png" alt="imagem not found">
    </section>
    `
}

const getRepos = async (username) => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`)
        const reposList = await response.json()
        return reposList
        
    } catch (error) {
        console.error(error)
    }
}


const renderRepos = (reposList) => {
    mainContainer.innerHTML += ` <section class="repos__container" id="repos__container"></section>`
    const reposContainer = document.getElementById("repos__container")
    
    reposList.map((repo) => {
        const { name, description, stargazers_count, language, html_url } = repo
        reposContainer.innerHTML += ` 
            <div class="repos__card">
                <a class="repos__repo-link" href=${html_url} target="_blank">
                    <h3 class="repos__repo-name">${name ? name : ""}</h3>
                </a>
                <p class="repos__repo-description">${description ? description : ""}</p>
                <div class="repos__repo-details">
                    <p class="repo-details__text">${language ? language : ""}</p>
                    <p class="repo-details__text">
                        <img src="../../assets/star.png" alt="icone estrela dos favoritos">
                        ${stargazers_count}
                    </p>
                </div>
            </div>

      `

    })
}


const nightModeButton = document.getElementById('night-mode-button')
let isNightModeEnabled = false

const enableNightMode = () => {

    if(isNightModeEnabled === true){
        nightModeButton.innerHTML = '🌙'
        document.documentElement.style.setProperty('--primary', '#ec9b69')
        document.documentElement.style.setProperty('--main-backgroundcolor', '#f8f8f8')
        document.documentElement.style.setProperty('--second-backgroundcolor', '#ffffff')
        document.documentElement.style.setProperty('--text-color', '#959595')

        isNightModeEnabled = false

    }else{
     
        nightModeButton.innerHTML = '☀️'

        document.documentElement.style.setProperty('--primary', '#A31ACB')
        document.documentElement.style.setProperty('--main-backgroundcolor', '#371B58')
        document.documentElement.style.setProperty('--second-backgroundcolor', '#4b207d')
        document.documentElement.style.setProperty('--text-color', '#b38de8')
        
        isNightModeEnabled = true

    }

}

nightModeButton.addEventListener('click', enableNightMode)