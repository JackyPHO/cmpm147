const fillers = {
  places: ["Disneyland", "New York City", "Paris", "Tokyo"],
  season: ["summer", "spring", "fall", "winter"],
  people: ["famiy", "significant other", "no one"],
  food: ["burritos", "burgers", "noodles", "sushi", "steak"], 
  stay: ["five star hotel", "beach house", "cabin", "dirty motel", "relative's home"],
  number: ["1","2","3","4","5"],
  
};

const template = `During the $season time,

you will spend a nice vacation at $places with $people for $number days. 

When the sun goes down, you will enjoy a nice dinner eating $food and spend the rest of the night at $stay.

Hope you enjoy your vacation!
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);
}

/* global clicker */
$("#clicker").click(generate);

generate();
