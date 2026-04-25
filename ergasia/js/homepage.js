//Κώδικας για τα slideshow

let slideIndex = 0;
showSlides(slideIndex);
showSlidesAutomatic();

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;

    //Παίρνω τα slides του slideshow
    let slides = document.getElementsByClassName("mySlides");
    //Αν έχει φτάσει στο τέλος το κάνω να επιστρέψει στην αρχή
    if (n > slides.length)
    {
        slideIndex = 1
    }
    //Αν θέλει να παέι στο προηγούμενο slide του αρχικού τότε το πάω στο τελευταίο
    if (n < 1)
    {
        slideIndex = slides.length
    }

    //Εμφανίζω μόνο το slide που αντιστοιχεί στο slideIndex
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

function showSlidesAutomatic() {
    let j;

    //Παίρνω τα slides του slideshow
    let slides = document.getElementsByClassName("mySlides");

    //Ενημέρωση του index του slide στο οποίο βρισκόμαστε
    slideIndex++;
    //Αν έχει φτάσει στο τέλος το κάνω να επιστρέψει στην αρχή
    if (slideIndex > slides.length)
    {
        slideIndex = 1
    }
    //Αν θέλει να παέι στο προηγούμενο slide του αρχικού τότε το πάω στο τελευταίο
    if (slideIndex < 1)
    {
        slideIndex = slides.length
    }

    //Εμφανίζω μόνο το slide που αντιστοιχεί στο slideIndex
    for (j = 0; j < slides.length; j++) {
        slides[j].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";

    //Αυτόματη κλήση του εαυτού της για αλλαγή των slides
    setTimeout(showSlidesAutomatic, 2500);
}

//Κώδικας για τα dislike

let disliked=false
dislikeStart();

function dislikeStart(){
    let bookNumber;
    let amountOfBooks=document.getElementById("grid-homepage").children.length
    console.log(amountOfBooks)
    for(bookNumber=1;bookNumber<=amountOfBooks;bookNumber++)
    {
        let bookId="book"+bookNumber
        document.getElementById(bookId).addEventListener("click", dislikeClicked);
    }
}


function dislikeClicked(){
    if (disliked===false){
        this.firstElementChild.src="img/dislike-after.png"
        this.nextSibling.textContent++;
    }
    else{
        this.firstElementChild.src="img/dislike-before.png"
        this.nextSibling.textContent--;
    }
    disliked=!disliked
}