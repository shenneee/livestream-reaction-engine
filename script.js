// Find the elements in the HTML page.
const stage = document.getElementById("stage");
const sendButton = document.getElementById("send-button");
const reactionButtons = document.querySelectorAll(".reaction-button");
 
// Keep track of the currently selected emoji.
let selectedReaction = "❤️";
 
// When a reaction choice is clicked, update the selected emoji.
reactionButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedReaction = button.dataset.reaction;
    console.log("Selected reaction:", selectedReaction);
  });	
});
 
// When Send Reaction is clicked, create a floating reaction.
sendButton.addEventListener("click", function() {
  createReaction();
});
 
function createReaction() {
  // Create a new span element.
  const reaction = document.createElement("span");
 
  // Put the selected emoji inside it.
  reaction.textContent = selectedReaction;
 
  // Apply the CSS animation class.
  reaction.classList.add("floating-reaction");
 
  // Choose a random horizontal position within the stage.
  const randomPosition = Math.random() * 80 + 10;
  reaction.style.left = randomPosition + "%";
 
  // Insert the reaction into the stage.
  stage.appendChild(reaction);
 
  // Remove it after its CSS animation completes.
  reaction.addEventListener("animationend", function() {
    reaction.remove();
  }, { once: true });
}
