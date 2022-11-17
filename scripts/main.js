// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.css'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';

console.log('Hello, world!');

// Global const genaamd theData
let theData;
// Functie die mijn API data ophaalt
//-----------------------------------------------------------//
function getData() {
	console.log("Grabbing new userdata...");

	// Met fetch haal ik de mijn API op, dit wordt omgezet naar een response object.
	// Met .json() zet ik de data om in een JSON tekst bestand
	fetch(
			"https://opensheet.elk.sh/1JTKk5zpB87MaeZzYJUnTSX2IsuHyLa8JF_l79Svn9P4/DisneylandParis"
		)
		.then((res) => res.json())
		.then((data) => {
			// theData wordt gevuld met de data van mijn API
			theData = data;


			// Berekent het aantal attracties in elk Gebied
			//-----------------------------------------------------------//
			makeGraph1(d3.rollups(data, v => d3.count(v, d => d.Duur), d => d.Gebied.toLowerCase()));

		});
}

getData();


// Functie die zorgt dat ik een treemap kan maken van Gebieden 
// disneyData is de data die hierboven wordt gedefinieerd in makeGraph1
//-----------------------------------------------------------//
function makeGraph1(disneyData) {

	console.log(disneyData);

	// Code die een treemap maakt:
	// Bron code: https://stackoverflow.com/questions/67155151/using-d3-js-to-create-a-simple-treemap
	//-----------------------------------------------------------//

	// Sorteert de getallen in de array dankzij de [1]
	const data = disneyData.sort((a, b) => b[1] - a[1]);
	// Telt het totaal van alle getallen in de verschillende arrays
	const sum = data.reduce((s, i) => {
		return s + i[1]
	}, 0);

	// Checken of data en sum kloppen
	console.log(data);
	console.log(sum)

	// Constanten
	const svg = d3.select("svg");
	const width = parseInt(svg.attr("width"));
	const height = parseInt(svg.attr("height"));
	const bounds = {
		top: 0,
		left: 0,
		right: width,
		bottom: height
	};

	let weightLeft = sum;
	let x, y, w, h;

	// Loopt door alle array's met data om zo te berekenen hoe de treemap eruit moet komen te zien
	//-----------------------------------------------------------//
	data.forEach((d) => {
		console.log(d);
		const hSpace = bounds.right - bounds.left;
		const vSpace = bounds.bottom - bounds.top;
		x = bounds.left;
		y = bounds.top;
		if (hSpace > vSpace) {
			w = (d[1] / weightLeft) * hSpace;
			h = vSpace;
			bounds.left = x + w;
		} else {
			w = hSpace;
			h = (d[1] / weightLeft) * vSpace;
			bounds.top = y + h;
		}
		weightLeft -= d[1];


		// Maakt voor elke item een rectangle aan in de svg
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("rect")
			// Wanneer er wordt geklikt op een item, wordt functie update() uitgevoerd
			// Geeft d mee wat staat voor de data die hoort bij geklikte item
			.on("click", (e) => {
				update(d);
			})
			.attr("x", x)
			.attr("y", y)
			.attr("width", w)
			.attr("height", h)
			// Styling voor rect element
			.style("stroke", "white")
			.style("stroke-width", 10)
			.style("fill", "url(#imgGebieden)")


		// Maakt voor elke item een text aan in de svg
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("text")
			// Geeft mee dat de text het 1e item uit de array moet zijn
			.text(d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase())
			.attr("x", x + w / 2)
			.attr("y", y + h / 2)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			// Styling voor text element
			.style("fill", "Black")
			.style("font-size", "0.8em")
			.style("font-weight", "bold");
	});
}



// Functie die huidige treemap veranderd wanneer je op een item klikt
//-----------------------------------------------------------//
function update(data) {
	// Checken of data klopt met het blok die ik heb aangeklikt
	console.log(data);

	let aantalAttracties = [];
	let aantalRest = 0;
	// Array maken met aantal attracties van geklikt item
	theData.forEach((item) => {
		if (item.Gebied.toLowerCase() == data[0]) {
			aantalAttracties.push([item.Naam, parseInt(item.Duur)]);
		} else {
			aantalRest++;
		}
	});


	// Sorteert de nieuwe getallen in de array dankzij de [1]
	const data2 = aantalAttracties.sort((a, b) => b[1] - a[1]);
	// Telt het totaal van alle nieuwe getallen in de verschillende arrays
	const sum = data2.reduce((s, i) => {
		return s + i[1]
	}, 0);

	// Checken of nieuwe data en sum kloppen
	console.log(data2);
	console.log(sum)

	// Constanten
	const svg = d3.select("svg");
	const width = parseInt(svg.attr("width"));
	const height = parseInt(svg.attr("height"));
	const bounds = {
		top: 0,
		left: 0,
		right: width,
		bottom: height
	};

	let weightLeft = sum;
	let x, y, w, h;

	// Loopt door alle array's van de nieuwe data om zo te berekenen hoe de nieuwe treemap eruit moet komen te zien
	//-----------------------------------------------------------//
	data2.forEach((d) => {
		console.log(d);
		const hSpace = bounds.right - bounds.left;
		const vSpace = bounds.bottom - bounds.top;
		x = bounds.left;
		y = bounds.top;
		if (hSpace > vSpace) {
			w = (d[1] / weightLeft) * hSpace;
			h = vSpace;
			bounds.left = x + w;
		} else {
			w = hSpace;
			h = (d[1] / weightLeft) * vSpace;
			bounds.top = y + h;
		}
		weightLeft -= d[1];

		console.log("kaas: " + d)
		// Maakt voor elke item een rectangle aan in de svg
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("rect")
			.join(
				// Enter: rectangles aanmaken met nieuwe data
				(enter) => {
					return enter.append("rect")
				},
				// Update: huidige rectangangles aanpassen voor nieuwe data
				(update) => {
					return update
						.attr("x", x)
						.attr("y", y)
						.attr("width", w)
						.attr("height", h)
						// Styling voor rect element
						.style("stroke", "white")
						.style("stroke-width", 10)
						.style("fill", (d) => {
							if(data[0] == "fantasyland") {
								return "url(#imgFantasyland)";
							} else if(data[0] == "discoveryland") {
								return "url(#imgDiscoveryland)";
							} else if(data[0] == "worlds of pixar") {
								return "url(#imgPixar)";
							} else if(data[0] == "adventureland") {
								return "url(#imgAdventureland)";
							} else if(data[0] == "frontierland") {
								return "url(#imgFrontierland)";
							} else if(data[0] == "avengers campus") {
								return "url(#imgAvengers)";
							} else if(data[0] == "main street u.s.a.") {
								return "url(#imgMainStreet)";
							} else if(data[0] == "toon studio") {
								return "url(#imgToonStudio)";
							} else if(data[0] == "production courtyard") {
								return "url(#imgCourtyard)";
							}
						});
				},
				(exit) => {
					return exit.transition();
				}
			)


		// Maakt voor elke item een text aan in de svg
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("text")
			.join(
				// Enter: tekst aanmaken met nieuwe data
				(enter) => {
					return enter.append("text")
				},
				// Update: huidige tekst aanpassen voor nieuwe data
				(update) => {
					return update.text(d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase())
						.attr("x", x + w / 2)
						.attr("y", y + h / 2)
						.attr("text-anchor", "middle")
						.attr("alignment-baseline", "middle")
						// Styling voor text element
						.style("fill", "Black")
						.style("font-size", "0.8em")
						.style("font-weight", "bold");
				},
				(exit) => {
					return exit.transition();
				}
			)
	});

}