// src/routes/scrape.js
import puppeteer from "puppeteer";
import fs from "fs";
import "dotenv/config";

async function scrapeClassrooms(page) {
	const outputData = [];
	const data = await page.evaluate(() => {
		const selector = ".et_pb_section_2 .et_pb_row_5";
		const allCompaniesInA = `${selector} .et_pb_text_5`;
		const allCompaniesInB = `${selector} .et_pb_text_6`;
		const allCompaniesInC = `${selector} .et_pb_text_7`;
		const allCompaniesInAElement = document.querySelector(allCompaniesInA);
		const allCompaniesInBElement = document.querySelector(allCompaniesInB);
		const allCompaniesInCElement = document.querySelector(allCompaniesInC);

		const A214 = allCompaniesInAElement.querySelectorAll("p")[0].textContent.split("\n");
		const A215 = allCompaniesInAElement.querySelectorAll("p")[1].textContent.split("\n");
		const A218 = allCompaniesInAElement.querySelectorAll("p")[2].textContent.split("\n");

		const B201 = allCompaniesInBElement.querySelectorAll("p")[0].textContent.split("\n");
		const B202 = allCompaniesInBElement.querySelectorAll("p")[1].textContent.split("\n");
		const B204 = allCompaniesInBElement.querySelectorAll("p")[2].textContent.split("\n");
		const B205 = allCompaniesInBElement.querySelectorAll("p")[3].textContent.split("\n");

		const C201 = allCompaniesInCElement.querySelectorAll("p")[0].textContent.split("\n");
		const C204 = allCompaniesInCElement.querySelectorAll("p")[1].textContent.split("\n");
		const C205 = allCompaniesInCElement.querySelectorAll("p")[2].textContent.split("\n");
		const C208 = allCompaniesInCElement.querySelectorAll("p")[3].textContent.split("\n");

		const allClassrooms = {
			A: { A214, A215, A218 },
			B: { B201, B202, B204, B205 },
			C: { C201, C204, C205, C208 },
		};

		// console.log(JSON.stringify(outputA214));
		// Process and return the data you need
		const extractedData = allClassrooms ? allClassrooms : null;
		return extractedData;
	});
	// console.log(data);
	fs.writeFileSync("src/lib/data/classrooms.js", "export const sections = {\n");
	console.table(data);
	Object.values(data).forEach((section, j) => {
		if (j === 0) fs.appendFileSync("src/lib/data/classrooms.js", `A: [`);
		if (j === 1) fs.appendFileSync("src/lib/data/classrooms.js", `B: [`);
		if (j === 2) fs.appendFileSync("src/lib/data/classrooms.js", `C: [`);
		Object.values(section).forEach((classrooms) => {
			classrooms.forEach((room, i) => {
				if (i === 0) {
					fs.appendFileSync("src/lib/data/classrooms.js", `\n{\n${room}: [`);
				} else if (i > 0) {
					console.log("i", i);
					console.log("classrooms.length", classrooms.length);

					const patterns = [
						{
							pattern: /Edgeguide$/m,
							replacement: "EdgeGuide",
						},
						{
							pattern: /nordlo$/m,
							replacement: "Nordlo",
						},
						{
							pattern: /Orange Business Services$/m,
							replacement: "Orange Business",
						},
						{
							pattern: /3D Interactive sthlm$/m,
							replacement: "3D Interactive Sthlm",
						},
						{
							pattern: /Nordic station$/m,
							replacement: "Nordicstation",
						},
						{
							pattern: /Sweet systems$/m,
							replacement: "Sweet Systems",
						},
						{
							pattern: /Technia$/m,
							replacement: "TECHNIA",
						},
						{
							pattern: /Signupsoftware$/m,
							replacement: "SignUp Software",
						},
						{
							pattern: /AMF$/m,
							replacement: "AMF Tjänstepension",
						},
						{
							pattern: /Trafikverket$/m,
							replacement: "Trafikförvaltningen Region Stockholm",
						},
						{
							pattern: /Noa Ignite$/m,
							replacement: "NoA Ignite",
						},
					];

					patterns.forEach(({ pattern, replacement }) => {
						if (pattern.test(room)) {
							room = room.replace(pattern, replacement);
						}
					});

					if (i !== classrooms.length - 1) {
						fs.appendFileSync("src/lib/data/classrooms.js", `"${room}", `);
					} else if (i === classrooms.length - 1) {
						fs.appendFileSync("src/lib/data/classrooms.js", `"${room}"],`);
					}
				}
				console.log(room);
			});
			fs.appendFileSync("src/lib/data/classrooms.js", `\n},`);
		});
		fs.appendFileSync("src/lib/data/classrooms.js", `\n],\n `);
	});
	fs.appendFileSync("src/lib/data/classrooms.js", `\n}`);
}
async function scrapeMedverkande(page) {
	// Extract data from the specified selector
	const data = await page.evaluate(() => {
		const selector = "#medverkande > div.et_pb_row.et_pb_row_7.et_pb_row_4col";
		const element = document.querySelector(selector);

		// Process and return the data you need
		const extractedData = element ? element.textContent : null;
		return extractedData;
	});

	// Return the scraped data as JSON
	console.log(data);

	const medverkandeStart = "export const listOfCompanies = [";
	let medverkandeData = data
		// .toLowerCase()
		.split("\n")
		.map((a) => a.trim())
		.filter((line) => line.length > 0)
		.map((a) => `\n"${a}"`)
		.join(",");
	const medverkandeEnd = "];";
	// ? fixing data to work
	medverkandeData = medverkandeData.replace("3D interactive sthlm", "3D Interactive Sthlm");
	medverkandeData = medverkandeData.replace("Extendar Retail", "Extenda Retail");
	medverkandeData = medverkandeData.replace('"Azeon"', '"Azeo"');
	const medverkandeOutput = medverkandeStart + medverkandeData + medverkandeEnd;

	fs.writeFileSync("src/lib/data/medverkande.js", medverkandeOutput);
}

