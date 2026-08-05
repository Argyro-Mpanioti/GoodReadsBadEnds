let language="greek";

document.getElementById("translation-button").addEventListener("click", async function loadTranslation() {

    fetch('./data/translations_items.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => doTranslation(data))
        .catch(error => console.error('Failed to fetch data:', error));})

async function doTranslation(data) {

    //Change the text of the buttons/headers/etc...
    let newData;
    if(language==="greek")
    {
        newData=data.english;
    }
    else{
        newData=data.greek;
    }

    for (let key in newData)
    {
        //Get the element that has the key as the id
        let changingElement=document.getElementById(key);

        //If the element exists
        if(!(changingElement === null))
        {
            //Make the value its new text
            if(changingElement instanceof HTMLInputElement){
                changingElement.placeholder=newData[key];
            }
            else{
                changingElement.innerText=newData[key];
            }
        }
    }

    //Change the titles and descriptions of the books
    await translateResults();

    //Change the button image
    let image=document.getElementById("flag-image");
    if (language === "english") {
        image.src="./img/icons8-greece-50.png";
    } else {
        image.src="./img/icons8-usa-50.png";
    }

    //Change the value of variable language
    if (language === "english") {
        language = "greek";
    } else {
        language = "english";
    }
}

async function translateResults(){
    const grid = document.getElementById("grid-items");
    const url = `http://127.0.0.1:5000/search`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        //If there are results
        if (!(grid.children.item(0).children.item(0) instanceof HTMLParagraphElement)){
            for (let i = 0; i < grid.childElementCount; i++)
            {
                let result=grid.children[i];
                let bookTitle=result.getElementsByClassName("book-title").item(0);

                let match=data.find(item=>(item.name===bookTitle.textContent || item.name_english===bookTitle.textContent));
                if(match){
                    if(language==="greek"){
                        bookTitle.textContent=match.name_english;
                        let description=result.getElementsByClassName("description").item(0);
                        description.textContent=match.description_english;
                    }
                    else{
                        bookTitle.textContent=match.name;
                        let description=result.getElementsByClassName("description").item(0);
                        description.textContent=match.description;
                    }

                }
            }
        }

}

let disliked_items={};

function dislikeStartItems(){
    let bookNumber;
    let amountOfBooks=document.getElementById("grid-items").children.length
    for(bookNumber=1;bookNumber<=amountOfBooks;bookNumber++)
    {
        let bookId="book"+bookNumber
        disliked_items[bookId]=false
        document.getElementById(bookId).addEventListener("click", dislikeClickedItems);
    }
}

function dislikeClickedItems(){
    let bookId=this.id;
    if (disliked_items[bookId]===false){
        this.firstElementChild.src="img/dislike-after.png"
        disliked_items[bookId]=true
    }
    this.nextSibling.textContent++;
    dislike(bookId);
}

let booksDisplayedIds = {};
window.addEventListener("load", async function displayAllItems() {
    const url = `http://127.0.0.1:5000/search`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        const grid = document.getElementById("grid-items");
        grid.innerHTML = "";
        booksDisplayedIds = {};

        for (let i = 0; i < data.length; i++) {
            let result = document.createElement("div");
            result.setAttribute("class", "result");
            grid.appendChild(result);

            let resultImage = document.createElement("img")
            resultImage.setAttribute("src", data[i].image);
            resultImage.setAttribute("style", "width: 100%");
            resultImage.setAttribute("alt", "Το εξώφυλλο του " + "\"" + data[i].name + "\"");
            result.appendChild(resultImage)

            let captionText = document.createElement("div");
            captionText.setAttribute("class", "caption-text");
            result.appendChild(captionText);

            let bookTitle = document.createElement("div");
            bookTitle.setAttribute("class", "book-title");
            let spanElement=document.createElement("span");
            spanElement.innerText = data[i].name;
            spanElement.addEventListener("click",()=> goToWikipedia(data[i].wikipedia_link_book));
            bookTitle.appendChild(spanElement);
            captionText.appendChild(bookTitle);

            let authorElement = document.createElement("div");
            authorElement.setAttribute("class", "author-name");
            let spanElementAuthor=document.createElement("span");
            spanElementAuthor.innerText = data[i].author;
            spanElementAuthor.addEventListener("click",() => goToWikipedia(data[i].wikipedia_link_author));
            authorElement.appendChild(spanElementAuthor);
            captionText.appendChild(authorElement);

            let description = document.createElement("div");
            description.setAttribute("class","description");
            description.innerText = data[i].description;
            captionText.appendChild(description);

            let priceDislike = document.createElement("div");
            priceDislike.setAttribute("class", "price-dislike");
            result.appendChild(priceDislike);
            let price = document.createElement("div");
            price.setAttribute("class", "price");
            price.innerText = data[i].price + "$";
            priceDislike.appendChild(price);
            let dislikeSection = document.createElement("div");
            dislikeSection.setAttribute("class", "dislike-section");
            let button = document.createElement("button");
            button.setAttribute("id", "book" + (i + 1));
            dislikeSection.appendChild(button);
            let buttonImage = document.createElement("img");
            buttonImage.setAttribute("src", "../ergasia/img/dislike-before.png");
            buttonImage.setAttribute("alt", "κουμπί dislike");
            button.appendChild(buttonImage);
            dislikeSection.innerHTML += data[i].likes;
            priceDislike.appendChild(dislikeSection);

            booksDisplayedIds["book"+(i+1)] = data[i].id;
        }
        dislikeStartItems();

    } catch (error) {
        console.error(error.message);
    }
});

