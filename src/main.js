import './style.css'
import Lenis from 'lenis'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);



// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing in GSAP
gsap.ticker.lagSmoothing(0);



// ==========================================
// Preloader Animationen
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM geladen');

    // Smooth Scroll für Navigation
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      lenis.scrollTo(this.getAttribute('href'), {
        duration: 1.5
      });
    });
  });


    // INITIAL STATES - GANZ AM ANFANG!
  gsap.set('.letter', { opacity: 0, scale: 0.5 });
  gsap.set('#overlay', { yPercent: 100 });
  gsap.set('#hero', { yPercent: 100 });
  gsap.set('.img-hero, #hero h1, #hero h2', { opacity: 0});
    gsap.set('.img-hero', { scale: 0});
    gsap.set('.navbar', {opacity: 0})

  
  preloaderTimeline();
  
  introAnimation();
  emotionEffect();
  aboutEffect();
  projectHoverEffect();
  coachText();
  footerText();
});

function preloaderTimeline() {
  const overlay = document.querySelector('#overlay');
  const hero = document.querySelector('#hero');
  
  const preloader = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = 'auto';
      
      // // Preloader entfernen
      // document.querySelector('#preloader').style.display = 'none';
      
      // Overlay entfernen (ist ja nach oben raus)
      overlay.style.display = 'none';
      
      // // Hero wird zur normalen Section
      hero.style.position = 'relative';
      hero.style.transform = 'none';
      
      console.log('Preloader fertig - Scrollen aktiviert');
        heroAnimation(); // ← HIER!
    }
  });


  
  preloader
    .to('.ampersand', {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power1.inOut',
    })
    .to('.c-left, .c-right', {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power1.inOut'
    })
    .to({}, { duration: 1 })

    .to('#preloader', {
      duration: 1,
      autoAlpha: 0,
      ease: 'power2.inOut'
    })

     // OVERLAY VON UNTEN NACH OBEN! ← DAS FEHLT
    .to('#overlay', {
      yPercent: -100,  // Von 100% (unten) zu 0% (oben)
      duration: 1.5,
      ease: 'power2.inOut'
    }, '-=0.5') // Startet 0.5s bevor Preloader fertig ist
    
    // 5. Hero kommt von unten rein (100% → 0%)
    .to('#hero', {
      yPercent: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.1');  // Überlappt leicht mit Overlay

}

//HERO Animation
function heroAnimation(){
  const heroTL = gsap.timeline();

  heroTL
    .to('.img-hero', {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: 'power2.out'
    })
    .to(['#hero h1', '#hero h2', '.navbar'], {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1  // 0.2s Verzögerung zwischen jedem
    }, '-=0.1');  // Startet 1s vor Ende vom Bild
}


//INTRO ANIMATION
function introAnimation() {
  console.log('🎬 introAnimation wird aufgerufen');
  
  const textboxes = gsap.utils.toArray('.textbox-grey, .textbox-grey-2');
  console.log('📦 Gefundene Textboxen:', textboxes.length);
  
  // BESSER: Alle Text-Elemente direkt auswählen
  const textContent = gsap.utils.toArray('.textbox-grey h2, .textbox-grey h3, .textbox-grey p, .textbox-grey-2 h2, .textbox-grey-2 h3, .textbox-grey-2 p, .textbox-grey-2 div');
  console.log('📝 Text Elemente:', textContent.length);
  
  // Initial Setup
  gsap.set(textboxes, { 
    opacity: 0,
    transformPerspective: 1000
  });
  
  if (textContent.length > 0) {
    gsap.set(textContent, { 
      opacity: 0,
      y: 10
    });
  }
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#intro',
      start: 'top 80%',
      toggleActions: 'play none none none',
     
    }
  });
  
  tl.to(textboxes, {
    opacity: 1,
    rotationX: 360,
    duration: 0.5,
    ease: 'power2.inOut',
    stagger: 0.06,
    onStart: () => console.log('🎡 Spin startet!')
  });
  
  // Nur wenn Text-Elemente existieren
  if (textContent.length > 0) {
    tl.to(textContent, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.04
    }, '-=0.2');
  }
}


