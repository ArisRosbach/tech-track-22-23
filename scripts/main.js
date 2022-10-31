// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.css'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';

console.log('Hello, world!');

/* Assume we have a non-normalized dataset to start with */

const data = [
	{
		id: 1,
		name: 'ROBERT',
		kaas: false,
		coords: {
			lat: "52.3676",
			long: "4.9041"
		}
	},
	{
		id: "2",
		name: 'viNcent',
		kaas: "true",
		coords: {
			lat: "52.3676",
			long: "4.9041"
		}
	},
	{
		id: 3,
		name: 'laura',
		kaas: true,
		coords: {
			lat: "52.3676",
			long: "4.9041"
		}
	},
]

// This assignment builds on the earlier assignment we did today. Create a table containing the above dataset, this time though, the dataset is a bit scuffed.
// We need to normalize the data by addressing the following issues:
// 1) The id is not always a number, convert it to an integer / number first.
// 2) The name isn't normalized, random capitals appear. Change this string in a first letter capital and lowercase after that
// 3) "kaas" is not always a boolean. Convert it to a string so we can print it in HTML
// 4) "coords" is an object. If you try and print this, you'll get [object Object] or something.
//We'll have to loop over the object and print a custom string using template literals.

function transformArrOfObj() {
  
  let newData = data.map(item => {
    
    return {
      id: parseInt(item.id),
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      kaas: String(item.kaas),
      coords: item.coords.lat + " <br> " + item.coords.long
    }
  })
  
  console.log(newData);
}

function generateTable() {
// Continue using the code from thursday-1
  let table = document.querySelector('table');
  let tHeading = document.querySelector('thead tr');
  let tBody = document.querySelector('tbody');
  
  
// Volgensmij is dit niet de manier maar het werkt
  let newData = data.map(item => {
    
    return {
      id: parseInt(item.id),
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
      kaas: String(item.kaas),
      coords: item.coords.lat + " <br> " + item.coords.long
    }
  })
  
  
  Object.keys(newData[0]).forEach(key => {
      
      let newElement = document.createElement('th');
      newElement.textContent = key;
      tHeading.appendChild(newElement);
      
    })
  
  newData.forEach(obj => {
    
    let tr = document.createElement('tr');
    tBody.appendChild(tr);
    
    for (const [key, value] of Object.entries(obj)) {
      
      let td = document.createElement('td');
      td.innerHTML = value;
      tr.appendChild(td);
    }
  })
}

transformArrOfObj()
generateTable()