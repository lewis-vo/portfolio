// Reset scroll position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
});

// Create a glitching text on hovering clickable elements
const shuffleString = (str, replaceChance, replacementChars) => {
  return str
    .split("")
    .map((char) => {
      return Math.random() < replaceChance // Only replace the text if the random value goes over the specified threshold
        ? replacementChars[Math.floor(Math.random() * replacementChars.length)]
        : char;
    })
    .sort(() => Math.random() - 0.5)
    .join("");
};
function shuffleTextOnHover() {
  const elements = document.querySelectorAll("[data-shuffle-on-hover]");
  const shuffleDuration = 300; // Duration of shuffling in milliseconds
  const shuffleCount = 6; // Number of times to shuffle
  const replaceChance = 0.14; // Chance of replacing a character
  const replacementChars = "_#!?$&";

  elements.forEach((element) => {
    // Store the original text so that it is not lost
    const originalText = element.textContent;

    // Special value only needed for the showcase text and value
    const text1 = element.querySelector("h4");
    const text2 = element.querySelector("p");
    const originalText1 = text1 ? text1.textContent : "";
    const originalText2 = text2 ? text2.textContent : "";

    const isCutItem = element.classList.contains("cut-item") ? true : false;

    const shuffle = () => {
      if (isCutItem) {
        let shuffleInterval = setInterval(() => {
          text1.textContent = shuffleString(
            originalText1,
            replaceChance,
            replacementChars
          );

          text2.textContent = shuffleString(
            originalText2,
            replaceChance,
            replacementChars
          );
        }, shuffleDuration / shuffleCount);

        setTimeout(() => {
          clearInterval(shuffleInterval);
          text1.textContent = originalText1;
          text2.textContent = originalText2;
        }, shuffleDuration);

        return;
      }

      let shuffleInterval = setInterval(() => {
        element.textContent = shuffleString(
          originalText,
          replaceChance,
          replacementChars
        );
      }, shuffleDuration / shuffleCount);

      setTimeout(() => {
        clearInterval(shuffleInterval);
        element.textContent = originalText;
      }, shuffleDuration);
    };

    element.addEventListener("mouseover", shuffle);
  });
}

shuffleTextOnHover();

// Using a global animation value to reunite all the appear-in transition
const appearDuration = 1100;

function checkIfElementInViewport(element) {
  const boundingRect = element.getBoundingClientRect();
  
  if (element.classList.contains("cut-item")) {
    console.log( boundingRect.top );
  }

  return (
    boundingRect.top <= (window.innerHeight - window.innerHeight*0.14)
  );
}

const elements = document.querySelectorAll("[data-appear]");
function createMoveInEffect() {
  elements.forEach((element) => {
    if (element.dataset.animated) return;
    const clipped = element.dataset.appearClipped === "true";
    const forceOnLoad = element.dataset.appearOnLoad === "true";
    if (clipped) {
      // Set clip path, this will make the element move up behind somthing, adding variety to the system
      element.style.clipPath = `inset(0 0 100% 0)`;
    } else {
      element.style.opacity = "0";
    }
    if (checkIfElementInViewport(element) || forceOnLoad === true) {
      element.dataset.animated = true;
      // Make the default is moving from the bottom up
      element.style.transform =
        "translate(" +
        (element.dataset.appear === "from-left"
          ? "100%, 0"
          : element.dataset.appear === "from-right"
          ? "-100%, 0"
          : element.dataset.appear === "from-top"
          ? "0, -100%"
          : "0, 100%") +
        ")";

      const delay = element.dataset.appearDelay
        ? parseInt(element.dataset.appearDelay)
        : 0;

      setTimeout(() => {
        // Reset the position, thus making the illusion of something appearing in
        element.style.transition = `clip-path ${appearDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1), transform ${appearDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity ${appearDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
        element.style.transform = "translate(0, 0)";
        if (clipped) element.style.clipPath = `inset(0 0 0% 0)`;
        element.style.opacity = "1";
      }, delay * 100 + 250);
      // The delay value is an integer so it is multiplied to give the final value in milisecond
    }
  });
}

// Handling the auto sizing of vertical text
const titleColumn = document.getElementById("title-column");
const titleContainer = titleColumn.querySelector(".big-title-container");

function styleTitle() {
  let width = titleColumn.offsetWidth;
  titleContainer.style.height = width + "px";
}
styleTitle();
window.addEventListener("resize", styleTitle);

// Handle the wipe in transition of the screen
window.addEventListener("load", () => {
  if (document.body.classList.contains("appear-entry")) {
    // Use this value to make sure the transition check happens only once
    let doneEntryAnim = false;
    window.scrollTo(0, 0);
    let delay = parseInt(document.body.dataset.appearEntryDuration);

    setTimeout(() => {
      document.body.classList.add("appear-entry-loaded");
      document.body.addEventListener("transitionend", function (event) {
        if (event.target !== document.body) return;
        if (doneEntryAnim) return;

        // Enable scrolling when finishing animation
        document.body.style.overflowY = "auto";
        document.body.style.transform = "none";

        doneEntryAnim = true;
        createMoveInEffect();
      });
      createMoveInEffect();
    }, delay);
  } else {
    createMoveInEffect();
  }
});
window.addEventListener("scroll", createMoveInEffect);
window.addEventListener("resize", createMoveInEffect);

// Handling special transition between different pages within the site
let navigationLinks = [...document.querySelectorAll("[data-animated-href]")];

navigationLinks.forEach((el) => {
  el.addEventListener("click", (e) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    document.body.style.transform = "";
    document.body.style.overflow = "hidden";
    document.body.classList.remove("appear-entry-loaded");
    document.body.addEventListener("transitionend", function (event) {
      if (event.target !== document.body) return;
      window.location.href = el.dataset.animatedHref;
    });
  });
});

// Handling parallax effect
const stallElements = [...document.querySelectorAll(".stall")];
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", function () {
  const scrollY = window.scrollY;
  if (!document.body.classList.contains("appear-entry-loaded")) {
    window.scrollY = 0;
  }
  stallElements.forEach((el) => {
    const direction = el.dataset.moveTo ? el.dataset.moveTo : "none";
    const shiftRate = el.dataset.shiftRate ? el.dataset.shiftRate : "0";

    if (direction === "left")
      el.style.marginLeft = scrollY * parseFloat(shiftRate) + "px";
    if (direction === "right")
      el.style.marginRight = scrollY * parseFloat(shiftRate) + "px";

    if (el.dataset.floatTransform === "true") {
      el.style.transform = `translateY(-${
        scrollY * parseFloat(el.dataset.floatRate)
      }px)`;
    } else {
      el.style.marginBottom = scrollY * parseFloat(el.dataset.floatRate) + "px";
    }
  });

  if (backToTop) {
    if (scrollY > 410) {
      backToTop.classList.add("appeared");
    } else {
      backToTop.classList.remove("appeared");
    }
  }
});

if (backToTop)
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
