const butonSearch = document.querySelector(".button-search");
const btnLoad = document.querySelector(".btn-load");
const btnFavourites = document.querySelector(".btn-render-favourites");
const btnReturnHome = document.querySelector(".return-home");
const sectionSearch = document.querySelector(".search");
const sectionFavourites = document.querySelector(".favourites");
const listCharacteres = document.querySelector(".list-characteres");
const listFavourites = document.querySelector(".list-favourites");
const favouties = [];
let page = 1;

const addFavourites = (id)=>{
    if(!favouties.includes(id)){
        favouties.push(id);
        localStorage.setItem('favourities_ids', favouties );
    }
};

const removeFavourites = (id)=>{
    let ids =localStorage.getItem('favourities_ids');
    let ids2 = ids.replace(","+String(id),"");
    console.log(ids2);
    localStorage.setItem('favourities_ids',ids2);
};

const getData = async(enpoint)=>{
    const response = await fetch(enpoint);
    const data = await response.json();
    return data.results;
}

const getCharacteres = async(value)=>{
    return getData(`https://rickandmortyapi.com/api/character/?page=${value}`)
}

const getSearchCharacter = async(name)=>{
    return getData(`https://rickandmortyapi.com/api/character/?name=${name}`)
}

const getFavourites = async(arr)=>{
    const response = await fetch(`https://rickandmortyapi.com/api/character/${arr}`);
    const data = await response.json();
    return data;
}

function createCharacter(){
    const character = document.createElement("div");
    character.classList.add("character");
    return character;
}

function createImageCharacter(link){
    const imageCharacter = document.createElement("img");
    imageCharacter.src = link;
    imageCharacter.classList.add("img-character");
    return imageCharacter;
}

function createNameCharacter(name,id){
    const nameCharacter = document.createElement("a");
    nameCharacter.classList.add("name-character");
    nameCharacter.textContent = name;
    nameCharacter.addEventListener("click",()=>addFavourites(id))
    return nameCharacter;
}

function createBtnUnfavourite(id){
    const btnUnfavourite = document.createElement("a");
    btnUnfavourite.classList.add("btn-unfavourite");
    btnUnfavourite.textContent = "X";
    btnUnfavourite.addEventListener("click",()=>{
        removeFavourites(id);
        rederFavourites();
    });
    return btnUnfavourite;
}
const  clinerCharacteres = ()=>{
    listCharacteres.innerHTML ="";
    listFavourites.innerHTML ="";
}

const renderElements = (data,list,favourite)=>{
    data.forEach(element => {
        const character = createCharacter();
        const img = createImageCharacter(element.image);
        const name = createNameCharacter(element.name,element.id);
        character.append(img,name);
        if (favourite){
            const btnUnFavo = createBtnUnfavourite(element.id);
            character.append(btnUnFavo);
        }
        return list.append(character);
    });
}

const load= async (page)=>{
    try{
        clinerCharacteres();
        const charactersData = await getCharacteres(page);
        renderElements(charactersData,listCharacteres,false);
        
    }catch{
        console.error(e);
    }
}

const search=async ()=>{
    try{
        clinerCharacteres();
        const inputSearch = document.querySelector(".input-search").value;
        const charactersData = await getSearchCharacter(inputSearch);
        renderElements(charactersData,listCharacteres,false);
    }catch{
        console.error(e);
    }
}

const rederFavourites=async ()=>{
    try{
        clinerCharacteres();
        const charactersData = await getFavourites(localStorage.getItem('favourities_ids'));
        renderElements(charactersData,listFavourites,true);
    }catch{
        console.error(e);
    }
}

butonSearch.addEventListener("click",()=> search())
btnLoad.addEventListener("click",()=>{
    ++page;
    load(page);
});
btnFavourites.addEventListener("click",()=>{
    rederFavourites();
    sectionSearch.classList.add("hidden");
    sectionFavourites.classList.remove("hidden");
})
btnReturnHome.addEventListener("click",()=>{
    sectionSearch.classList.remove("hidden");
    sectionFavourites.classList.add("hidden");
    load();
})
load();
