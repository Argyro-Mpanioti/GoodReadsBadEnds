let slideIndex0 = 1;
let slideIndex1 = 1;
showSlides(slideIndex0,0);
showSlides(slideIndex1,1);

// Next/previous controls
function plusSlides(n,id) {
    if (id===0)
    {
        showSlides(slideIndex0 += n,0);
    }
    if (id===1)
    {
        showSlides(slideIndex1 += n,1);
    }
}

//Το n είναι ο αριθμός του slide στο οποίο θέλει να πάει
//Το id είναι το id του slideshow το οποίο αλλάζει
function showSlides(n,id) {
    let i;
    //Παίρνω το slideshow για το οποίο θέλω να κάνω ενημέρωση
    //Βρίσκω το πραγματικό id
    let real_id = "slideshow" + id
    let slideshow = document.getElementById(real_id);
    //Παίρνω τα slides του slideshow
    let slides = slideshow.getElementsByClassName("mySlides");

    //Αν έχει φτάσει στο τέλος το κάνω να επιστρέψει στην αρχή
    if (n > slides.length)
    {
        if (id===0)
        {
            slideIndex0 = 1
        }
        else
        {
            slideIndex1 = 1;
        }
    }
    //Αν θέλει να παέι στο προηγούμενο slide του αρχικού τότε το πάω στο τελευταίο
    if (n < 1)
    {
        if (id===0)
        {
            slideIndex0 = slides.length
        }
        else
        {
            slideIndex1 = slides.length
        }
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    if (id===0)
    {
        slides[slideIndex0-1].style.display = "block";
    }
    else
    {
        slides[slideIndex1-1].style.display = "block";
    }
}