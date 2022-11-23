// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.css'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';


// Global const genaamd theData
let theData;

// Functie die mijn API data ophaalt
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function getData() {
	console.log("Grabbing new data...");

	// API ophalen met fetch, omzetten naar een response object
	// Met .json() dat omzetten in JSON tekst bestand
	fetch(
			"https://opensheet.elk.sh/1JTKk5zpB87MaeZzYJUnTSX2IsuHyLa8JF_l79Svn9P4/DisneylandParis"
		)
		.then((res) => res.json())
		.then((data) => {
			// theData wordt gevuld met de data van de API
			theData = data;


			// Berekent het aantal attracties in elk Gebied
			//-----------------------------------------------------------//
			makeGraph1(d3.rollups(data, v => d3.count(v, d => d.Duur), d => d.Gebied.toLowerCase()));

		});
}

getData();


// Functie die treemap maakt de gebieden in Disneyland Paris
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function makeGraph1(disneyData) {

	// disneyData is de data die gedefinieerd in makeGraph1
	console.log(disneyData);

	// Voordat treemap wordt gemaakt, alles van daarvoor verwijderen
	d3.select("svg")
		.selectAll("rect").remove()

	d3.select("svg")
		.selectAll("foreignObject").remove()

	// Button op niet zichtbaar zetten
	d3.select("#buttonTreemap")
		.style("opacity", 0)


	// Treemap berekenen en maken
	// Bron code: https://stackoverflow.com/questions/67155151/using-d3-js-to-create-a-simple-treemap
	//-----------------------------------------------------------//
	//-----------------------------------------------------------//

	// Sorteert de aantal attracties per gebied
	const data = disneyData.sort((a, b) => b[1] - a[1]);
	// Telt het totaal van alle aantal attracties
	const sum = data.reduce((s, i) => {
		return s + i[1]
	}, 0);

	// Checken of data en sum kloppen
	console.log(data);
	console.log(sum)

	// Constanten voor treemap
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

	// Loopt door alle array's met data om te berekenen hoe de treemap eruit komt te zien
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
		// foreignObject staat over de rect dus daar worden events op toegepast
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
			.on("mouseover touchstart", (e) =>
				d3
				.select("#tooltip")
				.transition()
				.duration(200)
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


			// Voegt tekst toe met xhtml:p in de foreignOjbect
			.append("xhtml:p")
			.html(`${d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase()}`)
			.attr('class', 'textTreemap')

	});
}

// Functie die nieuwe treemap op basis van de data van geklikt item
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function update(data) {
	// Checken of data klopt met het blok die ik heb aangeklikt
	console.log(data);

	// Voordat nieuwe treemap wordt gemaakt, alles van daarvoor verwijderen
	d3.select("svg")
		.selectAll("rect").remove()

	d3.select("svg")
		.selectAll("foreignObject").remove()

	// Array maken met attracties in aangeklikt gebied
	let aantalAttracties = [];
	let aantalRest = 0;
	// loopt door items van theData heen, wanneer gebied overeenkomt attractie in array pushen
	theData.forEach((item) => {
		if (item.Gebied.toLowerCase() == data[0]) {
			aantalAttracties.push([item.Naam, parseInt(item.Duur)]);
		} else {
			aantalRest++;
		}
	});


	// Nieuwe treemap berekenen en maken
	//-----------------------------------------------------------//
	//-----------------------------------------------------------//
	const data2 = aantalAttracties.sort((a, b) => b[1] - a[1]);
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

	// Loopt door alle nieuwe array's om te berekenen hoe de nieuwe treemap eruit komt te zien
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

		// Maakt voor elk nieuwe item een rectangle aan in de svg
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
						// Returnt url pattern met data zonder spaties
						// Credits: Laurens
						.style("fill", (d) => {
							return `url(#${data[0].replace(/\s+/g, '')})`
						});
				}
			)


		// Maakt voor elk nieuwe item een foreignObject aan in de svg gevuld met html
		//-----------------------------------------------------------//
		d3.select("svg")
			.append("foreignObject")
			.attr("x", x + 5)
			.attr("y", y)
			.attr("width", w - 10)
			.attr("height", h - 15)

			.on("click", (e) => {
				info(d);
			})

			// Tooltip verschijnt wanneer je over nieuwe foreignObject hovert
			.on("mouseover touchstart", (e) =>
				d3
				.select("#tooltip")
				.transition()
				.duration(200)
				.style("opacity", 1)
				.text(`${d[0]}, Duur: ${d[1]} minuten`)
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

			// ForeignObject vullen met nieuwe data
			.join(
				// Enter: nieuwe <p></p> aanmaken
				(enter) => {
					return enter.append("xhtml:p")
				},
				// Update: huidige <p></p> aanpassen met nieuwe data
				(update) => {
					return update.append("xhtml:p")
						.html(`${d[0]}`)
						.attr('class', 'textTreemap')
				}
			)
	});

}


// Functie die button laat verschijnen en werken
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function button(data) {

	d3.select("#buttonTreemap")
		.style("opacity", 1)
		// Wanneer er wordt geklikt op de button, wordt functie makeGraph1() uitgevoerd
		// Geeft rollups mee die opnieuw berekend hoeveel attracties er zijn in elk gebied
		.on("click", (e) => {
			makeGraph1(d3.rollups(theData, v => d3.count(v, d => d.Duur), d => d.Gebied.toLowerCase()));
			deleteInfo();
		})

}


// Functie die info over geklikte attractie laat verschijnen
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function info(data) {
	// Checken of data klopt met het blok die ik heb aangeklikt
	console.log(data);

	// Array maken van attractie info die overeenkomt met aangeklikte attractie
	let infoAttracties = [];
	let aantalRest = 0;
	// Loopt door items van theData heen, wanneer naam overeenkomt info in de array pushen
	theData.forEach((item) => {
		if (item.Naam == data[0]) {
			infoAttracties.push([item.Naam, item.Park, item.Categorie, item.Type, parseInt(item.Duur), item.Gebied]);
		} else {
			aantalRest++;
		}
	});

	// variabelen die elementen uit de html selecteren
	var attractieInfo = document.getElementById("attractieInfo");
	var attractieNaam = document.getElementById("attractieNaam");

	// Veranderd tekst naar de naam van de aangeklikte attractie
	attractieNaam.textContent = infoAttracties[0][0]

	// Veranderd HTML naar de informatie van de aangeklikte attractie
	attractieInfo.innerHTML =
		`<p>Naam: ${infoAttracties[0][0]} </p>
	<p>Park: ${infoAttracties[0][1]} </p>
	<p>Categorie: ${infoAttracties[0][2]} </p>
	<p>Type: ${infoAttracties[0][3]} </p>
	<p>Duur: ${infoAttracties[0][4]} minuten</p>
	<p>Gebied: ${infoAttracties[0][5]} </p>`;
}


// Functie die info over geklikte attractie verwijderd
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function deleteInfo() {
	// variabelen die elementen uit de html selecteren
	var attractieInfo = document.getElementById("attractieInfo");
	var attractieNaam = document.getElementById("attractieNaam");

	// Veranderd de tekst terug naar beginstaat
	attractieNaam.textContent = `Hoe het werkt`

	// Veranderd de HTML terug naar beginstaat
	attractieInfo.innerHTML = `<p>Hiernaast zie je een treemap die alle gebieden van Disneyland Paris bevat. Klik om meer te weten! </p>`;
}