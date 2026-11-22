
// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const stage = document.getElementById("stage");
const sendButton = document.getElementById("send-button");

const reactionButtons = document.querySelectorAll(".reaction-button");

const modeSelect = document.getElementById("mode-select");
const speedSlider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");


// ========================================
// 2. STORE APPLICATION DATA
// ========================================

let selectedReaction = "❤️";

// Current GSAP animation speed
let currentSpeed = 1.0;

// Store all currently active GSAP timelines
const activeTimelines = new Set();


// ========================================
// 3. REACTION SELECTION
// ========================================

reactionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedReaction = button.dataset.reaction;

        console.log("Selected reaction:", selectedReaction);

    });

});


// ========================================
// 4. SEND REACTION BUTTON
// ========================================

sendButton.addEventListener("click", function() {

    if (modeSelect.value === "css") {

        createCssReaction();

    } else {

        createGsapReaction();

    }

});


// ========================================
// 5. PHASE 1 - CSS ANIMATION
// ========================================

function createCssReaction() {

    const reaction = document.createElement("span");

    reaction.textContent = selectedReaction;

    reaction.classList.add("floating-reaction");

    const randomPosition = Math.random() * 80 + 10;

    reaction.style.left = randomPosition + "%";

    stage.appendChild(reaction);

    reaction.addEventListener("animationend", function() {

        reaction.remove();

    }, { once: true });

}


// ========================================
// 6. PHASE 2 - GSAP ANIMATION
// ========================================

function createGsapReaction() {

    // Create a new reaction element
    const reaction = document.createElement("span");

    reaction.textContent = selectedReaction;

    reaction.classList.add("gsap-reaction");

    // Generate random starting and sway positions
    const startX = Math.random() * (stage.clientWidth - 40);

    const sway = (Math.random() - 0.5) * 100;

    // Add reaction to the stage
    stage.appendChild(reaction);

    // Set its initial position and appearance
    gsap.set(reaction, {

        x: startX,
        y: stage.clientHeight + 20,

        scale: 1,
        opacity: 1

    });


    // Create a GSAP timeline
    const timeline = gsap.timeline({

        onComplete: function() {

            // Remove completed timeline from active collection
            activeTimelines.delete(timeline);

            // Remove completed reaction from the DOM
            reaction.remove();

        }

    });


    // Animate upward movement, horizontal sway,
    // scaling and fading using GSAP.

    // Continuous upward movement, scaling and fading
    timeline.to(reaction, {
        y: -50,
        scale: 1.3,
        opacity: 0,
        duration: 3,
        ease: "none"
    }, 0);

    // Horizontal swaying while moving upwards
    timeline.to(reaction, {
        x: startX + sway,
        duration: 0.75,
        ease: "sine.inOut",
        repeat: 3,
        yoyo: true
    }, 0);


    // Apply the current playback speed
    timeline.timeScale(currentSpeed);

    // Keep track of this active timeline
    activeTimelines.add(timeline);

}


// ========================================
// 7. GSAP SPEED SLIDER
// ========================================

speedSlider.addEventListener("input", function() {

    // Read the slider value
    currentSpeed = Number(speedSlider.value);

    // Update the displayed speed
    speedValue.textContent = currentSpeed.toFixed(1) + "x";


    // Update every currently active GSAP animation
    activeTimelines.forEach(function(timeline) {

        timeline.timeScale(currentSpeed);

    });

});

function updateControls() {
  if (modeSelect.value === "css") {
    speedSlider.disabled = true;
    speedSlider.parentElement.style.display = "none";
  } else {
    speedSlider.disabled = false;
    speedSlider.parentElement.style.display = "flex";
  }
}

modeSelect.addEventListener("change", updateControls);

updateControls();