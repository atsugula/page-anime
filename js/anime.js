const base_url = "https://api.jikan.moe/v3";

function searchAnime(event){

    event.preventDefault();

    const form = new FormData(this);
    const query = form.get("search");
    console.log(`${base_url}/search/anime?q=${query}&page=1`);
    fetch(`${base_url}/search/anime?q=${query}&page=1`)
    .then(res=>res.json())
    .then(updateDom)
    .catch(err=>console.warn(err.message));

}

function updateDom(data){

    const searchResults = document.getElementById('search_results');
    
    const animeByCategories = data.results
    .reduce((acc, anime)=>{

        const {type} = anime;
        if(acc[type] === undefined) acc[type] = [];
        acc[type].push(anime);
        return acc;

    }, {});

    searchResults.innerHTML = Object.keys(animeByCategories).map(key=>{
        
        const animesHTML = animeByCategories[key]
            .sort((a,b)=>a.episodes-b.episodes)
            .map(anime=>{
                console.log(anime)
                return `                
                <a href="${anime.url}" title="${anime.title}">
                    <div class="card">
                        <div class="card-image">
                            <img src="${anime.image_url}">
                            <span class="card-title">${anime.title}</span>
                        </div>
                    </div>  
                </a>              
                `
            }).join("");
            
            return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="kemicofa-row">${animesHTML}</div>
                </section>
            `

    }).join("");

}

function pageLoaded(){
    const form = document.getElementById("search_form");
    form.addEventListener("submit", searchAnime);
}

window.addEventListener("load", pageLoaded);