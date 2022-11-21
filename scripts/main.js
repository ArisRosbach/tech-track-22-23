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
	console.log("Grabbing new data...");

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

	// Checken of data klopt
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
			.attr("x", x)
			.attr("y", y)
			.attr("width", w)
			.attr("height", h)

			// Styling voor rect element
			.attr("opacity", 0.5)
			.style("stroke", "white")
			.style("stroke-width", 10)
			.style("fill", "url(#imgGebieden)")

		// Maakt voor elke item een foreignObject aan in de svg gevuld met html
		// foreignObject is zo grott als rect dus daar zal klikevent op worden toegepast
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("foreignObject")
			.attr("x", x + 5)
			.attr("y", y + 5)
			.attr("width", w - 10)
			.attr("height", h - 10)

			// Wanneer er wordt geklikt op foreignObject, wordt functie update() uitgevoerd
			// Geeft d mee wat staat voor de data die hoort bij geklikte item
			.on("click", (e) => {
				update(d);
				button(d);
			})

			// Tooltip verschijnt wanneer je over foreignObject hovert 
			// Geeft informatie over aantal attracties van gebied
			//-----------------------------------------------------------//
			.on("mouseover touchstart", (e) =>
				d3
				.select("#tooltip")
				.transition()
				.duration(500)
				.style("opacity", 1)
				.text(`${d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase()}: ${d[1]} attracties`)
			)
			// Tooltip op juiste positie zeten en laten meebewegen met de muis
			.on("mousemove", (e) =>
				d3
				.select("#tooltip")
				.style("left", e.pageX + 15 + "px")
				.style("top", e.pageY + 15 + "px")
			)
			// Tooltip verbergen wanneer je van rect af beweegt
			.on("mouseout", (e) => d3.select("#tooltip").style("opacity", 0))

			// Voegt html <p></p> toe aan de foreignOjbect
			.append("xhtml:p")
			.html(`${d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase()}`)
			.attr('class', 'textTreemap')

	});
}


// Functie die huidige treemap veranderd wanneer je op een item klikt
//-----------------------------------------------------------//
function update(data) {
	// Checken of data klopt met het blok die ik heb aangeklikt
	console.log(data);

	// Zorgen dat oude treemap niet meer te zien is
	d3.select("svg")
		.selectAll("rect")
		.attr("opacity", 0)

	d3.select("svg")
		.selectAll("foreignObject")
		.attr("opacity", 0)

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
						.attr("opacity", 0.5)
						.style("stroke", "white")
						.style("stroke-width", 10)
						.style("fill", (d) => {
							// returnt url pattern met data zonder spaties
							// Bron: https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
							// Credits: Laurens
							return `url(#${data[0].replace(/\s+/g, '')})`
						});
				},
				(exit) => {
					return exit.transition();
				}
			)


		// Maakt voor elke item een nieuw foreignObject aan in de svg
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("foreignObject")
			.attr("x", x + 5)
			.attr("y", y)
			.attr("width", w - 10)
			.attr("height", h - 15)

			// Tooltip verschijnt wanneer je over foreignObject hovert 
			// Geeft informatie over duur van de attractie
			//-----------------------------------------------------------//
			.on("mouseover touchstart", (e) =>
				d3
				.select("#tooltip")
				.transition()
				.duration(700)
				.style("opacity", 1)
				.text(`${d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase()}: ${d[1]} attracties`)
			)
			// Tooltip op juiste positie zeten en laten meebewegen met de muis
			.on("mousemove", (e) =>
				d3
				.select("#tooltip")
				.style("left", e.pageX + 15 + "px")
				.style("top", e.pageY + 15 + "px")
			)
			// Tooltip verbergen wanneer je van rect af beweegt
			.on("mouseout", e => d3.select("#tooltip").style("opacity", 0))

			.join(
				// Enter: <p></p> aanmaken met nieuwe data
				(enter) => {
					return enter.append("xhtml:p")
				},
				// Update: huidige <p></p> aanpassen met nieuwe data
				(update) => {
					return update.append("xhtml:p")
						.html(`${d[0]}`)
						.attr('class', 'textTreemap')
				},
				(exit) => {
					return exit.transition();
				}
			)
	});

}