function goToWikipedia(url){
    if(url)
    {
        window.open(url,"_blank");
    }
}

//Event listeners for the search bar
["submit","input"].forEach(evt=>document.getElementById("search-form").addEventListener(evt,handleInteraction));
async function handleInteraction(e) {

    e.preventDefault();
    const input = document.getElementById("search-input").value;
    const url = `http://127.0.0.1:5000/search?name=${input}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        const grid = document.getElementById("grid-items");
        grid.innerHTML = "";
        booksDisplayedIds = {};

        for (let i = 0; i < data.length; i++) {
            let result = document.createElement("div");
            result.setAttribute("class", "result");
            grid.appendChild(result);

            let resultImage = document.createElement("img")
            resultImage.setAttribute("src", data[i].image);
            resultImage.setAttribute("style", "width: 100%");
            resultImage.setAttribute("alt", "Το εξώφυλλο του " + "\"" + data[i].name + "\"");
            result.appendChild(resultImage)

            let captionText = document.createElement("div");
            captionText.setAttribute("class", "caption-text");
            result.appendChild(captionText);
            let bookTitle = document.createElement("div");
            bookTitle.setAttribute("class", "book-title");
            bookTitle.innerText = data[i].name;
            captionText.appendChild(bookTitle);

            let description = document.createElement("div");
            description.setAttribute("class", "description");
            if(language==="greek"){
                description.innerHTML = data[i].description;
            }
            else{
                description.innerHTML = data[i].description_english;
            }
            captionText.appendChild(description);

            let priceDislike = document.createElement("div");
            priceDislike.setAttribute("class", "price-dislike");
            result.appendChild(priceDislike);
            let price = document.createElement("div");
            price.setAttribute("class", "price");
            price.innerText = data[i].price + "$";
            priceDislike.appendChild(price);
            let dislikeSection = document.createElement("div");
            dislikeSection.setAttribute("class", "dislike-section");
            let button = document.createElement("button");
            button.setAttribute("id", "book" + (i + 1));
            dislikeSection.appendChild(button);
            let buttonImage = document.createElement("img");
            buttonImage.setAttribute("src", "../ergasia/img/dislike-before.png");
            buttonImage.setAttribute("alt", "κουμπί dislike");
            button.appendChild(buttonImage);
            dislikeSection.innerHTML += data[i].likes;
            priceDislike.appendChild(dislikeSection);

            booksDisplayedIds["book" + (i + 1)] = data[i].id;
        }

        if (data.length === 0) {
            let message = document.createElement("div");
            let messageText = document.createElement("p");
            messageText.id="no-results-message"
            if(language==="greek"){
                messageText.innerHTML = "Το βιβλίο που αναζητάτε δεν υπάρχει!"
            }
            else{
                messageText.innerHTML = "No Results Found!"
            }

            message.appendChild(messageText);
            grid.appendChild(message);
        } else {
            dislikeStartItems();
        }
    } catch (error) {
        console.error(error.message);
    }
}

document.getElementsByClassName("navigation-text").item(0).addEventListener("click",async function goToHomepage(){
    window.location.href="homepage2.html"
})
document.getElementsByClassName("logo-name").item(0).addEventListener("click",async function goToHomepage(){
    window.location.href="homepage2.html"
})

async function dislike(bookId) {
    const url = "http://127.0.0.1:5000/like";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: booksDisplayedIds[bookId]
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error(error.message);
    }
}