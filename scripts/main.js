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


// Functie die treemap maakt van de gebieden in Disneyland Paris
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function makeGraph1(disneyData) {
	// disneyData is de data die gedefinieerd in makeGraph1
	console.log(disneyData);

	clearTreemap();

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
			.transition()
			.duration(500)

			// Styling voor rect element
			.attr("opacity", 0.5)
			.style("stroke", "white")
			.style("stroke-width", "0.5em")

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
			.on("click", () => {
				update(d);
				button(d);
			})

			// Tooltip verschijnt wanneer je over foreignObject hovert 
			// Geeft informatie over aantal attracties van gebied
			.on("mouseover touchstart", () =>
				d3.select("#tooltip")
				.transition()
				.duration(200)
				.style("opacity", 1)
				.text(`${d[0].charAt(0).toUpperCase() + d[0].slice(1).toLowerCase()}: ${d[1]} attracties`)
			)
			// Tooltip op juiste positie zeten en laten meebewegen met de muis
			.on("mousemove", (e) =>
				d3.select("#tooltip")
				.style("left", e.pageX + 15 + "px")
				.style("top", e.pageY + 15 + "px")
			)
			// Tooltip verbergen wanneer je van rect af beweegt
			.on("mouseout", () => d3.select("#tooltip").style("opacity", 0))


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

	clearTreemap();

	// Array maken met attracties in aangeklikt gebied
	let aantalAttracties = [];
	// loopt door items van theData heen, wanneer gebied overeenkomt attractie in array pushen
	theData.forEach((item) => {
		if (item.Gebied.toLowerCase() == data[0]) {
			aantalAttracties.push([item.Naam, parseInt(item.Duur)]);
		} else {
			false
		}
	});


	// Nieuwe treemap berekenen en maken
	//-----------------------------------------------------------//
	//-----------------------------------------------------------//
	const data2 = aantalAttracties.sort((a, b) => b[1] - a[1]);
	const sum = data2.reduce((s, i) => {
		return s + i[1]
	}, 0);

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
				enter => enter.append("rect"),
				// Update: huidige rectangangles aanpassen voor nieuwe data
				(update) => {
					return update
						.attr("x", x)
						.attr("y", y)
						.attr("width", w)
						.attr("height", h)
						.transition()
						.duration(500)

						// Styling voor rect element
						.attr("opacity", 0.5)
						.style("stroke", "white")
						.style("stroke-width", "0.5em")
						// Returnt url pattern met data zonder spaties
						// Credits: Laurens
						.style("fill", () => {
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
			.attr("height", h - 5)

			.on("click", () => info(d))

			// Tooltip verschijnt wanneer je over nieuwe foreignObject hovert
			.on("mouseover touchstart", () =>
				d3.select("#tooltip")
				.transition()
				.duration(200)
				.style("opacity", 1)
				.text(`${d[0]}, Duur: ${d[1]} minuten`)
			)
			// Tooltip op juiste positie zeten en laten meebewegen met de muis
			.on("mousemove", (e) =>
				d3.select("#tooltip")
				.style("left", e.pageX + 15 + "px")
				.style("top", e.pageY + 15 + "px")
			)
			// Tooltip verbergen wanneer je van rect af beweegt
			.on("mouseout", () => d3.select("#tooltip").style("opacity", 0))

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


// Functie die treemap eerst helemaal leeghaalt
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function clearTreemap() {
	d3.select("svg")
		.selectAll("rect").remove()

	d3.select("svg")
		.selectAll("foreignObject").remove()
}


// Functie die button laat verschijnen en werken
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function button() {

	d3.select("#buttonTreemap")
		.style("opacity", 1)
		// Wanneer er wordt geklikt op de button, wordt functie makeGraph1() uitgevoerd
		// Geeft rollups mee die opnieuw berekend hoeveel attracties er zijn in elk gebied
		.on("click", () => {
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

	// Filter maakt een kopie van array met alleen item die overeen komt met data[0]
	const infoAttractiesArray = theData.filter(item => {
		return item.Naam == data[0];
	});

	// Bron: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
	// Geeft alleen opgegeven properties van object terug
	const infoAttractieObject = (({Park, Categorie, Type, Duur, Gebied}) => 
	({Park, Categorie, Type, Duur, Gebied}))(infoAttractiesArray[0]);

	// Variabelen die elementen uit de html selecteren
	const attractieInfo = document.getElementById("attractieInfo");
	const attractieNaam = document.getElementById("attractieNaam");

	// Veranderd tekst naar de naam van de aangeklikte attractie
	attractieNaam.textContent = infoAttractiesArray[0].Naam

	// Veranderd tekst in infoblock met informatie van geklikte attractie
	attractieInfo.innerHTML = '';
	Object.keys(infoAttractieObject).forEach(item => {
		if (item == "Duur") {
			attractieInfo.insertAdjacentHTML('beforeend', `<p>${item}: ${infoAttractieObject[item]} min</p>`);
		} else {
			attractieInfo.insertAdjacentHTML('beforeend', `<p>${item}: ${infoAttractieObject[item]}</p>`);
		}
	})
}


// Functie die info over geklikte attractie verwijderd
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
function deleteInfo() {
	// Variabelen die elementen uit de html selecteren
	const attractieInfo = document.getElementById("attractieInfo");
	const attractieNaam = document.getElementById("attractieNaam");

	// Veranderd de tekst terug naar beginstaat
	attractieNaam.textContent = `Hoe het werkt`

	// Veranderd de HTML terug naar beginstaat
	attractieInfo.innerHTML = `<p>Hiernaast zie je een treemap die alle gebieden van Disneyland Paris bevat.</p>
	<p>Klik om erachter te komen welke attracties je kunt vinden in elk gebied.</p>
	<p>Wil je meer weten van de attractie zelf, dan kun je ook daarop klikken.</p>`;
}