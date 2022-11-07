// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.css'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';

console.log('Hello, world!');

// Duur van disneyland attracties weergeven in barchart
///////////////////////////////////////
function getData() {
	console.log('Grabbing new userdata...');

	fetch('https://opensheet.elk.sh/1JTKk5zpB87MaeZzYJUnTSX2IsuHyLa8JF_l79Svn9P4/DisneylandParis')
		.then(res => res.json())
		.then(data => {


				console.log(data);

				const chartWidth = 1000
				const chartHeight = 1000

				const xScale = d3.scaleLinear()
					.domain([0, d3.max(data, d => d.Duur)])
					.range([0, chartWidth]);

				const yScale = d3.scaleBand()
					.domain(d3.map(data, d => d.Naam))
					.range([0, chartHeight])
					.paddingInner(0.05);

				d3.select('#bars')
					.selectAll('rect')
					.data(data)
					.join('rect')
					.attr('height', 20) //yScale.bandwith())
					.attr('width', d => xScale(d.Duur))
					.attr('y', d => yScale(d.Naam))
					.classed('animate __animated animate__headShake', 1)
				//, () => Math.random() > 0.5
				d3.select('#labels')
					.selectAll('text')
					.data(data)
					.join('text')
					.attr('y', d => yScale(d.Naam) + 15)
					.text(d => d.Naam);
				})

			}

			getData();

// Aardbeving dataset met d3 in barchart weergeven
///////////////////////////////////////
// const dataSet = [{"Jaar":1991,"Aantal":1},{"Jaar":1992,"Aantal":0},{"Jaar":1993,"Aantal":4},{"Jaar":1994,"Aantal":7},{"Jaar":1995,"Aantal":4},{"Jaar":1996,"Aantal":8},{"Jaar":1997,"Aantal":7},{"Jaar":1998,"Aantal":6},{"Jaar":1999,"Aantal":5},{"Jaar":2000,"Aantal":8},{"Jaar":2001,"Aantal":2},{"Jaar":2002,"Aantal":4},{"Jaar":2003,"Aantal":14},{"Jaar":2004,"Aantal":6},{"Jaar":2005,"Aantal":11},{"Jaar":2006,"Aantal":21},{"Jaar":2007,"Aantal":12},{"Jaar":2008,"Aantal":11},{"Jaar":2009,"Aantal":18},{"Jaar":2010,"Aantal":16},{"Jaar":2011,"Aantal":29},{"Jaar":2012,"Aantal":20},{"Jaar":2013,"Aantal":30},{"Jaar":2014,"Aantal":20},{"Jaar":2015,"Aantal":23},{"Jaar":2016,"Aantal":13},{"Jaar":2017,"Aantal":18},{"Jaar":2018,"Aantal":15},{"Jaar":2019,"Aantal":11},{"Jaar":2020,"Aantal":17}]

// const chartWidth = 700
// const chartHeight = 800

// const xScale = d3.scaleLinear()
// 	.domain([0, d3.max(dataSet, d => d.Aantal)])
// 	.range([0, chartWidth]);

// const yScale = d3.scaleBand()
// 	.domain(d3.map(dataSet, d => d.Jaar))
// 	.range([0, chartHeight])
//   .paddingInner(0.05);

// d3.select('#bars')
//   .selectAll('rect')
//   .data(dataSet)
//   .join('rect')
//   .attr('height', 25) //yScale.bandwith())
//   .attr('width', d => xScale(d.Aantal))
//   .attr('y', d => yScale(d.Jaar))
//   .classed('animate __animated animate__headShake',1)
// //, () => Math.random() > 0.5
// d3.select('#labels')
//   .selectAll('text')
//   .data(dataSet)
//   .join('text')
//   .attr('y', d => yScale(d.Jaar) + 15)
//   .text(d => d.Jaar);


// Disneypark data weergeven in tabel
///////////////////////////////////////
// function getData() {
// 	console.log('Grabbing new userdata...');

// 	fetch('https://opensheet.elk.sh/1JTKk5zpB87MaeZzYJUnTSX2IsuHyLa8JF_l79Svn9P4/DisneylandParis')
// 		.then(res => res.json())
// 		.then(data => {

// 			console.log(data);

// 			function generateTable() {

// 				// There are a couple steps we need to take, first, we need to select the table, table heading and table body and save them to a variable

// 				let table = document.querySelector('table');
// 				let tHeading = document.querySelector('thead tr');
// 				let tBody = document.querySelector('tbody');

// 				// First, we'll generate a row of table headings, we need to grab the keys from all the objects, not the values! We can achieve this by using the Object.keys(data[0]) method of the native Object. 
// 				// It returns an array of all keys an object contains. We can loop over that array using forEach(); It's up to you to find out how then to generate the corresponding HTML.

// 				Object.keys(data[0]).forEach(key => {

// 					let newElement = document.createElement('th');
// 					newElement.textContent = key;
// 					tHeading.appendChild(newElement);

// 				})

// 				// Your HTML should now display the headers in a <th></th> structure.

// 				//After this, we can loop over the amount of objects inside of the array (looping over an array of objects can be useful here, for...of). 
// 				// For every entry (forEach()) we want to create a new row (<tr>/tr>) and append three datapoints (<td>) inside of it containing the id, name and kaas.

// 				data.forEach(obj => {

// 					let tr = document.createElement('tr');
// 					tBody.appendChild(tr);

// 					for (const [key, value] of Object.entries(obj)) {

// 						let td = document.createElement('td');
// 						td.textContent = value;
// 						tr.appendChild(td);
// 					}
// 				})

// 			}

// 			generateTable();

// 		})

// }

// getData();