async function scrapeCompanies(page) {
	let start = 4;
	let end = 49;
	fs.writeFileSync("src/lib/data/test.js", "export const companiesData = {\n");

	for (let i = start; i <= end; i++) {
		const selector = `.et_pb_section_${i}`;
		await page.waitForSelector(selector);
		let data = await page.evaluate((selector) => {
			const element = document.querySelector(selector);
			if (element) {
				let companyName;
				const h2 = element.querySelector("h2");
				const h3 = element.querySelector("h3");

				// IBM is h3 for some reason
				if (h2) {
					companyName = h2.textContent.trim();
				} else if (h3) {
					companyName = h3.textContent.trim();
				}

				const omOss = ["Om oss/att jobba med oss:"];
				const merOmOss = ["Mer om oss:"];
				const interestedIn = ["Vi är intresserade av dig som studerar:"];
				const interests = ["Vi är intresserade av att:"];
				const contact = ["Kontakta mig om du har frågor"];

				const headings = element.querySelectorAll("h4");
				headings.forEach((heading, i) => {
					const sibling = heading.nextElementSibling;

					if (heading.textContent.trim() === "Om oss/att jobba hos oss:") {
						omOss.push(sibling.textContent.trim());
					}
					if (heading.textContent.trim() === "Mer om oss:") {
						const links = sibling.querySelectorAll("a");
						let output = "";
						links.forEach((link) => {
							console.log(link.innerHTML);
							console.log(link.href);
							output += `${link.innerHTML} (${link.href})\n`;
						});
						merOmOss.push(output);
					}
					if (heading.textContent.trim() === "Vi är intresserade av dig som studerar:") {
						let content = sibling.textContent.trim();
						const patterns = [
							{
								pattern:
									/Mjukvaruutvecklare, Inbyggda system och IoT \(Internet of Things-utvecklare$/m,
								replacement:
									"Mjukvaruutvecklare, Inbyggda system och IoT (Internet of Things-utvecklare)",
							},
							{
								pattern: /Mjukvaruutvecklare, Inbyggda system och IoT$/m,
								replacement:
									"Mjukvaruutvecklare, Inbyggda system och IoT (Internet of Things-utvecklare)",
							},
							{
								pattern: /Business Intelligence-analytiker$/m,
								replacement: "Business Intelligence – analytiker",
							},
							{
								pattern: /Mjukvaruutvecklare inbyggda system och IOT$/m,
								replacement:
									"Mjukvaruutvecklare, Inbyggda system och IoT (Internet of Things-utvecklare)",
							},
							{
								pattern: /Programutvecklare .NET:$/m,
								replacement: "Programutvecklare .NET",
							},
						];

						patterns.forEach(({ pattern, replacement }) => {
							if (pattern.test(content)) {
								content = content.replace(pattern, replacement);
							}
						});
						interestedIn.push(content);
					}
					if (heading.textContent.trim() === "Vi är intresserade av att:") {
						interests.push(sibling.textContent.trim());
					}
					if (heading.textContent.trim() === "Kontakta mig om du har frågor") {
						const links = sibling.querySelectorAll("a");
						if (links) {
							let text = sibling.textContent.trim();
							// ! makes mailto a bit buggy for now
							links.forEach((link) => {
								if (`mailto:${link.innerText}` !== link.href) {
									text = text.replace(link.innerText, `${link.innerText} (${link.href})`);
								}
							});
							contact.push(text);
						} else {
							contact.push(sibling.textContent.trim());
						}
					}
				});
				return { companyName, omOss, merOmOss, interestedIn, interests, contact };
			}
			// ? selector here is needed to pass arguments into data.evaluate()
		}, selector);
		console.log(data.companyName);
		// console.log(data.omOss);
		// console.log(data.merOmOss);
		// console.log(data.interestedIn);
		// console.log(data.interests);
		// console.log(data.contact);

		const companyData =
			`"${data.companyName}": \`${data.companyName}\n` +
			data.omOss.join("\n") +
			"\n" +
			"\n" +
			data.merOmOss.join("\n") +
			"\n" +
			data.interestedIn.join("\n") +
			"\n" +
			"\n" +
			data.interests.join("\n") +
			"\n" +
			"\n" +
			data.contact.join("\n") +
			`\n\`,\n`;

		fs.appendFileSync("src/lib/data/test.js", companyData);
  }
  fs.appendFileSync("src/lib/data/test.js", "}");
}

export async function get() {
	try {
		// Launch a headless browser
		const browser = await puppeteer.launch({ headless: "new" });

		// Create a new page
		const page = await browser.newPage();

		page.on("console", (message) => {
			if (message.type() === "log") {
				console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
			}
		});
		// page.on("pageerror", ({ message }) => console.log(message));
		// not needed this time
		// .on("response", (response) => console.log(`${response.status()} ${response.url()}`))
		// .on("requestfailed", (request) =>
		// 	console.log(`${request.failure().errorText} ${request.url()}`)
		// );

		// Navigate to the URL you want to scrape
		await page.goto(process.env.SCRAPE_TARGET); // Replace with the URL of the website you want to scrape

		// await scrapeMedverkande(page);
		await scrapeCompanies(page);
		// fs.appendFileSync("src/lib/data/test.js", "}");
		// await scrapeClassrooms(page);

		// Close the browser
		await browser.close();
	} catch (error) {
		console.log(error);
	}
}

get();