//Work-Animation
// function projectHoverEffect() {
//   const items = document.querySelectorAll('.project-item');
//   const image = document.querySelector('.hover-image img'); // Spezifischer!
//   const imageContainer = document.querySelector('.hover-image'); // Container für Positioning

//   // Initial Setup - Bild versteckt
//   // gsap.set(imageContainer, {
//   //   clipPath: 'inset(100% 0 0 0)' // Komplett versteckt von oben
//   // });

//   items.forEach((el) => {
//     el.addEventListener('mouseover', () => { // Entferne e.target hier
//       const imageData = el.getAttribute('data-image'); // ✅ Verwende el statt e.target
//       console.log(imageData);
      
//       image.setAttribute('src', imageData);
//       imageContainer.style.opacity = '1'; // Zeige das Bild
//     });



//     el.addEventListener('mouseleave', () => {
//       imageContainer.style.opacity = '0'; // Verstecke das Bild
//       image.setAttribute('src', '');
//     });
//   });
// }


//Animation für Section Emotion

function emotionEffect(){
  const emotionImage = document.getElementById('img-emotion');
  const intuitionImage = document.getElementById('img-intuition');

  // Array mit eckigen Klammern!
  gsap.set([emotionImage, intuitionImage], { 
    rotationX: 90,
    transformPerspective: 1000
  });

  gsap.to([emotionImage, intuitionImage], {
    scrollTrigger: {
      trigger: '#emotion',
      start: 'center 80%',
      toggleActions: 'play none none reverse'
      
    },
    rotationX: 0,
    duration: 1,
    ease: 'power2.out'
  })
}

//Animation für Section About
function aboutEffect(){
 const technologyText = document.querySelectorAll('.technology');

  gsap.set(technologyText, {
    opacity: 0
  })

  gsap.to(technologyText, {
    scrollTrigger: {
      trigger: '#about',
      start: 'top center',
      toggleActions: 'play none none reverse'
    },
    opacity: 1,
    duration: 1,
    ease: 'power2.inOut'
  })
}


//Animation für Work

function projectHoverEffect() {
  const items = document.querySelectorAll('.project-item');
  const image = document.querySelector('.hover-image img');
  const box = document.querySelector('.hover-image');

  gsap.set(box, { 
    opacity: 1,
    clipPath: 'inset(100% 0% 0% 0%)'
  });

  items.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const src = el.dataset.image;
      if (!src) return;

      // Bild setzen
      image.src = src;
      
      // Animation mit fromTo - funktioniert IMMER
      gsap.timeline()
        .set(box, { clipPath: 'inset(100% 0% 0% 0%)' })  // Reset
        .to(box, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power4.in'
        });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(box, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 0.6,
        ease: 'power2.in'
      });
    });
  });
}


//Animation für coach 

function coachText(){
const textSpecialization = document.querySelectorAll('.text-specialization');
const textCoach = document.querySelectorAll('.text-coach');
const textWorkplace = document.querySelectorAll('.text-workplace');

gsap.set([textCoach, textSpecialization, textWorkplace], {
  opacity: 0
})

gsap.to([textCoach, textSpecialization, textWorkplace], {
  scrollTrigger: {
    trigger: '#coach',
    start: 'top center',
      toggleActions: 'play none none reverse'
  },
  opacity: 1,
  duration: 1,
  ease: 'power2.inOut',

})

}


//Animation für footer
function footerText(){
const contactText = document.querySelectorAll('.contact');
const copyrightText = document.querySelectorAll('.copyright');
const headlineFooter = document.querySelector('#footer h1');

gsap.set([contactText, copyrightText, headlineFooter], {
  opacity: 0
})

gsap.to([contactText, copyrightText, headlineFooter], {
  scrollTrigger: {
    trigger: '#footer',
  start: 'top top',
  toggleActions: 'play none none reverse'
  }, 
  opacity: 1,
  duration: 1,
  ease: 'power2.inOut'
})

}