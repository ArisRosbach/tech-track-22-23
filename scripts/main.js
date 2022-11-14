// Our bundler automatically creates styling when imported in the main JS file!
import '../styles/style.css'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';

console.log('Hello, world!');

function getData() {
	console.log("Grabbing new userdata...");

	fetch(
			"https://opensheet.elk.sh/1JTKk5zpB87MaeZzYJUnTSX2IsuHyLa8JF_l79Svn9P4/DisneylandParis"
		)
		.then((res) => res.json())
		.then((data) => {
			// console.log(data);

			// berekent het aantal attracties in elk Gebied
			console.log(d3.rollups(data, v => d3.count(v, d => d.Duur), d => d.Gebied.toLowerCase()));

			// berekent het aantal attracties in elk Gebied
			makeGraph1(d3.rollups(data, v => d3.count(v, d => d.Duur), d => d.Gebied.toLowerCase()));

			let aantalFantasyland = [];
			let aantalRest = 0;
			// array maken met aantal attracties fantasyland
			data.forEach((item) => {
				if (item.Gebied.toLowerCase() == "fantasyland") {
					aantalFantasyland.push([item.Naam, item.Duur]);
				} else {
					aantalRest++;
				}
			});
			console.log(aantalFantasyland);
		});
}

getData();

function makeGraph1(disneyData) {

	console.log(disneyData);
	// Code van een ander maar dit maakt een treemap
	// Bron: https://stackoverflow.com/questions/67155151/using-d3-js-to-create-a-simple-treemap
	/////////////////////////////////////////////////////////

	// sorteert de getallen in de array dankzij de [1]
	const data = disneyData.sort((a, b) => b[1] - a[1]);
	// telt het totaal van alle getallen in de verschillende arrays
	const sum = data.reduce((s, i) => {
		return s + i[1]
	}, 0);

	console.log(data);
	console.log(sum)

	const svg = d3.select("svg");
	const width = parseInt(svg.attr("width"));
	const height = parseInt(svg.attr("height"));
	const unit = (width * height) / sum;
	const bounds = {
		top: 0,
		left: 0,
		right: width,
		bottom: height
	};

	let weightLeft = sum;
	let x, y, w, h;

	// loopt door alle array's 
	data.forEach((d) => {
		console.log(d);
		const hSpace = bounds.right - bounds.left;
		const vSpace = bounds.bottom - bounds.top;
		const area = d[1] / unit;
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

		// maakt voor elke item een rect aan in de svg
		d3.select("svg")
			.append("rect")
			.on("click", e => {
				handleClick(d)
			})
			.attr("x", x)
			.attr("y", y)
			.attr("width", w)
			.attr("height", h)
			.style("stroke", "white")
			.style("stroke-width", 10)
			.style("fill", "url(#a)")


		// maakt voor elke item een text aan in de svg
		d3.select("svg")
			.append("text")
			.text(d[0])
			.attr("x", x + w / 2)
			.attr("y", y + h / 2)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.style("fill", "Black")
			.style("font-size", "0.8em")
			.style("font-weight", "bold");
	});
}

// functie die een tooltip laat verschijnen wanneer je op een item klikt
function handleClick(data) {
	document.querySelector('.tooltip').innerHTML = data[0]
	console.log(data);

	d3.select(".tooltip")
		.style("opacity", 1)
}