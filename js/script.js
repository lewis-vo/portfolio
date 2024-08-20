// FETCH AND RANDOMIZE ELEMENTS ON THE PAGE BASED ON MOUSE/DEVICE MOVEMENT

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.onload = () => {
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
};

const randomGroupLabels = [
  "backdrop-books",
  "logos",
  "bottoms-back",
  "tops-back",
  "shoesR-front",
  "shoesL-front",
  "shoesR-back",
  "shoesL-back",
  "bottoms-front",
  "tops-front",
  "heads",
  "boards-1",
  "boards-2",
];

const randomGroups = randomGroupLabels.map(label => getRandomGroup(label));

function getRandomGroup(label) {
  const elements = [...document.querySelectorAll(`[data-homepage-random-group="${label}"]`)];
  function tick() {
    let randomIndex = Math.floor(Math.random() * elements.length);
    elements.forEach((element, index) => {
      if (index === randomIndex) {
        elements[index].classList.remove("vitruvian-hidden");
        elements[index].classList.add("vitruvian-show");
        return;
      }
      elements[index].classList.add("vitruvian-hidden");
      elements[index].classList.remove("vitruvian-show");
    });
  }

  tick();

  return {
    tick: tick,
    elements: elements,
    label: label
  };
}

function movementEvaluator(tolerance, callback) {
  let startX, startY;
  let currentX, currentY;

  function handleMouseMove(event) {
    currentX = event.clientX;
    currentY = event.clientY;

    if (startX === undefined || startY === undefined) {
      startX = currentX;
      startY = currentY;
      return;
    }

    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance >= tolerance) {
      callback(distance, deltaX, deltaY);
      startX = undefined;
      startY = undefined;
    }
  }

  function handleDeviceMotion(event) {
    const rotationRate = event;
    if (!rotationRate) return; // Some devices might not support rotationRate

    currentX = rotationRate.alpha || 0;
    currentY = rotationRate.beta || 0;

    if (startX === undefined || startY === undefined) {
      startX = currentX;
      startY = currentY;
      return;
    }

    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance >= tolerance / 4) {
      callback(distance, deltaX, deltaY);
      startX = undefined;
      startY = undefined;
    }
  }
  window.addEventListener("deviceorientation", handleDeviceMotion);
  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("devicemotion", handleDeviceMotion);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}
/*
const removeListener = movementEvaluator(45, (distance, deltaX, deltaY) => {
  randomGroups.forEach(group => {
    if (group.label===randomGroupLabels[0]) {
      if (Math.random() >= 0.4) group.tick();
      return;
    }
    if (Math.random() >= 0.66) group.tick();
  });
  //console.log("Moved", distance, "units:", deltaX, "x", deltaY, "y");
  //document.body.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
});
*/

if (typeof DeviceOrientationEvent.requestPermission === "function") {
  let click = false;
  document.body.addEventListener("click", () => {
    if (!click) {
      DeviceOrientationEvent.requestPermission();
      click = true;
    }
  });
}



const shuffleString = (str, replaceChance, replacementChars) => {
  return str
    .split("")
    .map((char) => {
      return Math.random() < replaceChance
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
    const originalText = element.textContent;

    element.addEventListener("mouseover", () => {
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
    });
  });
}
shuffleTextOnHover();



const appearDuration = 1100;

function checkIfElementInViewport(element) {
  const boundingRect = element.getBoundingClientRect();
  return (
    boundingRect.top >= 0 &&
    boundingRect.left >= 0 &&
    boundingRect.bottom <= window.innerHeight &&
    boundingRect.right <= window.innerWidth
  );
}

function createMoveInEffect() {
  const elements = document.querySelectorAll("[data-appear]");

  elements.forEach((element) => {
    if (element.dataset.animated) return;
    const clipped = element.dataset.appearClipped === "true";
    const forceOnLoad = element.dataset.appearOnLoad === "true";
    if (clipped) {
      element.style.clipPath = `inset(0 0 100% 0)`;
    } else {
      element.style.opacity = "0";
    }
    if (checkIfElementInViewport(element) || forceOnLoad === true) {
      element.dataset.animated = true;
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
        element.style.transition = `clip-path ${appearDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1), transform ${appearDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity ${appearDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
        element.style.transform = "translate(0, 0)";
        element.style.clipPath = `inset(0 0 0% 0)`;
        element.style.opacity = "1";
      }, delay * 100 + 250);
    }
  });
}
function updateAppearElements() {
  const elements = document.querySelectorAll("[data-appear]");
  elements.forEach((element) => {
    if (checkIfElementInViewport(element)) {
      createMoveInEffect(element);
    }
  });
}

window.addEventListener("load", () => {
  if (document.body.classList.contains("appear-entry")) {
    let doneAnim = false;
    window.scrollTo(0, 0);
    let delay = parseInt(document.body.dataset.appearEntryDuration);
    setTimeout(() => {
      document.body.classList.add("appear-entry-loaded");
      document.body.addEventListener('transitionend', function(event) {
        if (event.target !== document.body) return;
        if (doneAnim) return;

        document.body.style.overflowY = "auto";
        document.body.style.transform = "none";

        doneAnim = true;
      });
      createMoveInEffect();
    }, delay);
  } else {
    createMoveInEffect();
  }
});
window.addEventListener("scroll", updateAppearElements);
window.addEventListener("resize", updateAppearElements);

const titleColumn = document.getElementById("title-column");
const titleContainer = titleColumn.querySelector(".big-title-container");

function styleTitle() {
  let width = titleColumn.offsetWidth;
  titleContainer.style.height = width + "px";
}

styleTitle();
window.addEventListener("resize", styleTitle);

let navigationLinks = [...document.querySelectorAll("[data-animated-href]")];

navigationLinks.forEach(el => {
  el.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    document.body.style.transform = "";
    document.body.style.overflow = "hidden";
    document.body.classList.remove("appear-entry-loaded");
    document.body.addEventListener('transitionend', function(event) {
      if (event.target !== document.body) return;
      window.location.href = el.dataset.animatedHref;
    });
  });
});


const spinningFan = document.getElementById("spinning-fan");
const floatings = [...document.querySelectorAll(".stall")];
const backToTop = document.getElementById("back-to-top");

window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  if (!document.body.classList.contains("appear-entry-loaded")) {
    window.scrollY = 0;
  }
  floatings.forEach(el => {
    const direction = (el.dataset.moveTo) ? el.dataset.moveTo : "none";

    if (direction === "left") el.style.marginLeft = (scrollY * parseFloat(el.dataset.floatRate)) + 'px';
    if (direction === "right") el.style.marginRight = (scrollY * parseFloat(el.dataset.floatRate)) + 'px';

    if (el.dataset.floatTransform === "true") {
      el.style.transform = `translateY(-${scrollY * parseFloat(el.dataset.floatRate)}px)`;
    } else {
      el.style.marginBottom = scrollY * parseFloat(el.dataset.floatRate) + 'px';
    }
  });
  if (spinningFan) spinningFan.style.setProperty('--rotation', scrollY/4 + 'deg');
  if (backToTop) {
    if (scrollY > 410) {
      backToTop.classList.add("appeared");
    } else {
      backToTop.classList.remove("appeared");
    }
  } 
});

if (backToTop) backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});