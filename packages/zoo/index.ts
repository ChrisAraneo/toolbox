import { getRandomAnimal } from "@chris.araneo/animals";
import { getRandomName } from "@chris.araneo/names";

const name = getRandomName();
const animal = getRandomAnimal();

console.log(`${name} the ${animal.name} says ${animal.sound}!`);
